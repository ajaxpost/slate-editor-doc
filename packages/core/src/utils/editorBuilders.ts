import { Editor, Node } from "slate";
import {
  Plugin,
  PluginElement,
  PluginElementsMap,
  Shortcut,
} from "../plugins/type";
import { EditorType, SlateElement } from "../preset/types";
import { createBlock } from "../transforms/createBlocks";
import { generateId } from "./generateId";

export function buildPlugins(plugins: Plugin<string>[]) {
  const pluginsMap: Record<string, Plugin<string>> = {};

  plugins.forEach((plugin) => {
    // if (plugin.elements) {
    //   Object.keys(plugin.elements).forEach((type) => {
    //     const element = plugin.elements[type];
    //     const nodeType = element.props?.nodeType;

    //     if (nodeType === 'inline' || nodeType === 'inlineVoid') {
    //       inlineTopLevelPlugins[type] = element;
    //     }
    //   });
    // }

    pluginsMap[plugin.type] = plugin;
  });
  plugins.forEach((plugin) => {
    if (plugin.elements) {
      const elements = { ...plugin.elements };
      pluginsMap[plugin.type] = { ...plugin, elements };
    }
  });

  return pluginsMap;
}

export function buildShortcuts(editor: EditorType, plugins: Plugin<string>[]) {
  const map: Record<string, Shortcut<string>> = {};

  plugins.forEach((plugin) => {
    const elements: Partial<PluginElement> = {};
    for (const key in plugin.elements) {
      if (key !== "render") {
        elements[key] = plugin.elements[key];
      }
    }
    const {
      shortcuts = [],
      create = () => {},
      match = () => true,
    } = plugin.options || {};
    if (shortcuts.length) {
      shortcuts.forEach((shortcut) => {
        map[shortcut] = {
          type: plugin.type,
          elements,
          options: {
            shortcuts,
          },
          create: () => {
            create(editor, elements);
          },
          isActive: () => {
            // 判断一下当前所在行这个type是否与要生成的type相同
            // 如果相同返回true
            const slate = editor.slate;
            if (!slate) return false;
            // @ts-ignore
            const [node] = Editor.above(slate, {
              at: slate.selection!,
            });
            return Object.keys(elements).includes(node?.type);
          },
        };
      });
    }
  });
  return map;
}

export const buildBlockElement = (element?: Partial<SlateElement>) => ({
  id: generateId(),
  type: element?.type || "paragraph",
  children: element?.children || [{ text: "" }],
  props: {
    nodeType: "block",
    ...element?.props,
  },
});
