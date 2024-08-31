import { select } from "@src/util/select";
import { IUIModule } from "./IUIModule";

export class UI {
  module: IUIModule;

  constructor(module: IUIModule) {
    this.module = module;
  }

  private render(element: HTMLElement, template: string) {
    if (element) {
      element.innerHTML = template;
    }
  }

  run() {
    const { target, template } = this.module.view(this);
    this.render(select(target), template);
  }
  // render(target: string, ui: UI) {
  //   // const el = document.querySelector(target);
  //   // if (el) {
  //   //   el.innerHTML = ui.render();
  //   // }
  //   ui.render(target, ui);
  // }
}
