import Logger from "@/module/logger";
import TableEngine from "./table.engine";
import ControlPanel from "@/module/control.panel";
import EventManager from "@/module/event.manager";
import StorageManager from "@/module/storage.manager";
import ToolManager from "@/module/tool.manager";
import MenuManager from "@/module/menu.manager";
import Ui from "@/module/ui.manager";

export default class GanttChart {
  logger: Logger;
  ui: Ui;
  engine: TableEngine;
  controlPanel: ControlPanel;
  menuManager: MenuManager;
  toolManager: ToolManager;
  storageManager: StorageManager;
  eventManager: EventManager;

  constructor() {
    this.logger = new Logger();
    this.ui = new Ui();
    this.engine = new TableEngine();
    this.controlPanel = new ControlPanel();
    this.menuManager = new MenuManager();
    this.toolManager = new ToolManager();
    this.storageManager = new StorageManager();
    this.eventManager = new EventManager();

    this.eventManager.bulkInjection([
      this.ui,
      this.engine,
      this.controlPanel,
      this.menuManager,
      this.toolManager,
      this.storageManager,
    ]);
    this.ui.bulkInjection([
      this.toolManager,
      this.menuManager,
      this.storageManager,
    ]);
    this.menuManager.bulkInjection([this.toolManager, this.storageManager]);
    this.toolManager.bulkInjection([this.storageManager]);
    this.storageManager.bulkInjection([this.ui]);
  }

  setup() {
    // draw ui
    this.logger.debug("setup");
    this.loadStorage();
    this.setupMenu();
    this.setupPanel();
    this.setupTool();
    this.setupUi();
  }

  loadStorage() {
    this.logger.debug("load storage");
    // this.storageManager.loadStorage();
    this.storageManager.initialize();
  }

  setupMenu() {
    this.menuManager.setupMenu();
  }

  setupPanel() {}
  setupTool() {}
  setupUi() {
    this.ui.setupUi();
  }
}
