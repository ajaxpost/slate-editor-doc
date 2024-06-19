import type { Editor } from 'slate';
import type { EditorEventHandlers } from './eventHandlers';
import { EditorType } from '../preset/types';
import { HTMLAttributes } from 'react';
import { RenderElementProps } from 'slate-react';

export interface PluginElementProps {
  nodeType?: 'block' | 'inline' | 'void' | 'inlineVoid';
  asRoot?: string;
}
export type PluginElementRenderProps = {
  HTMLAttributes?: HTMLAttributes<HTMLElement>;
};

export interface PluginOptions {
  shortcuts?: string[];
  align?: 'left' | 'center' | 'right';
  HTMLAttributes?: HTMLAttributes<HTMLElement>;
  [name: string]: unknown;
}
export interface PluginElement {
  render: (props: RenderElementProps) => JSX.Element;
  props?: PluginElementProps;
}

export type PluginElementsMap<TKeys extends string = string> = {
  [key in TKeys]: Partial<PluginElement>;
};

export type EventHandlers = {
  [key in keyof EditorEventHandlers]: (
    editor: EditorType,
    slate: Editor
  ) => EditorEventHandlers[key] | void;
};

export interface Plugin<TKeys extends string = string> {
  type: string;
  elements: PluginElementsMap<TKeys>;
  events?: EventHandlers;
  options?: PluginOptions;
}

export interface Shortcut<TKeys extends string = string> {
  type: string;
  elements: PluginElementsMap<TKeys>;
  options: PluginOptions;
  create: () => void;
  isActive: () => boolean;
}

export type { RenderElementProps };