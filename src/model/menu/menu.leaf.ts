import { Tool } from "@model/tool/tool";

export class MenuLeaf {
  private tool: Tool;

  constructor(tool: Tool) {
    this.tool = tool;
  }

  run() {
    this.tool.run();
  }
}
