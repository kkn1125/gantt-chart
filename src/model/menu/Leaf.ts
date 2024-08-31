import { IUIModule } from "@model/ui/IUIModule";
import { Branch } from "./Branch";
import { IChildren } from "./interfaces/IChildren";
import { IMenu } from "./interfaces/IMenu";
import { Tree } from "./Tree";
import { UI } from "@model/ui/UI";

export class Leaf implements IMenu, IChildren, IUIModule {
  parent: Branch | Tree | null = null;

  id: string;
  name: string;

  target: SharpText = "#leaf";
  template: string = ``;

  constructor(name: string) {
    this.id = name;
    this.name = name;
    this.target = ("#" + name) as SharpText;
  }
  setTarget(target: SharpText): void {
    this.target = target;
  }
  setTemplate(template: string): void {
    this.template = template;
  }

  view(ui: UI) {
    const handleOnce = (e: MouseEvent) => {
      if (
        e.target &&
        e.target instanceof HTMLElement &&
        e.target.id === this.id
      ) {
        window.removeEventListener("click", handleOnce);
        ui.run();
      }
    };
    window.addEventListener("click", handleOnce);
    this.setTemplate(`<div id="${this.id}">${this.name}</div>`);

    return {
      target: this.target,
      template: this.template,
    };
  }

  run() {}
}
