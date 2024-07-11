import { FC, useMemo, useState } from 'react';
import { Editable } from './preset/editable';
import { EditorContextType, EditorProvider } from './context/editor-context';
import { EditorType } from './preset/types';
import { generateId } from './utils/generateId';
import { EditorPlugin } from './plugins/createEditorPlugin';
import { buildPlugins, buildShortcuts } from './utils/editorBuilders';
import { css } from '@emotion/css';
import { ConfigProvider } from 'antd';

type IProps = {
  // value?: EditorContentValue;
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
        },
        components: {
          Tooltip: {
            colorBgSpotlight: '#404040',
          },
        },
      }}
    >
      <EditorProvider editorState={editorState}>
        <Editable width={width} style={style} className={className} />
      </EditorProvider>
    </ConfigProvider>
  );
};

export default SlateEditor;
