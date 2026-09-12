import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({
  prisma: {
    product: {
      count: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/db";
import { getProductById, listCategories, listProducts, PRODUCTS_PAGE_SIZE } from "@/lib/products";
import type { Product as ProductModel } from "@/app/generated/prisma/client";

const mockProduct = (overrides: Partial<Record<string, unknown>> = {}) =>
  ({
    id: "prod-1",
    name: "Whole Milk",
    category: "Dairy",
    price: 3.79,
    unit: "gallon",
    imageUrl: "/categories/dairy.svg",
    description: "Fresh whole milk.",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    ...overrides,
  }) as unknown as ProductModel;

describe("listProducts", () => {
  beforeEach(() => {
    vi.mocked(prisma.product.count).mockReset();
    vi.mocked(prisma.product.findMany).mockReset();
  });

  it("queries with no filters when search and category are omitted", async () => {
    vi.mocked(prisma.product.count).mockResolvedValue(1);
    vi.mocked(prisma.product.findMany).mockResolvedValue([mockProduct()]);

    const result = await listProducts();

    expect(prisma.product.count).toHaveBeenCalledWith({ where: {} });
    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: {} })
    );
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toMatchObject({
      id: "prod-1",
      name: "Whole Milk",
      price: 3.79,
    });
  });

  it("filters by search term", async () => {
    vi.mocked(prisma.product.count).mockResolvedValue(1);
    vi.mocked(prisma.product.findMany).mockResolvedValue([mockProduct()]);

    await listProducts({ search: "milk" });

    expect(prisma.product.count).toHaveBeenCalledWith({
      where: { name: { contains: "milk" } },
    });
  });

  it("filters by category", async () => {
    vi.mocked(prisma.product.count).mockResolvedValue(1);
    vi.mocked(prisma.product.findMany).mockResolvedValue([mockProduct()]);

    await listProducts({ category: "Dairy" });

    expect(prisma.product.count).toHaveBeenCalledWith({
      where: { category: "Dairy" },
    });
  });

  it("filters by search and category combined", async () => {
    vi.mocked(prisma.product.count).mockResolvedValue(1);
    vi.mocked(prisma.product.findMany).mockResolvedValue([mockProduct()]);

    await listProducts({ search: "milk", category: "Dairy" });

    expect(prisma.product.count).toHaveBeenCalledWith({
      where: { name: { contains: "milk" }, category: "Dairy" },
    });
  });

  it("returns an empty result set when nothing matches", async () => {
    vi.mocked(prisma.product.count).mockResolvedValue(0);
    vi.mocked(prisma.product.findMany).mockResolvedValue([]);

    const result = await listProducts({ search: "nope" });

    expect(result.items).toEqual([]);
    expect(result.totalPages).toBe(1);
    expect(result.page).toBe(1);
  });

  it("paginates using the default page size, defaulting to page 1", async () => {
    vi.mocked(prisma.product.count).mockResolvedValue(50);
    vi.mocked(prisma.product.findMany).mockResolvedValue([mockProduct()]);

    const result = await listProducts();

    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: PRODUCTS_PAGE_SIZE })
    );
    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(Math.ceil(50 / PRODUCTS_PAGE_SIZE));
  });

  it("paginates to a specific requested page within range", async () => {
    vi.mocked(prisma.product.count).mockResolvedValue(50);
    vi.mocked(prisma.product.findMany).mockResolvedValue([mockProduct()]);

    const result = await listProducts({ page: 2, pageSize: 24 });

    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 24, take: 24 })
    );
    expect(result.page).toBe(2);
    expect(result.totalPages).toBe(3);
  });

  it("clamps a requested page above the last page down to the last page", async () => {
    vi.mocked(prisma.product.count).mockResolvedValue(50);
    vi.mocked(prisma.product.findMany).mockResolvedValue([mockProduct()]);

    const result = await listProducts({ page: 999, pageSize: 24 });

    expect(result.page).toBe(3);
    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 48, take: 24 })
    );
  });

  it("clamps a requested page below 1 up to page 1", async () => {
    vi.mocked(prisma.product.count).mockResolvedValue(50);
    vi.mocked(prisma.product.findMany).mockResolvedValue([mockProduct()]);

    const result = await listProducts({ page: 0, pageSize: 24 });

    expect(result.page).toBe(1);
  });

  it("returns page 1 of 1 when there are zero total results", async () => {
    vi.mocked(prisma.product.count).mockResolvedValue(0);
    vi.mocked(prisma.product.findMany).mockResolvedValue([]);

    const result = await listProducts({ page: 5 });

    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(1);
  });
});

describe("listCategories", () => {
  it("returns the distinct category names", async () => {
    vi.mocked(prisma.product.findMany).mockResolvedValue([
      { category: "Bakery" },
      { category: "Dairy" },
    ] as unknown as ProductModel[]);

    const result = await listCategories();

    expect(result).toEqual(["Bakery", "Dairy"]);
    expect(prisma.product.findMany).toHaveBeenCalledWith({
      distinct: ["category"],
      select: { category: true },
      orderBy: { category: "asc" },
    });
  });
});

describe("getProductById", () => {
  it("returns the product detail when found", async () => {
    vi.mocked(prisma.product.findUnique).mockResolvedValue(mockProduct());

    const result = await getProductById("prod-1");

    expect(result).toMatchObject({ id: "prod-1", name: "Whole Milk" });
  });

  it("returns null when not found", async () => {
    vi.mocked(prisma.product.findUnique).mockResolvedValue(null);

    const result = await getProductById("missing");

    expect(result).toBeNull();
  });
});
