import { Editor, Element, Node, Text } from 'slate';
import { LeafPlugin, Plugin, PluginElement, Shortcut } from '../plugins/type';
import { EditorType, SlateElement } from '../preset/types';

export function buildPlugins(plugins: (Plugin | LeafPlugin)[]) {
  const pluginsMap: Record<string, Plugin> = {};
  const leafPluginMap: Record<string, LeafPlugin> = {};

  plugins.forEach((plugin) => {
    const props = plugin.elements.props;
    if (props?.nodeType === 'inline') {
      leafPluginMap[plugin.type] = plugin as LeafPlugin;
    } else {
      pluginsMap[plugin.type] = plugin as Plugin;
    }
  });

  return {
    pluginsMap,
    leafPluginMap,
  };
}

export function buildShortcuts(editor: EditorType, plugins: Plugin[]) {
  const map: Record<string, Shortcut> = {};

  plugins.forEach((plugin) => {
    const elements: Partial<PluginElement> = {};
    for (const key in plugin.elements) {
      if (key !== 'render') {
        elements[key] = plugin.elements[key];
      }
    }
    const {
      shortcuts = [],
      create = () => {},
      embedded = false,
      decorate = () => [],
      unEmbedList = [],
    } = plugin.options || {};
    if (shortcuts.length) {
      shortcuts.forEach((shortcut) => {
        map[shortcut] = {
          type: plugin.type,
          elements,
          options: {
            shortcuts,
            embedded,
            decorate,
            unEmbedList,
          },
          create: (context) => {
            create(editor, elements, context);
          },
          isActive: () => {
            // 判断一下当前所在行这个type是否与要生成的type相同
            // 如果相同返回true
            const slate = editor.slate;

            if (!slate) return false;
            const match = Editor.above<SlateElement>(slate, {
              at: slate.selection!,
              match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
              mode: 'highest',
            });
            if (!match) return false;
            const [node] = match;

            return !!node[plugin.type];
          },
        };
      });
    }
  });
  return map;
}

// 统计文档字数
export const countWords = (editorState: EditorType) => {
  let wordCount = 0;
  const editor = editorState.slate;
  if (!editor || !editor.selection) return 0;

  const countWordsInNode = (node) => {
    if (Text.isText(node)) {
      wordCount += node.text
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
    }
    if (node.children) {
      node.children.forEach((child) => countWordsInNode(child));
    }
  };

  editor.children.forEach((node) => countWordsInNode(node));
  return wordCount;
};
