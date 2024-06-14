import { EditorType } from '../preset/types';

export function createBlock(
  editor: EditorType,
  type: string,
  options: Record<string, unknown>
) {
  editor.children = JSON.parse(JSON.stringify(editor.children));
  // TODO: create block
}
