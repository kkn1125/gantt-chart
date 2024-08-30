import { IUIModule } from "./IUIModule";

export class UI {
  module: IUIModule;

  constructor(module: IUIModule) {
    this.module = module;
  }

  run() {
    this.module.view();
  }
  // render(target: string, ui: UI) {
  //   // const el = document.querySelector(target);
  //   // if (el) {
  //   //   el.innerHTML = ui.render();
  //   // }
  //   ui.render(target, ui);
  // }
}
