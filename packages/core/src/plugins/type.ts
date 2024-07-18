import type { EditorEventHandlers } from './eventHandlers';
import { EditorType } from '../preset/types';
import { HTMLAttributes } from 'react';
import { RenderElementProps, RenderLeafProps } from 'slate-react';
import { HOTKEYS } from '../utils/hotkeys';
import { NodeEntry, Range } from 'slate';

export interface PluginElementProps {
  nodeType?: 'block' | 'inline' | 'void' | 'inlineVoid';
  asRoot?: string;
  [name: string]: unknown;
}
export type PluginElementRenderProps = {
  HTMLAttributes?: HTMLAttributes<HTMLElement>;
};

export type contextType = {
  children: RenderElementProps['children'];
  props: RenderElementProps;
  style: React.CSSProperties;
  editorState: EditorType;
  plain: boolean;
};

export type leafContextType = {
  children: RenderLeafProps['children'];
  props: RenderLeafProps;
  classList: string[];
  editorState: EditorType;
};

export interface PluginOptions {
  shortcuts?: string[];
  create?: (
    editor: EditorType,
    elements: ShortcutElementType,
    context: ShortcutCreateType
  ) => void;
  destroy?: (editor: EditorType) => void;
  match?: (context: contextType) => boolean;
  matchLeaf?: (context: leafContextType) => boolean;
  embedded?: boolean; // 是否可内嵌其他node节点中
  unEmbedList?: string[]; // 当前节点不可内嵌到那些节点中,前提是 embedded = true
  hotkey?: string[];
  decorate?: (entry: NodeEntry, editorState: EditorType) => Range[];
  [name: string]: unknown;
}

export interface LeafPluginOptions {
  create?: (editor: EditorType, props?: Record<string, unknown>) => void;
  destroy?: (editor: EditorType) => void;
  matchLeaf?: (context: leafContextType) => boolean;
  hotkey?: string[];
  decorate?: (entry: NodeEntry, editorState: EditorType) => Range[];
  [name: string]: unknown;
}

export interface PluginElement {
  render: (context: contextType) => JSX.Element;
  renderLeaf?: (context: leafContextType) => JSX.Element;
  props?: PluginElementProps;
}

export interface LeafPluginElement {
  renderLeaf: (context: leafContextType) => JSX.Element;
  props?: PluginElementProps;
}

export type PluginElementsMap<TKeys extends string = string> = {
  [key in TKeys]: Partial<PluginElement>;
};

export type HOTKEYS_TYPE = typeof HOTKEYS;

export type EventHandlers = {
  [key in keyof EditorEventHandlers]: (
    editor: EditorType,
    HOTKEYS: HOTKEYS_TYPE
  ) => EditorEventHandlers[key] | void;
};

export interface Plugin {
  type: string;
  elements: Partial<PluginElement>;
  events?: EventHandlers;
  options?: PluginOptions;
}

export interface LeafPlugin {
  type: string;
  elements: Partial<LeafPluginElement>;
  events?: EventHandlers;
  options?: LeafPluginOptions;
}

export type ShortcutCreateType = {
  beforeText: string;
};

export type ShortcutElementType = Partial<Omit<PluginElement, 'render'>>;

export interface Shortcut {
  type: string;
  elements: Partial<PluginElement>;
  options: PluginOptions;
  create: (content: ShortcutCreateType) => void;
  isActive: () => boolean;
}

export type { RenderElementProps };
