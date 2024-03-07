import Logger from "@/module/logger";
import { VALUE, createEl } from "@/util/global";

export default class Cell {
  logger: Logger;
  static id: number = -1;
  id: number;
  x: number;
  y: number;
  posX: number;
  posY: number;
  content: string = "🛠️ 내용을 입력해주세요";
  type: "th" | "td" = "td";
  style: Partial<CSSStyleDeclaration> = {};
  option: Partial<HTMLTableCellElement> = {};
  selected: boolean = false;

  constructor(item: CellType);
  constructor(x: number, y?: number, type?: "th" | "td", content?: string);
  constructor(
    xOrItem: number | CellType,
    y?: number,
    type?: "th" | "td",
    content?: string
  ) {
    this.logger = new Logger(this.constructor.name);
    if (xOrItem instanceof Object) {
      const { id, x, y, content, type, style, option, posX, posY, selected } =
        xOrItem as CellType;
      this.id = id;
      this.x = x;
      this.y = y;
      this.type = type;
      this.content = content || VALUE.DEFAULT_CELL_CONTENT;
      this.style = style;
      this.option = option;
      this.posX = posX;
      this.posY = posY;
      this.selected = selected;
    } else {
      Cell.id += 1;
      this.id = Cell.id;
      this.x = xOrItem as number;
      this.y = y as number;
      this.type = type || "td";

      this.posX = 0;
      this.posY = 0;

      this.content = content || VALUE.DEFAULT_CELL_CONTENT;
    }
  }

  load({
    id,
    x,
    y,
    content,
    type,
    posX,
    posY,
    selected,
    style,
    option,
  }: CellType) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.posX = posX;
    this.posY = posY;
    this.content = content;
    this.type = type;
    this.selected = selected;
    this.style = style;
    this.option = option;
  }

  setContent(content: string) {
    this.content = content;
  }

  render() {
    const el = createEl(this.type) as HTMLTableCellElement;
    el.style.cssText = `padding: 0.5rem 1rem;`;
    el.dataset.id = "" + this.id;
    el.dataset.x = "" + this.x;
    el.dataset.y = "" + this.y;
    el.dataset.type = this.type;
    Object.assign(el, this.option);
    Object.assign(el.style, this.style);
    el.innerText = this.content;
    el.classList.add("cell");

    if (this.selected) {
      el.setAttribute("selected", "");
    }

    return el;
  }
}
