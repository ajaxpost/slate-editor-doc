import { RenderLeafProps } from 'slate-react';
import { LeafPlugin, Plugin, RenderElementProps } from './type';
import SortableElement from '../components/Editor/SortableElement';
import { EditorType } from '../preset/types';
import TextLeaf from '../components/TextLeaf/TextLeaf';
import { NodeEntry, Range } from 'slate';

type RenderPlugin = {
  renderElement?: (props: RenderElementProps) => JSX.Element;
  renderLeaf?: (props: RenderLeafProps) => JSX.Element;
  decorate?: (entry: NodeEntry) => Range[];
};

const renderElement = (
  props: RenderElementProps,
  plugins: Plugin[],
  items: string[],
  editorState: EditorType
) => {
  const context = {
    children: props.children,
    props,
    style: {},
    editorState,
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
    classList: [],
    editorState,
  };

  for (const plugin of plugins) {
    if (plugin.options?.matchLeaf?.(context) && plugin.elements.renderLeaf) {
      context.children = plugin.elements.renderLeaf(context);
    }
  }

  const parentProps = props.children.props.parent;

  const showPlaceholder =
    props.text.text === '' && !parentProps['code-item'] && !parentProps['code'];
  return (
    <TextLeaf
      attributes={props.attributes}
      placeholder={showPlaceholder ? editorState.placeholder : undefined}
      classList={context.classList}
    >
      {context.children}
    </TextLeaf>
  );
};

const decorate = (
  entry: NodeEntry,
  elementPlugins: Plugin[],
  leafPlugins: LeafPlugin[],
  editorState: EditorType
) => {
  const range: Range[] = [];

  for (const ele of elementPlugins) {
    let result: Range[] = [];
    if (
      ele.options?.decorate &&
      (result = ele.options.decorate(entry, editorState))
    ) {
      range.push(...result);
    }
  }

  for (const leaf of leafPlugins) {
    let result: Range[] = [];
    if (
      leaf.options?.decorate &&
      (result = leaf.options.decorate(entry, editorState))
    ) {
      range.push(...result);
    }
  }

  return range;
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
      if (value.options?.matchLeaf && value.elements?.renderLeaf) {
        // @ts-ignore
        leafPlugins.push(value);
      }
    }

    for (const [, value] of Object.entries(marks)) {
      leafPlugins.push(value);
    }

    return {
      renderElement: (props) => {
        return renderElement(props, elementPlugins, items, editorState);
      },
      renderLeaf: (props) => {
        return renderLeaf(props, leafPlugins, editorState);
      },
      decorate: (entry) => {
        return decorate(entry, elementPlugins, leafPlugins, editorState);
      },
    } as RenderPlugin;
  }
}
