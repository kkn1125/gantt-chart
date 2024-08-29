import { MenuInterface } from "./menu.impl";
import { MenuLeaf } from "./menu.leaf";

export class MenuBranch implements MenuInterface {
  items: (MenuBranch | MenuLeaf)[] = [];

  addLeaf(leaf: MenuLeaf): void {
    this.items.push(leaf);
  }
  addBranch(branch: MenuBranch): void {
    this.items.push(branch);
  }
}
