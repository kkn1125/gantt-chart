import { Branch } from "./Branch";
import { Foldable } from "./interfaces/Foldable";
import { Leaf } from "./Leaf";

export class Tree implements Foldable {
  private _update: number = 0;
  name: string;

  items: (Branch | Leaf)[] = [];
  isOpen: boolean = false;
  isRoot: boolean;

  constructor(name: string, isRoot: boolean = false) {
    this.name = name;
    this.isRoot = isRoot;
  }

  static copy(tree: Tree): Tree {
    const newTree = new Tree(tree.name);
    newTree._update = tree._update;
    newTree.items = tree.items;
    newTree.isOpen = tree.isOpen;
    return newTree;
  }

  update(): Tree {
    this._update += 1;
    return Tree.copy(this);
  }

  addLeaf(leaf: Leaf): void {
    if (!(leaf instanceof Leaf)) throw new TypeError("invalid type");
    leaf.parent = this;
    this.items.push(leaf);
  }

  addBranch(branch: Branch): void {
    if (!(branch instanceof Branch)) throw new TypeError("invalid type");
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
