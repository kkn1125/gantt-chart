import { afterEach, describe, expect, it } from "vitest";
import { padding } from "./padding";

describe("텍스트 패딩 테스트", () => {
  let example: string | null;
  let result: string | null;

  afterEach(() => {
    example = null;
    result = null;
  });

  it("텍스트 길이보다 적게 입력했을 때", () => {
    example = "test";
    result = padding(example, 3);
    expect(result).toStrictEqual(example + " ");
  });

  it("텍스트 길이보다 크게 입력했을 때", () => {
    example = "김이박te";
    result = padding(example, 5);
    expect(result).toStrictEqual(example + " ");
  });
});
