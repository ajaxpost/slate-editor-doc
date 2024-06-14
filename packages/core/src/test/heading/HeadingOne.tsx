import { EditorPlugin } from '../../plugins/createEditorPlugin';
import { PluginElementRenderProps } from '../../plugins/type';

const HeadingOneRender = ({
  attributes,
  children,
  element,
  HTMLAttributes = {},
}: PluginElementRenderProps) => {
  const { className = '', ...htmlAttrs } = HTMLAttributes;
  return (
    <h1
      id={element.id}
      draggable={false}
      data-element-type={element.type}
      className={`editor-heading-one ${className}`}
      {...htmlAttrs}
      {...attributes}
    >
      {children}
    </h1>
  );
};

const HeadingOne = new EditorPlugin({
  type: 'HeadingOne',
  elements: {
    'heading-one': {
      render: HeadingOneRender,
      props: {},
    },
  },
  options: {
    shortcuts: ['h1', '#', '*'],
  },
});

export { HeadingOne };
