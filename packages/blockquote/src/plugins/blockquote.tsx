import {
  EditorPlugin,
  EditorType,
  PluginElement,
  RenderElementProps,
  buildBlockElement,
} from "@slate-doc/core";
import { css } from "@emotion/css";
import { onKeyDown } from "../events/onKeyDown";
import { Editor, Transforms, Element } from "slate";

const BlockQuoteRender = (props: RenderElementProps) => {
  return (
    <blockquote
      {...props.attributes}
      data-element-type={props.element.type}
      data-node-type={props.element.props?.nodeType}
      className={css`
        margin-top: 0.25rem;
        margin-bottom: 0.25rem;
        border-width: 0px;
        border-left-width: 2px;
        border-style: solid;
        border-color: #e5e7eb;
        padding-left: 1.5rem;
        font-style: italic;
        margin: 0;
      `}
    >
      {props.children}
    </blockquote>
  );
};

const BlockQuote = new EditorPlugin({
  type: "blockquote",
  elements: {
    render: BlockQuoteRender,
    props: {
      nodeType: "block",
    },
  },
  events: {
    // onKeyDown,
  },
  options: {
    shortcuts: [">", "blockquote"],
    create: (editor: EditorType, element: Partial<PluginElement>) => {
      const slate = editor.slate;
      if (!slate || !slate.selection) return;
      const elementNode = buildBlockElement({
        type: "blockquote",
        props: element.props,
      });
      Transforms.setNodes(slate, elementNode, {
        match: (n) => {
          return !Editor.isEditor(n) && Element.isElement(n);
        },
        mode: "highest",
      });
    },
    match(editor) {
      return true;
    },
  },
});

export { BlockQuote };
