import Sheet from "@/model/sheet";
import BaseModule from "./base.module";
import Logger from "./logger";

export default class ToolManager extends BaseModule {
  logger: Logger;

  constructor() {
    super();
    this.logger = new Logger(this.constructor.name);
    this.logger.debug("initialize tool");
  }

  createNewSheet() {
    this.dependencies.StorageManager.addSheet(new Sheet());
  }

  async requestFullScreen() {
    try {
      await document.body.requestFullscreen();
    } catch (err: any) {
      alert(
        `Error attempting to enable fullscreen mode: ${err.message} (${err.name})`
      );
    }
  }

  async exitFullScreen() {
    await document.exitFullscreen();
  }
}
