export type ExtractValue<T> = T extends infer R ? R : never;

type ExtractSharp<T> = T extends `${infer Sharp}${infer R}`
  ? Sharp extends "#"
    ? R extends string
      ? HTMLElement
      : never
    : never
  : never;

export function select<T extends `#${string}`>(target: T): ExtractSharp<T> {
  const element = document.querySelector(target);
  if (element && element.id === target.slice(1))
    return document.querySelector(target) as ExtractSharp<T>;
  return null as ExtractSharp<T>;
}
