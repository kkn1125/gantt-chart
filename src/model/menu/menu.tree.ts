import { MenuBranch } from "./menu.branch";
import { MenuInterface } from "./menu.impl";
import { MenuLeaf } from "./menu.leaf";

export class MenuTree implements MenuInterface {
  items: (MenuBranch | MenuLeaf)[] = [];

  addLeaf(leaf: MenuLeaf) {
    this.items.push(leaf);
  }

  addBranch(branch: MenuBranch) {
    this.items.push(branch);
  }
}
