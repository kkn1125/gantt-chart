export const getNumberBySheetName = (sheetName: string) => {
  const number = Number(sheetName.replace("sheet", ""));
  return number;
};