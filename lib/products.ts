import { prisma } from "@/lib/db";
import type { Product as ProductModel } from "@/app/generated/prisma/client";

export type ProductSummary = {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  imageUrl: string;
};

export type ProductDetail = ProductSummary & {
  description: string;
};

function toProductDetail(product: ProductModel): ProductDetail {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: Number(product.price),
    unit: product.unit,
    imageUrl: product.imageUrl,
    description: product.description,
  };
}

export const PRODUCTS_PAGE_SIZE = 24;

export type ProductPage = {
  items: ProductDetail[];
  page: number;
  totalPages: number;
};

export async function listProducts(options: {
  search?: string;
  category?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<ProductPage> {
  const { search, category, pageSize = PRODUCTS_PAGE_SIZE } = options;

  const where = {
    ...(search ? { name: { contains: search } } : {}),
    ...(category ? { category } : {}),
  };

  const totalCount = await prisma.product.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const requestedPage = options.page ?? 1;
  const page = Math.min(Math.max(1, requestedPage), totalPages);

  const products = await prisma.product.findMany({
    where,
    orderBy: { name: "asc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return { items: products.map(toProductDetail), page, totalPages };
}

export async function listCategories(): Promise<string[]> {
  const rows = await prisma.product.findMany({
    distinct: ["category"],
    select: { category: true },
    orderBy: { category: "asc" },
  });
  return rows.map((row) => row.category);
}

export async function getProductById(
  id: string
): Promise<ProductDetail | null> {
  const product = await prisma.product.findUnique({ where: { id } });
  return product ? toProductDetail(product) : null;
}
