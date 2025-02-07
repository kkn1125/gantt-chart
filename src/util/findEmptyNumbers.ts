import { getNumberBySheetName } from "./getNumberBySheetName";

export const findEmptyNumbers = (sheetNames: string[]) => {
  let index = 0;
  let compareBase = 0;
  const emptyNumbers: number[] = [];
  while (true) {
    if (sheetNames.length - 1 === index) break;
    const compareSheetName = sheetNames[compareBase];
    const compareBaseNumber = getNumberBySheetName(compareSheetName);
    if (compareBaseNumber !== index + 1) {
      emptyNumbers.push(index + 1);
    } else {
      compareBase++;
    }
    index++;
  }
  return emptyNumbers;
};
