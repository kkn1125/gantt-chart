/**
 * @vitest-environment jsdom
 */

import { describe, expect, it } from "vitest";
import { select } from "./select";

describe("선택자 테스트", () => {
  it("선택자 # 제거", () => {
    const add = document.createElement("div");
    add.id = "test2";
    document.body.append(add);
    const result = select("#test");
    expect(result instanceof HTMLElement).toStrictEqual(false);
  });
});
