import TableEngine from "@/core/table.engine";
import ControlPanel from "@/module/control.panel";
import MenuManager from "@/module/menu.manager";
import StorageManager from "@/module/storage.manager";
import ToolManager from "@/module/tool.manager";
import Ui from "@/module/ui.manager";

declare global {
  declare interface Window {}
  declare interface Dependency {
    Ui: Ui;
    TableEngine: TableEngine;
    ControlPanel: ControlPanel;
    MenuManager: MenuManager;
    ToolManager: ToolManager;
    StorageManager: StorageManager;
  }

  declare type DropdownMenuNames = "file" | "tool" | "about";

  // declare type DropdownMenuItem = {
  //   group: string;
  //   name: string;
  //   feature: () => void;
  // };

  // declare type DropdownMenu = {
  //   file: DropdownMenuItem[];
  //   tool: DropdownMenuItem[];
  //   about: DropdownMenuItem[];
  // };
}
