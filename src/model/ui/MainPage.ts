import { ILogger } from "@src/util/ILogger";
import { IUIModule } from "./IUIModule";

export class MainPage extends ILogger implements IUIModule {
  constructor() {
    super();
    this.logger.setContext(this);
  }

  view() {
    this.logger.debug("view");
  }
}
