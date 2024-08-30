import { Branch } from "../Branch";
import { Leaf } from "../Leaf";

export abstract class Foldable {
  abstract items: (Branch | Leaf)[];
  abstract isOpen: boolean;
  abstract isRoot: boolean;
  toggleOpen() {
    this.isOpen = !this.isOpen;
  }
  open() {
    this.isOpen = true;
  }
  close() {
    this.isOpen = false;
  }
  addLeaf(leaf: Leaf) {
    this.items.push(leaf);
  }
  addBranch(branch: Branch) {
    this.items.push(branch);
  }
}
