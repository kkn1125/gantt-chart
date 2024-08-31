const a = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
] as const;

type StringArray<T> = T extends ReadonlyArray<infer R> ? R[] : string[];
type StringArrayType = typeof a;
// type Strings = StringArray<StringArrayType>;

type NumToString<T extends IntRange<0, StringArrayType["length"]>> =
  StringArrayType[T] extends infer R ? R : never;

const numberToString: NumToString<1> = "B";
