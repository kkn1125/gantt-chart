import { UI } from "./UI";

export abstract class IUIModule {
  abstract target: SharpText;
  abstract template: string;
  setTarget(target: SharpText) {
    this.target = target;
  }

  setTemplate(template: string) {
    this.template = template;
  }
  abstract view: (ui: UI) => { target: SharpText; template: string };
}
