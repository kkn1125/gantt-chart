import packageJson from "../../package.json";

export const WRAP_SHEETS = document.querySelector(
  "#wrap-sheets"
) as HTMLDivElement;
export const SHEET_FILES = document.querySelector(
  "#wrap-sheets-files"
) as HTMLDivElement;
export const APP = document.querySelector("#app") as HTMLDivElement;
export const MAIN = document.querySelector("#main") as HTMLDivElement;

export const createEl = (element: string) => document.createElement(element);
export const MENU = document.querySelector("#menu") as HTMLDivElement;
export const HEADER = document.querySelector("#header") as HTMLDivElement;
export const PANEL = document.querySelector("#panel") as HTMLDivElement;
export const BOARD = document.querySelector("#board") as HTMLDivElement;
export const MESSAGE = {
  NO_SELECTED_CELL: "선택한 셀이 없습니다!",
  CANT_CONCAT: "thead와 tbody는 함께 혼합 할 수 없습니다.",
  CANT_SPLIT: "thead와 tbody는 함께 분해 할 수 없습니다.",
  REMOVE_COLUMN_DENIED: "열은 최소 1개가 존재해야합니다.",
  REMOVE_ROW_DENIED: "행은 최소 1개가 존재해야합니다.",
} as const;
type MESSAGE = (typeof MESSAGE)[keyof typeof MESSAGE];
export const VALUE = {
  DEFAULT_CELL_CONTENT: "",
} as const;
type VALUE = (typeof VALUE)[keyof typeof VALUE];
export { packageJson };
