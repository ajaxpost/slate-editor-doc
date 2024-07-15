import { contextType, EditorPlugin, Plugin } from '@slate-doc/core';
import { create } from '../opts/create';
import DocImage from '../component/doc-image';

const ImageRender = (context: contextType) => {
  const children = context.children;
  const image = context.props.element.image as Record<string, unknown>;
  const slate = context.editorState.slate;
  if (!slate || !slate.selection) return;
  return (
    <DocImage props={image} element={context.props.element} slate={slate}>
      {children}
    </DocImage>
  );
};

const Image = new EditorPlugin({
  type: 'image',
  elements: {
    render: ImageRender,
    props: {
      maxSize: {
        width: 650,
        height: 550,
      },
      size: {
        width: 300,
        height: 300,
      },
      fit: 'contain',
    },
  },
  options: {
    shortcuts: [],
    embedded: false,
    create: create('image'),
    match(context) {
      return !!context.props.element.image;
    },
  },
} as Plugin);

export { Image };
