import { describe, expect, it } from "vitest";

const formatPrice = (price: number) => `₹${price.toLocaleString("en-IN")}`;
const discountPercent = (price: number, compareAt: number) => Math.round((1 - price / compareAt) * 100);

describe("Veltra storefront pricing", () => {
  it("formats Indian rupee values with locale grouping", () => {
    expect(formatPrice(1999)).toBe("₹1,999");
    expect(formatPrice(999)).toBe("₹999");
  });

  it("calculates the displayed discount percentage", () => {
    expect(discountPercent(999, 1499)).toBe(33);
    expect(discountPercent(1200, 1200)).toBe(0);
  });
});
