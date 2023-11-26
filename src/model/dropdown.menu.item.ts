export default class DropdownMenuItem {
  originGroup: string;
  originName: string;

  group: string;
  name: string;
  feature: Function = () => {};

  constructor(group: string, name: string, feature?: Function) {
    this.group = group;
    this.name = name;

    feature && (this.feature = feature.bind(feature, this));

    this.originGroup = group;
    this.originName = name;
  }

  setName(name: string) {
    this.name = name;
  }

  initName() {
    this.name = this.originName;
  }

  initGroup() {
    this.group = this.originGroup;
  }
}
