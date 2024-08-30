import { IChildren } from "./interfaces/IChildren";
import { Foldable } from "./interfaces/Foldable";
import { IMenu } from "./interfaces/IMenu";
import { Leaf } from "./Leaf";
import { Tree } from "./Tree";

export class Branch implements IMenu, IChildren, Foldable {
  parent: Branch | Tree | null = null;

  name: string;

  items: (Branch | Leaf)[] = [];
  isOpen: boolean = false;
  isRoot: boolean;

  constructor(name: string, isRoot: boolean = false) {
    this.name = name;
    this.isRoot = isRoot;
  }

  addLeaf(leaf: Leaf): void {
    leaf.parent = this;
    this.items.push(leaf);
  }

  addBranch(branch: Branch): void {
    branch.parent = this;
    this.items.push(branch);
  }

  toggleOpen(): void {
    this.isOpen = !this.isOpen;
  }

  open(): void {
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
  }
}
