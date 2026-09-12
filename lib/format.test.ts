import { describe, expect, it } from "vitest";
import { formatPrice } from "@/lib/format";

describe("formatPrice", () => {
  it("formats a whole number as USD currency", () => {
    expect(formatPrice(5)).toBe("$5.00");
  });

  it("formats a decimal value as USD currency", () => {
    expect(formatPrice(4.99)).toBe("$4.99");
  });

  it("formats zero as USD currency", () => {
    expect(formatPrice(0)).toBe("$0.00");
  });
});
