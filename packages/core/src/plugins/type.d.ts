import type { Descendant, Editor } from 'slate';
import type { RenderSlateElementProps } from 'slate-react';
import type { EditorEventHandlers } from './eventHandlers';
import { EditorType } from '../preset/types';

export interface PluginElementProps {
  nodeType?: 'block' | 'inline' | 'void' | 'inlineVoid';
}
export type PluginElementRenderProps = RenderSlateElementProps & {
  HTMLAttributes?: HTMLAttributes<HTMLElement>;
};

export interface PluginOptions {
  shortcuts?: string[];
  align?: 'left' | 'center' | 'right';
  HTMLAttributes?: HTMLAttributes<HTMLElement>;
  [name: string]: unknown;
}
export interface PluginElement {
  render: (props: RenderSlateElementProps) => JSX.Element;
  props?: PluginElementProps;
}

export type PluginElementsMap<TKeys extends string = string> = {
  [key in TKeys]: PluginElement;
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

export { RenderSlateElementProps };
