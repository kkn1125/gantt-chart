export type FlatArray<Arr, Depth extends number> = {
  done: Arr;
  recur: Arr extends ReadonlyArray<infer InnerArr>
    ? FlatArray<InnerArr, [-1, 20][Depth]>
    : Arr;
}[Depth extends -1 ? "done" : "recur"];
