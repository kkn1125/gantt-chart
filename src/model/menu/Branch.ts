import { IChildren } from "./interfaces/IChildren";
import { Foldable } from "./interfaces/Foldable";
import { IMenu } from "./interfaces/IMenu";
import { Leaf } from "./Leaf";
import { Tree } from "./Tree";
import { IUIModule } from "@model/ui/IUIModule";
import { UI } from "@model/ui/UI";

export class Branch implements IMenu, IChildren, Foldable, IUIModule {
  parent: Branch | Tree | null = null;

  id: string = "";
  name: string;

  items: (Branch | Leaf)[] = [];
  isOpen: boolean = false;
  isRoot: boolean;

  target: SharpText = "#branch";
  template: string = ``;

  constructor(name: string, isRoot: boolean = false) {
    this.id = name;
    this.name = name;
    this.isRoot = isRoot;
    this.target = ("#" + name) as SharpText;
  }

  setTarget(target: SharpText) {
    this.target = target;
  }

  setTemplate(template: string) {
    this.template = template;
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
