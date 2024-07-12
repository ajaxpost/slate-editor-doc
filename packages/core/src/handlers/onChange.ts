import React from 'react';
import { EditorType, SlateElement } from '../preset/types';
import { Editor } from 'slate';
import { extra } from '../extensions/config';

export const onChange = (editorState: EditorType, setToolbarState) => {
  return (value: string) => {
    const slate = editorState.slate!;
    const { selection } = slate;
    if (!selection) return;
    const match = Editor.above<SlateElement>(slate, {
      at: selection,
    });
    if (!match) return;
    const [node] = match;

    setToolbarState((o) => ({
      ...o,
      fontSize: {
        size: node.fontSize || '',
        disabled: false,
      },
    }));

    const heading = node.heading as Record<string, unknown>;
    if (heading) {
      const leval = (heading.leval || 1) as number;
      setToolbarState((o) => ({
        ...o,
        textAndTitle: Array.from({
          length: leval,
        })
          .map(() => '#')
          .join(''),
        fontSize: {
          size: '',
          disabled: true,
        },
      }));
    } else {
      const keys = Object.keys(node).filter((o) => extra.indexOf(o) === -1);
      if (!keys.length) {
        setToolbarState((o) => ({
          ...o,
          textAndTitle: 'text',
        }));
      }
    }
  };
};
