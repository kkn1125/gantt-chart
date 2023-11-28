import TableManager from "@/module/table.manager";
import MenuManager from "@/module/menu.manager";
import StorageManager from "@/module/storage.manager";
import ToolManager from "@/module/tool.manager";
import Ui from "@/module/ui.manager";
import PanelManager from "@/module/panel.manager";

declare global {
  declare interface Window {}

  declare interface Dependency {
    Ui: Ui;
    TableManager: TableManager;
    MenuManager: MenuManager;
    ToolManager: ToolManager;
    PanelManager: PanelManager;
    StorageManager: StorageManager;
  }

  declare type DropdownMenuNames = "file" | "tool" | "about";

  declare type CellType = {
    id: number;
    x: number;
    y: number;
    content: string;
    type: "th" | "td";
    posX: number;
    posY: number;
    style: Partial<CSSStyleDeclaration>;
    option: Partial<HTMLTableCellElement>;
    selected: boolean;
  };
}
