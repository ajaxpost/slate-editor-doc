import { SlateElement } from '@slate-doc/core';

export type HeadingOneElement = SlateElement<'heading-one'>;

declare module '@slate-doc/core' {
  interface CustomElement extends HeadingOneElement {
    type: 'heading-one';
  }
}
