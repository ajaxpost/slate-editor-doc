import { EditorPlugin, Plugin, contextType } from '@slate-doc/core';
import { create } from '../opts/create';
import CodeBlock from '../component/code-block';
import { Editor, Element, Range } from 'slate';
import Prism from 'prismjs';
import { onKeyDown } from '../event/onKeyDown';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-java';
import 'prismjs/themes/prism.min.css';

function codeTokenize(code: string, language: string) {
  const range: any[] = [];
  const tokens = Prism.tokenize(code, Prism.languages[language.toLowerCase()]);
  let start = 0;

  for (const token of tokens) {
    const length = token?.length;
    const end = start + length;

    if (typeof token !== 'string') {
      range.push({
        type: token.type,
        start,
        end,
      });
    }

    start = end;
  }
  return range;
}

const CodeRender = (context: contextType) => {
  const code = context.props.element['code'] as Record<string, string>;
  const editorState = context.editorState;
  const element = context.props.element;

  return (
    <CodeBlock
      language={code.language}
      element={element}
      editorState={editorState}
    >
      {context.children}
    </CodeBlock>
  );
};

const Code = new EditorPlugin({
  type: 'code',
  elements: {
    render: CodeRender,
    renderLeaf(context) {
      context.classList.push('token', context.props.leaf['code-item']);
      return context.children;
    },
    props: {
      nodeType: 'block',
    },
  },
  events: {
    onKeyDown,
  },
  options: {
    shortcuts: ['```'],
    embedded: false,
    create: create('code'),
    match(context) {
      return !!context.props.element?.code;
    },
    matchLeaf(context) {
      return !!context.props.leaf['code-item'];
    },
    decorate: (entry, editorState) => {
      const slate = editorState.slate;
      if (!slate || !slate.selection) return [];
      const range: Range[] = [];
      const [node, path] = entry;

      if (Element.isElement(node) && Editor.isBlock(slate, node) && node.code) {
        const code = node.code as Record<string, string>;
        const str = Editor.string(slate, path);
        const language = code?.language || 'javascript';
        const codeToken = codeTokenize(str, language);
        for (const ct of codeToken) {
          range.push({
            anchor: {
              path,
              offset: ct.start,
            },
            focus: {
              path,
              offset: ct.end,
            },
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            'code-item': ct.type,
          });
        }
      }

      return range;
    },
  },
} as Plugin);

export { Code };
