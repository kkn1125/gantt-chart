import { createEl } from "@/util/globa";

export default class Cell {
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
    if (xOrItem instanceof Object) {
      const { id, x, y, content, type, style, option, posX, posY } =
        xOrItem as CellType;
      this.id = id;
      this.x = x;
      this.y = y;
      this.type = type;
      this.content = content;
      this.style = style;
      this.option = option;
      this.posX = posX;
      this.posY = posY;
    } else {
      Cell.id += 1;
      this.id = Cell.id;
      this.x = xOrItem as number;
      this.y = y as number;
      this.type = type || "td";

      this.posX = 0;
      this.posY = 0;

      if (content) {
        this.content = content;
      }
    }
  }

  load({ id, x, y, content, type, posX, posY }: CellType) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.posX = posX;
    this.posY = posY;
    this.content = content;
    this.type = type;
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
    el.innerText = this.content;
    el.classList.add("cell");

    Object.assign(el, this.option);
    Object.assign(el.style, this.style);
    return el;
  }
}
