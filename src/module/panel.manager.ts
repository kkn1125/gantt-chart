import { PANEL } from "@/util/global";
import BaseModule from "./base.module";

type Item = {
  title: string;
  panel: HTMLElement | string;
};

interface Menu {
  title: string;
  item: Item[];
}

interface MenuList {
  common: Menu[];
}

export default class PanelManager extends BaseModule {
  private menuList: MenuList = {
    common: [],
  };
  /* 추후 확장 기능 */
  menuName: keyof MenuList = "common";
  currentMenu: Menu[] = [];
  width: number | string = "450px";

  previewColor = {
    r: 56,
    g: 125,
    b: 36,
    a: 255,
  };

  constructor() {
    super();

    this.menuList.common.push({
      title: "기본 스타일",
      item: [
        {
          title: "셀 비우기 옵션",
          panel: `
        <div class="cell-concat-options">
          <button class="" data-cell-feature="remove-style">스타일 제거</button>
          <button class="" data-cell-feature="remove-content">내용 제거</button>
        </div>
      `,
        },
        {
          title: "셀 추가 옵션",
          panel: `
        <div class="cell-concat-options">
          <button class="" data-cell-add="left"><box-icon name='left-arrow-alt'></box-icon></button>
          <button class="" data-cell-add="right"><box-icon name='right-arrow-alt'></box-icon></button>
          <button class="" data-cell-add="top"><box-icon name='up-arrow-alt'></box-icon></button>
          <button class="" data-cell-add="bottom"><box-icon name='down-arrow-alt'></box-icon></button>
        </div>
      `,
        },
        {
          title: "셀 제거 옵션",
          panel: `
        <div class="cell-concat-options">
          <button class="" data-cell-remove="row"><box-icon name='move-horizontal'></box-icon></button>
          <button class="" data-cell-remove="column"><box-icon name='move-vertical'></box-icon></button>
        </div>
      `,
        },
        {
          title: "셀 혼합 옵션",
          panel: `
        <div class="cell-concat-options">
          <button class="cell-concat-button" data-dir="all">concat</button>
          <button class="cell-concat-button" data-dir="split">split</button>
        </div>
      `,
        },
        {
          title: "셀 사이즈 옵션",
          panel: `
        <div class="cell-concat-options">
          <label>width
            <input name="width" type="number" min="-1" step="0.1" />
          </label>
          <label>height
            <input name="height" type="number" min="-1" step="0.1" />
          </label>
        </div>
      `,
        },
        {
          title: "색상 조절",
          panel: `
        <div>preview</div>
        <div id="preview-color"></div>
        <div class="palette">
          <input class="total" name="rgba" type="color" rgba />
          <input class="rgba" name="r" type="range" min="0" max="255" />
          <input class="rgba" name="g" type="range" min="0" max="255" />
          <input class="rgba" name="b" type="range" min="0" max="255" />
          <input class="rgba" name="a" type="range" min="0" max="255" />
        </div>
      `,
        },
        {
          title: "테두리 그리기 제어",
          panel: `
        <div>border</div>
        <div class="border-onoff">
          <label>
            <input name="border-switch-top" data-border-check="top" type="checkbox"></input>
            top
          </label>
          <div class="centered">
            <label>
              <input name="border-switch-left" data-border-check="left" type="checkbox"></input>
              left
            </label>
              <label>
                <input name="border-switch-all" data-border-check="all" type="checkbox"></input>
                all
              </label>
              <label>
                <input name="border-switch-right" data-border-check="right" type="checkbox"></input>
                right
              </label>
          </div>
          <label>
            <input name="border-switch-bottom" data-border-check="bottom" type="checkbox"></input>
            bottom
          </label>
        </div>
      `,
        },
      ],
    });
  }

  setWidth(width: number | string) {
    this.width = width;
  }

  setCurrentMenu(menu: keyof MenuList) {
    this.menuName = menu;
    this.loadMenu();
  }

  initialize() {
    this.logger.process("initialize panel manager");

    this.loadMenu();
    this.update();
  }

  loadMenu() {
    this.currentMenu = this.menuList[this.menuName];
  }

  openPanel() {
    this.previewUpdate();
    this.dependencies.Ui.openPanel(this.width);
  }

  updateInputBar() {
    const rgbaTool = document.querySelector(".palette");
    if (rgbaTool) {
      const r = rgbaTool.querySelector('[name="r"]') as HTMLInputElement;
      const g = rgbaTool.querySelector('[name="g"]') as HTMLInputElement;
      const b = rgbaTool.querySelector('[name="b"]') as HTMLInputElement;
      const a = rgbaTool.querySelector('[name="a"]') as HTMLInputElement;
      r.value = "" + this.previewColor.r;
      g.value = "" + this.previewColor.g;
      b.value = "" + this.previewColor.b;
      a.value = "" + this.previewColor.a;
    }
  }

  closePanel() {
    this.dependencies.Ui.closePanel();
    // this.dependencies.TableManager.initSelected();
  }

  isOpened() {
    return PANEL.classList.contains("open");
  }

  isOpenedSheetTool() {
    return !!document.querySelector("#sheet-tool");
  }

  clearPanel() {
    PANEL.innerHTML = "";
  }

  /* 셀 사이즈 초기화 */
  initializeSizeOptions() {
    const defaultValue = "0px";
    const cell = this.dependencies.TableManager.selected[0];
    const widthInput = document.querySelector(
      "input[name='width']"
    ) as HTMLInputElement;
    const heightInput = document.querySelector(
      "input[name='height']"
    ) as HTMLInputElement;
    if (widthInput) {
      widthInput.value =
        "" +
        Number(
          (
            "" +
            (cell.style.width === "auto"
              ? defaultValue
              : cell.style.width || defaultValue)
          )?.match(/[0-9]+/g)?.[0]
        );
    }
    if (heightInput) {
      heightInput.value =
        "" +
        Number(
          (
            "" +
            (cell.style.height === "auto"
              ? defaultValue
              : cell.style.height || defaultValue)
          )?.match(/[0-9]+/g)?.[0]
        );
    }
  }

  /* 셀 컬러 프리뷰 초기화 */
  initializeCellBackgroudColorSet() {
    const defaultColor = "#00000000";
    const cells = this.dependencies.TableManager.selected;
    const bgMap = cells.map(
      (cell) => cell.style.backgroundColor || defaultColor
    );
    const keyArray: string[] = [];
    const countArray: number[] = [];
    [...new Set(bgMap)].forEach((bg) => {
      keyArray.push(bg);
      countArray.push(0);
    });
    for (const bg of bgMap) {
      countArray[keyArray.indexOf(bg)] += 1;
    }
    const sorted = [...keyArray].sort((a, b) => {
      return countArray[keyArray.indexOf(b)] - countArray[keyArray.indexOf(a)];
    });
    const initialColor =
      (sorted[0] === defaultColor ? sorted[1] : sorted[0]) || defaultColor;
    this.previewColor = this.parseHexToRGBA(initialColor);
  }

  initializeCellBorders() {
    const inputs = document.querySelectorAll(
      `[name="border-switch-top"],[name="border-switch-bottom"],[name="border-switch-left"],[name="border-switch-right"],[name="border-switch-all"]`
    ) as unknown as HTMLInputElement[];
    const dirs = document.querySelectorAll(
      `[name="border-switch-top"],[name="border-switch-bottom"],[name="border-switch-left"],[name="border-switch-right"]`
    ) as unknown as HTMLInputElement[];
    const allInput = document.querySelector(
      `[name="border-switch-all"]`
    ) as HTMLInputElement;
    /* checkbox 초기화 */
    inputs.forEach((input) => {
      input.checked = false;
    });

    const input = (key: string) =>
      document.querySelector(
        `[name="border-switch-${key}"]`
      ) as HTMLInputElement;
    const cells = this.dependencies.TableManager.selected;
    const isActivated = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      all: 0,
    };

    for (const cell of cells) {
      const hasTop = cell.hasBorder("top");
      const hasBottom = cell.hasBorder("bottom");
      const hasLeft = cell.hasBorder("left");
      const hasRight = cell.hasBorder("right");
      const hasAll = hasTop && hasBottom && hasLeft && hasRight;

      if (hasAll) {
        isActivated.all += 1;
      }
      if (hasTop) {
        isActivated.top += 1;
      }
      if (hasBottom) {
        isActivated.bottom += 1;
      }
      if (hasLeft) {
        isActivated.left += 1;
      }
      if (hasRight) {
        isActivated.right += 1;
      }
    }
    const max = Math.max(...Object.values(isActivated));

    Object.entries(isActivated).forEach(([key, value]) => {
      if (value > max / 2) {
        input(key).checked = true;
      }
    });

    if ([...dirs].every((dir) => !!dir.checked)) {
      allInput.checked = true;
    } else {
      allInput.checked = false;
    }
  }

  parseHexToRGB(hex: string) {
    const [r, g, b] = hex
      .slice(1)
      .replace(/\B(?=(.{2})+(?!.))/g, " ")
      .split(" ");
    return {
      r: parseInt(r, 16),
      g: parseInt(g, 16),
      b: parseInt(b, 16),
      a: 255,
    };
  }

  parseHexToRGBA(hex: string) {
    const [r, g, b, a] = hex
      .slice(1)
      .replace(/\B(?=(.{2})+(?!.))/g, " ")
      .split(" ");
    return {
      r: parseInt(r, 16),
      g: parseInt(g, 16),
      b: parseInt(b, 16),
      a: parseInt(a, 16),
    };
  }

  previewUpdate() {
    const previewColor = document.querySelector(
      "#preview-color"
    ) as HTMLDivElement;

    previewColor.style.boxShadow =
      "inset 0 0 0 99999999999px" + this.getBackgroundColor();
    // this.logger.log("hex", previewColor.style.backgroundColor);
    this.updateInputBar();
  }

  getBackgroundColor() {
    const { r, g, b, a } = this.previewColor;
    return `#${this.convertHex(r)}${this.convertHex(g)}${this.convertHex(
      b
    )}${this.convertHex(a)}`;
  }

  convertHex(value: number) {
    return parseInt("" + value)
      .toString(16)
      .padStart(2, "0");
  }

  update() {
    this.logger.debug("update panel");
    this.clearPanel();
    const menuWrap = this.createEl("div");
    menuWrap.classList.add("menu-wrap");

    this.currentMenu.forEach((menu) => {
      const title = this.createEl("div");
      title.classList.add("menu-title");
      title.innerText = menu.title;
      menuWrap.append(title);

      const menuList = this.createEl("div");
      menuList.classList.add("menu-list");

      menu.item.forEach((item) => {
        const menu = this.createEl("div");
        menu.classList.add("panel");
        const menuTitle = this.createEl("div");
        menuTitle.classList.add("panel-title");
        menuTitle.innerText = item.title;

        if (item.panel instanceof HTMLElement) {
          item.panel.classList.add("panel-tool");
        } else {
          const els = [
            ...new DOMParser().parseFromString(item.panel, "text/html").body
              .children,
          ];
          item.panel = this.createEl("div");
          item.panel.append(...els);
        }

        menu.append(menuTitle);
        menu.append(item.panel);

        menuList.append(menu);
      });
      menuWrap.append(menuList);
    });
    PANEL.append(menuWrap);
  }
}
