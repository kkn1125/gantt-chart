import { IUIModule } from "@model/ui/IUIModule";
import { Branch } from "./Branch";
import { Foldable } from "./interfaces/Foldable";
import { Leaf } from "./Leaf";
import { UI } from "@model/ui/UI";

export class Tree implements Foldable, IUIModule {
  private _update: number = 0;

  id = "tree";
  name: string;

  items: (Branch | Leaf)[] = [];
  isOpen: boolean = false;
  isRoot: boolean;

  target: SharpText = "#menu-tree";
  template: string = `
    test
  `;

  constructor(name: string, isRoot: boolean = false) {
    this.id = name;
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

  setTarget(target: SharpText) {
    this.target = target;
  }

  setTemplate(template: string) {
    this.template = template;
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

  view(ui: UI) {
    const handleOnce = (e: MouseEvent) => {
      if (
        e.target &&
        e.target instanceof HTMLElement &&
        e.target.id === this.id
      ) {
        this.toggleOpen();
        window.removeEventListener("click", handleOnce);
        ui.run();
      }
    };
    window.addEventListener("click", handleOnce);
    this.setTemplate(`<div>
        <div id="${this.id}">${this.name}</div>
        ${
          this.isOpen
            ? this.items.map((item) => `<div id=${item.id}>${item.name}</div>`)
            : ""
        }
      </div>`);
    return {
      target: this.target,
      template: this.template,
    };
  }
}
