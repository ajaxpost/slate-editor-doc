import { FC, useMemo, useState } from 'react';
import { Editable } from './preset/editable';
import { EditorContextType, EditorProvider } from './context/editor-context';
import { EditorType } from './preset/types';
import { generateId } from './utils/generateId';
import { EditorPlugin } from './plugins/createEditorPlugin';
import { buildPlugins, buildShortcuts } from './utils/editorBuilders';
import { ConfigProvider } from 'antd';
import { Descendant } from 'slate';

type IProps = {
  value?: Descendant[];
  plugins: EditorPlugin[];
  placeholder?: string;
  readonly?: boolean;
  width?: number;
  style?: React.CSSProperties;
  className?: string;
};

const SlateEditor: FC<IProps> = ({
  plugins: _plugins,
  placeholder,
  readonly = false,
  width,
  style,
  className,
  value,
}) => {
  const plugins = useMemo(() => {
    return _plugins.map((plugin) => plugin.getPlugin);
  }, [_plugins]);

  const [editorState] = useState<EditorContextType>(() => {
    const editor = {} as EditorType;
    if (!editor.id) editor.id = generateId();

    const map = buildPlugins(plugins);

    editor.readOnly = readonly;
    editor.plugins = map.pluginsMap;
    editor.marks = map.leafPluginMap;
    editor.shortcuts = buildShortcuts(editor, Object.values(map.pluginsMap));
    editor.placeholder = placeholder;
    return {
      editor,
    };
  });

  console.log(editorState);

  return (
    <ConfigProvider
      theme={{
        token: {
          motion: false,
          borderRadius: 0,
          borderRadiusLG: 0,
          borderRadiusOuter: 0,
          borderRadiusSM: 0,
          borderRadiusXS: 0,
          colorPrimary: '#00b96b',
        },
        components: {
          Tooltip: {
            colorBgSpotlight: '#404040',
          },
        },
      }}
    >
      <EditorProvider editorState={editorState}>
        <Editable
          width={width}
          value={value}
          style={style}
          className={className}
        />
      </EditorProvider>
    </ConfigProvider>
  );
};

export default SlateEditor;
