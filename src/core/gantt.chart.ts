import BaseModule from "@/module/base.module";
import EventManager from "@/module/event.manager";
import MenuManager from "@/module/menu.manager";
import StorageManager from "@/module/storage.manager";
import ToolManager from "@/module/tool.manager";
import Ui from "@/module/ui.manager";
import TableManager from "../module/table.manager";

export default class GanttChart extends BaseModule {
  ui: Ui;

  tableManager: TableManager;
  menuManager: MenuManager;
  toolManager: ToolManager;
  storageManager: StorageManager;
  eventManager: EventManager;

  constructor() {
    super();

    /* load modules */
    this.logger.process("load modules...");

    this.ui = new Ui();
    this.tableManager = new TableManager();
    this.menuManager = new MenuManager();
    this.toolManager = new ToolManager();
    this.storageManager = new StorageManager();
    this.eventManager = new EventManager();

    /* load bulk modules */
    this.logger.process("load sub modules for each modules...");

    this.eventManager.bulkInjection([
      this.ui,
      this.tableManager,
      this.menuManager,
      this.toolManager,
      this.storageManager,
    ]);

    this.ui.bulkInjection([
      this.toolManager,
      this.tableManager,
      this.menuManager,
      this.storageManager,
    ]);

    this.tableManager.bulkInjection([
      this.ui,
      this.toolManager,
      this.storageManager,
    ]);

    this.menuManager.bulkInjection([this.toolManager, this.storageManager]);

    this.toolManager.bulkInjection([this.storageManager]);

    this.storageManager.bulkInjection([this.ui]);
  }

  setup() {
    // draw ui
    this.logger.process("setup modules");
    this.setupStorage();
    this.setupTables();
    this.setupEvents();
    this.setupMenu();
    this.setupUi();

    this.logger.debug("✨ ready to play!");
  }

  setupTables() {
    this.tableManager.initialize();
  }

  setupEvents() {
    this.eventManager.initialize();
  }

  setupStorage() {
    this.storageManager.initialize();
  }

  setupMenu() {
    this.menuManager.initialize();
  }

  setupUi() {
    this.ui.setupUi();
  }
}
