export default class Sheet {
  static id: number = -1;
  id: number;

  name: string = "sheet";

  constructor() {
    Sheet.id += 1;
    this.id = Sheet.id;

    if (this.id > 0) {
      this.name = `${this.name} (${this.id})`;
    }
  }

  rename(name: string) {
    this.name = name;
  }
}
