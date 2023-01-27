import { describe, it, expect } from "vitest";

import { isEmpty } from "@/helpers/useValidators";

describe("Test validators", () => {
  it("string is empty", () => {
    expect(isEmpty("")).toBe(true);
  });
  it("string is not empty", () => {
    expect(isEmpty("qwerty")).toBe(false);
  });
});
