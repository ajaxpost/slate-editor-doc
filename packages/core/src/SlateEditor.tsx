import { FC, useMemo, useState } from 'react';
import { Editable } from './preset/editable';
import { EditorContextType, EditorProvider } from './context/editor-context';
import { EditorContentValue, EditorType } from './preset/types';
import { generateId } from './utils/generateId';
import { EditorPlugin } from './plugins/createEditorPlugin';
import { buildPlugins, buildShortcuts } from './utils/editorBuilders';
import { Plugin } from './plugins/type';

type IProps = {
  value?: EditorContentValue;
  plugins: EditorPlugin<string>[];
  placeholder?: string;
};

function validateInitialValue(value: unknown): boolean {
  if (!value) return false;
  if (typeof value !== 'object') return false;
  if (Object.keys(value).length === 0) return false;

  return true;
}

const SlateEditor: FC<IProps> = ({ value, plugins: _plugins, placeholder }) => {
  const plugins = useMemo(() => {
    return _plugins.map((plugin) => plugin.getPlugin as Plugin<string>);
  }, [_plugins]);

  const [editorState] = useState<EditorContextType>(() => {
    const editor = {} as EditorType;
    if (!editor.id) editor.id = generateId();
    if (!validateInitialValue(value)) {
    }
    editor.plugins = buildPlugins(plugins);
    editor.shortcuts = buildShortcuts(plugins);
    editor.placeholder = placeholder;
    return {
      editor,
    };
  });

  console.log(editorState);

  return (
    <EditorProvider editorState={editorState}>
      <Editable width={500} />
    </EditorProvider>
  );
};

export default SlateEditor;
