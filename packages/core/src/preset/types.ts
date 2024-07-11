import type { Descendant, Editor, BaseEditor } from 'slate';
import { LeafPlugin, Plugin, Shortcut } from '../plugins/type';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';

export interface EditorType {
  id: string;
  readOnly: boolean;
  plugins: Record<string, Plugin>;
  marks: Record<string, LeafPlugin>;
  slate: Editor | null;
  placeholder?: string;
  shortcuts: Record<string, Shortcut>;
}

export type SlateElement = {
  id?: string;
  children: Descendant[] | SlateElement[];
  [name: string]: unknown;
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
type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  color?: string;
};

interface CustomElement {
  id?: string;
  children: Descendant[] | SlateElement[];
  [name: string]: unknown;
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
