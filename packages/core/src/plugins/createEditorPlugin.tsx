import { RenderLeafProps } from 'slate-react';
import { LeafPlugin, Plugin, RenderElementProps } from './type';
import SortableElement from '../components/Editor/SortableElement';
import { EditorType } from '../preset/types';
import TextLeaf from '../components/TextLeaf/TextLeaf';

type RenderPlugin = {
  renderElement?: (props: RenderElementProps) => JSX.Element;
  renderLeaf?: (props: RenderLeafProps) => JSX.Element;
};

const renderElement = (
  props: RenderElementProps,
  plugins: Plugin[],
  items: string[]
) => {
  const context = {
    children: props.children,
    props,
    style: {},
  };

  for (const plugin of plugins) {
    if (plugin.options?.match?.(context) && plugin.elements.render) {
      context.children = plugin.elements.render(context);
    }
  }

  return (
    <SortableElement
      {...props}
      items={items}
      renderElement={() => context.children}
      style={context.style}
    />
  );
};

const renderLeaf = (
  props: RenderLeafProps,
  plugins: LeafPlugin[],
  editorState: EditorType
) => {
  const context = {
    children: props.children,
    props,
  };

  for (const plugin of plugins) {
    if (plugin.options?.match?.(context) && plugin.elements.render) {
      context.children = plugin.elements.render(context);
    }
  }

  const showPlaceholder = props.text.text === '';
  return (
    <TextLeaf
      attributes={props.attributes}
      placeholder={showPlaceholder ? editorState.placeholder : undefined}
    >
      {context.children}
    </TextLeaf>
  );
};

export class EditorPlugin {
  private readonly plugin: Plugin | LeafPlugin;

  constructor(plugin: Plugin | LeafPlugin) {
    this.plugin = plugin;
  }

  get getPlugin() {
    return this.plugin;
  }
  static start(editorState: EditorType, items: string[]) {
    const plugins = editorState.plugins;
    const marks = editorState.marks;
    const elementPlugins: Plugin[] = [];
    const leafPlugins: LeafPlugin[] = [];

    for (const [, value] of Object.entries(plugins)) {
      elementPlugins.push(value);
    }

    for (const [, value] of Object.entries(marks)) {
      leafPlugins.push(value);
    }

    return {
      renderElement: (props) => {
        return renderElement(props, elementPlugins, items);
      },
      renderLeaf: (props) => {
        return renderLeaf(props, leafPlugins, editorState);
      },
    } as RenderPlugin;
  }
}
