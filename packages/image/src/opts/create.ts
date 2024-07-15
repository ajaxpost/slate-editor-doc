import { EditorType, generateId, ShortcutElementType } from '@slate-doc/core';
import { css } from '@emotion/css';
import { Editor, Transforms } from 'slate';

const imageInputClass = css`
  position: fixed;
  top: -10000px;
  left: -10000px;
`;

const uploadImage = (
  type: string,
  element: ShortcutElementType,
  file: File,
  editor: EditorType
) => {
  const url = URL.createObjectURL(file);
  Transforms.setNodes(editor.slate!, {
    [type]: { src: url, ...element.props },
    children: [{ text: '' }],
    id: generateId(),
  });
  Transforms.insertNodes(editor.slate!, {
    children: [{ text: '' }],
    id: generateId(),
  });
};

export function create(type: string) {
  return function (editor: EditorType, element: ShortcutElementType) {
    const slate = editor.slate;
    if (!slate || !slate.selection) return;

    const id = 'slate-doc-image';
    let imageInput = document.getElementById(id);
    if (!imageInput) {
      imageInput = document.createElement('input');
      imageInput.setAttribute('type', 'file');
      imageInput.setAttribute('class', imageInputClass);
      imageInput.setAttribute('accept', 'image/*');
      document.body.appendChild(imageInput);
    }

    imageInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      file && uploadImage(type, element, file, editor);
    };

    imageInput.click();
  };
}
