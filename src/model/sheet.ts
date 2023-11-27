import Logger from "@/module/logger";
import Cell from "./cell";

export default class Sheet {
  logger: Logger;

  static id: number = -1;
  id: number;

  name: string = "sheet";

  content: {
    head: Cell[][];
    body: Cell[][];
  } = {
    head: [],
    body: [],
  };
  constructor();
  constructor(
    data:
      | {
          id: number;
          name: string;
          content: {
            head: Cell[][];
            body: Cell[][];
          };
        }
      | Sheet
  );
  constructor(
    data?:
      | {
          id: number;
          name: string;
          content: {
            head: Cell[][];
            body: Cell[][];
          };
        }
      | Sheet
  ) {
    this.logger = new Logger(this.constructor.name);
    if (data) {
      const { id, name, content } = data;
      Sheet.id = id + 1;
      this.id = id;
      this.name = name;
      this.content.head = content.head.map((row) =>
        row.map((head) => new Cell(head as unknown as CellType))
      );
      this.content.body = content.body.map((row) =>
        row.map((body) => new Cell(body as unknown as CellType))
      );
      this.logger.setContext(this.constructor.name + "|" + this.id);
      this.logger.log(this.content.body);
    } else {
      Sheet.id += 1;
      this.id = Sheet.id;

      if (this.id > 0) {
        this.name = `${this.name} (${this.id})`;
      }
      this.content.head = [[new Cell(0, 0, "th")]];
      this.content.body = [[new Cell(0, 0, "td")]];
      this.logger.setContext(this.constructor.name + "|" + this.id);
    }
  }

  rename(name: string) {
    this.name = name;
  }

  save(head: Cell[][], body: Cell[][]) {
    console.log(this, this.content);
    this.content.head = head;
    this.content.body = body;
  }
}
