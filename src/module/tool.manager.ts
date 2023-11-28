import Sheet from "@/model/sheet";
import BaseModule from "./base.module";
import { APP } from "@/util/global";

export default class ToolManager extends BaseModule {
  constructor() {
    super();
  }

  createNewSheet() {
    this.dependencies.StorageManager.addSheet(new Sheet());
  }

  save() {
    this.logger.debug("save");
    this.dependencies.TableManager.saveTable();
    // this.dependencies.StorageManager.saveStorage();
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
