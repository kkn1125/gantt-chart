import { MenuBranch } from "./menu.branch";
import { MenuLeaf } from "./menu.leaf";

export abstract class MenuInterface {
  abstract items: (MenuLeaf | MenuBranch)[];

  addLeaf(leaf: MenuLeaf) {
    this.items.push(leaf);
  }
  addBranch(branch: MenuBranch) {
    this.items.push(branch);
  }
}
