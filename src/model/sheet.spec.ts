import "jsdom";
import { describe, it, expect } from "vitest";
import Sheet from "./sheet";

describe("Sheet Test", () => {
  it("정의되어야 한다.", () => {
    const sheet = new Sheet();
    expect(sheet).toBeDefined();
  });
});
