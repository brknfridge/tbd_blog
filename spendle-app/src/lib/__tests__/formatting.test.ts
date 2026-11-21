import { formatINR, sanitizeDigits, formatDigits, digitsToNumber, formatPercent, groupIndian, formatINRWords } from "../formatting";

describe("Indian currency formatting", () => {
  it.each([
    [0, "0"],
    [999, "999"],
    [1250, "1,250"],
    [125000, "1,25,000"],
    [12500000, "1,25,00,000"],
    [1000000000, "1,00,00,00,000"],
  ])("%i → %s", (n, s) => expect(groupIndian(n)).toBe(s));
  it("prefixes ₹", () => expect(formatINR(125000)).toBe("₹1,25,000"));
  it("reads big numbers in lakh/crore", () => {
    expect(formatINRWords(12500000)).toBe("₹1.25 crore");
    expect(formatINRWords(340000)).toBe("₹3.4 lakh");
    expect(formatINRWords(9999)).toBeNull();
  });
});

describe("price input sanitising", () => {
  it("keeps digits only", () => expect(sanitizeDigits("₹1,25,000.50")).toBe("12500050"));
  it("drops leading zeros and negatives", () => {
    expect(sanitizeDigits("-0042")).toBe("42");
    expect(sanitizeDigits("000")).toBe("");
  });
  it("caps at ₹100 crore", () => {
    expect(sanitizeDigits("99999999999999")).toBe("1000000000");
    expect(digitsToNumber(sanitizeDigits("1000000001"))).toBe(1_000_000_000);
  });
  it("formats as typed", () => expect(formatDigits("12500000")).toBe("1,25,00,000"));
  it("rejects empty", () => expect(digitsToNumber("")).toBeNull());
});

describe("formatPercent", () => {
  it.each([
    [19.21, "+19.2%"],
    [-27, "−27%"],
    [0, "0%"],
    [0.01, "0%"],
    [1150.4, "+1,150%"],
    [-99.96, "−100%"],
  ])("%f → %s", (p, s) => expect(formatPercent(p)).toBe(s));
});
