import { ChangeEvent, FC, ReactNode, useState } from 'react';
import { css } from '@emotion/css';
import { Editor, Element, Transforms } from 'slate';
import { EditorType } from '@slate-doc/core';
import { ReactEditor } from 'slate-react';

interface IProps {
  children: ReactNode;
  language: string;
  editorState: EditorType;
  element: Element;
}

interface LanguageSelectProps {
  language: string;
  slate: Editor;
  element: Element;
}

const LanguageSelect: FC<LanguageSelectProps> = ({
  language,
  slate,
  element,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedLanguage(value);
    const path = ReactEditor.findPath(slate, element);
    Transforms.setNodes(
      slate,
      {
        code: {
          language: value,
        },
      },
      {
        at: path,
        match: (n) =>
          Element.isElement(n) && Editor.isBlock(slate, n) && !!n['code'],
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

const CodeBlock: FC<IProps> = ({
  children,
  language,
  editorState,
  element,
}) => {
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
      <LanguageSelect language={language} element={element} slate={slate} />
      {children}
    </div>
  );
};

export default CodeBlock;
