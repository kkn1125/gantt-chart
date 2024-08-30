import { Branch } from "./Branch";
import { IChildren } from "./interfaces/IChildren";
import { IMenu } from "./interfaces/IMenu";
import { Tree } from "./Tree";

export class Leaf implements IMenu, IChildren {
  parent: Branch | Tree | null = null;
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  run() {}
}
