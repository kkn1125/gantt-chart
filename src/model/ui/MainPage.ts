import { ILogger } from "@src/util/ILogger";
import { IUIModule } from "./IUIModule";
import { UI } from "./UI";

export class MainPage extends ILogger implements IUIModule {
  target: SharpText;
  template = `<div id="menu-tree"></div>`;

  constructor(target: SharpText) {
    super();
    this.target = target;
    this.logger.setContext(this);
  }

  setTarget(target: SharpText): void {
    this.target = target;
  }

  setTemplate(template: string): void {
    this.template = template;
  }

  view(_: UI) {
    return {
      target: this.target,
      template: this.template,
    };
  }
}
