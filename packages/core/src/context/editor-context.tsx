import { ReactNode, createContext, useContext } from 'react';
import { EditorType } from '../preset/types';

export type EditorContextType = {
  editor: EditorType;
};

type Props = {
  children: ReactNode;
  editorState: EditorContextType;
};

const DEFAULT_HANDLERS: EditorContextType = {
  editor: {
    id: '',
    readOnly: false,
    plugins: {},
    slate: null,
    shortcuts: {},
    marks: {},
  },
};

export const EditorContext = createContext<EditorContextType>(DEFAULT_HANDLERS);

const EditorProvider = ({ children, editorState }: Props) => {
  return (
    <EditorContext.Provider value={editorState}>
      {children}
    </EditorContext.Provider>
  );
};

const useEditorState = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditorState 必须在 EditorProvider 内部使用');
  }
  return context.editor;
};

const useReadOnly = () => {
  const editor = useEditorState();
  return editor.readOnly;
};

export { EditorProvider, useEditorState, useReadOnly };
