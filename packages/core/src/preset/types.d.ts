import type { Descendant, Editor, BaseEditor } from 'slate';
import { Plugin } from '../plugins/type';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';

export interface EditorType {
  id: string;
  readOnly: boolean;
  plugins: Record<string, Plugin<string>>;
  slate: Editor | null;
  placeholder?: string;
  shortcuts: Record<string, unknown>; // TODO
}

export type EditorContentValue = EditorType['children'];

export type SlateElement<K extends string = string, T = any> = {
  id?: string;
  type: K;
  children: Descendant[] | SlateElement[];
  props?: T;
};

/**
 *  type ExtendableTypes = 'Editor' | 'Element' | 'Text' | 'Selection' | 'Range' | 'Point' | 'Operation' | 'InsertNodeOperation' | 'InsertTextOperation' | 'MergeNodeOperation' | 'MoveNodeOperation' | 'RemoveNodeOperation' | 'RemoveTextOperation' | 'SetNodeOperation' | 'SetSelectionOperation' | 'SplitNodeOperation';
    export interface CustomTypes {
        [key: string]: unknown;
    }
    export type ExtendedType<K extends ExtendableTypes, B> = unknown extends CustomTypes[K] ? B : CustomTypes[K];
    export type Element = ExtendedType<'Element', BaseElement>;
    经过上面的代码,就明白为什么可以重写 CustomTypes 就可以修改默认的类型了
*/
type CustomText = { text: string };

interface CustomElement {
  type: 'paragraph' | 'placeholder';
  id?: string;
  children: Descendant[] | SlateElement[];
  props?: Record<string, unknown>;
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
