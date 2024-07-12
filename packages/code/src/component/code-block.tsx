import { ChangeEvent, FC, ReactNode, useState } from 'react';
import { css } from '@emotion/css';
import { Editor, Element, Transforms } from 'slate';
import { EditorType } from '@slate-doc/core';

interface IProps {
  children: ReactNode;
  language: string;
  editorState: EditorType;
}

interface LanguageSelectProps {
  language: string;
  slate: Editor;
}

const LanguageSelect: FC<LanguageSelectProps> = ({ language, slate }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedLanguage(value);
    const match = Editor.above(slate, {
      at: slate.selection!,
      match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
    });
    if (!match) return;
    const [node, path] = match;
    const parentMatch = Editor.parent(slate, path);
    if (!parentMatch) return;
    const [parentNode, parentPath] = parentMatch;
    if (!parentNode['code'] && !node['code-item']) return;

    Transforms.setNodes(
      slate,
      {
        code: {
          language: value,
        },
      },
      {
        at: parentPath,
      }
    );
  };

  return (
    <select
      contentEditable={false}
      className={css`
        position: absolute;
        top: 10px;
        right: 0px;
        z-index: 1000;
      `}
      value={selectedLanguage}
      onChange={onChange}
    >
      <option value="css">CSS</option>
      <option value="html">HTML</option>
      <option value="java">Java</option>
      <option value="javascript">JavaScript</option>
      <option value="jsx">JSX</option>
      <option value="markdown">Markdown</option>
      <option value="php">PHP</option>
      <option value="python">Python</option>
      <option value="sql">SQL</option>
      <option value="tsx">TSX</option>
      <option value="typescript">TypeScript</option>
    </select>
  );
};

const CodeBlock: FC<IProps> = ({ children, language, editorState }) => {
  const slate = editorState.slate;
  if (!slate || !slate.selection) return;
  return (
    <div
      spellCheck={false}
      className={css`
        font-family: monospace;
        font-size: 16px;
        line-height: 20px;
        margin-top: 0px;
        background: rgba(0, 20, 60, 0.03);
        padding: 5px 13px;
      `}
    >
      <LanguageSelect language={language} slate={slate} />
      {children}
    </div>
  );
};

export default CodeBlock;
