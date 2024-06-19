import { PluginElementsMap } from '../plugins/type';

export function getRootBlockElementType(
  elems: PluginElementsMap<string> | undefined
): string | undefined {
  if (!elems) return;

  const elements = Object.keys(elems);
  const rootElementType =
    elements.length === 1
      ? elements[0]
      : elements.find((key) => elems[key]?.props?.asRoot);

  return rootElementType;
}
