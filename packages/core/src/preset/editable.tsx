import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Descendant, Transforms, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Editable as _Editable, Slate, withReact } from 'slate-react';
import { useEditorState } from '../context/editor-context';
import { css } from '@emotion/css';
import { generateId } from '../utils/generateId';
import { withShortcuts } from '../extensions/withShortcuts';
import { EVENT_HANDLERS } from '../handlers';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  UniqueIdentifier,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { withNodeId } from '../extensions/withNodeId';
import './editable.css';
import { HOTKEYS } from '../utils/hotkeys';
import _ from 'lodash';
import { EditorPlugin } from '../plugins/createEditorPlugin';
import Toolbar from '../components/Toolbar/toolbar';
import {
  ToolbarProvider,
  ToolbarContextType,
} from '../context/toolbar-context';
import ActionMenu from '../components/ActionMenu/action-meu';
import { SlashProvider } from '../context/slash-context';
import { ConfigProvider } from 'antd';
import { menuConfig } from '../components/ActionMenu/config';

const initialValue: Descendant[] = [
  {
    children: [
      {
        text: '文档编辑器',
      },
    ],
    id: '0234c4de-33b3-4c6b-ae9d-36f3b670a47f',
    align: 'center',
    heading: {
      nodeType: 'block',
      leval: 1,
    },
  },
  {
    children: [
      {
        text: '行内元素',
      },
    ],
    id: '07d696f2-e9ed-44cb-9b1b-5ac9ca388c65',
    align: 'left',
    heading: {
      nodeType: 'block',
      leval: 2,
    },
  },
  {
    children: [
      {
        text: '支持',
      },
      {
        text: '加粗',
        bold: true,
      },
      {
        text: '、',
      },
      {
        text: '斜体',
        italic: true,
      },
      {
        text: '、',
      },
      {
        text: '下划线',
        underline: true,
      },
      {
        text: '、',
      },
      {
        text: '删除线',
        strikethrough: true,
      },
      {
        text: '、',
      },
      {
        text: '行内代码块',
        'line-code': true,
      },
      {
        text: '、文字对齐、字号、',
      },
      {
        text: '颜色',
        color: '#DF2A3F',
      },
      {
        text: '、',
      },
      {
        text: '背景',
        color: '#000000',
        'bg-color': '#1dc0c9',
      },
      {
        text: '。',
      },
    ],
    id: '4a46afa6-4548-45d1-addf-c8fc803ba675',
    align: 'left',
  },
  {
    id: '7b755877-8781-4744-bb9f-c573a57fa69c',
    align: 'left',
    children: [
      {
        text: '块级元素',
      },
    ],
    heading: {
      nodeType: 'block',
      leval: 2,
    },
  },
  {
    id: '4a286886-ba6c-492e-85cd-d4195bc6840f',
    align: 'left',
    children: [
      {
        text: '标题',
      },
    ],
    heading: {
      nodeType: 'block',
      leval: 3,
    },
  },
  {
    id: 'e1dbef30-aba1-4822-90de-9516dba5210e',
    align: 'left',
    children: [
      {
        text: '支持',
      },
      {
        text: 'h1~h6',
        'line-code': true,
      },
      {
        text: '的六级标题，快捷键唤起 一级标题',
      },
      {
        text: '#',
        'line-code': true,
      },
      {
        text: ' 、二级标题',
      },
      {
        text: '##',
        'line-code': true,
      },
      {
        text: ' 、三级标题',
      },
      {
        text: '###',
        'line-code': true,
      },
      {
        text: ' 。',
      },
    ],
  },
  {
    id: '626b1fe4-012e-4e28-9dfe-09fb4a1e2f19',
    align: 'left',
    children: [
      {
        text: '引用块',
      },
    ],
    heading: {
      nodeType: 'block',
      leval: 3,
    },
  },
  {
    blockquote: true,
    id: '1f9c4fdb-2faf-4978-8378-50736b204146',
    children: [
      {
        align: 'left',
        children: [
          {
            text: '支持引用块',
          },
        ],
        'blockquote-item': true,
      },
      {
        align: 'left',
        children: [
          {
            align: 'left',
            children: [
              {
                text: '可以嵌套其他格式',
                color: '#74b602',
              },
            ],
            'blockquote-item': true,
            'bulleted-item': {
              nodeType: 'block',
              leval: 0,
            },
          },
          {
            align: 'left',
            children: [
              {
                text: '支持快捷键 ',
                color: '#74b602',
              },
              {
                text: '>',
                color: '#74b602',
                'line-code': true,
              },
            ],
            'blockquote-item': true,
            'bulleted-item': {
              nodeType: 'block',
              leval: 0,
            },
          },
        ],
        'blockquote-item': true,
        'bulleted-list': true,
      },
    ],
  },
  {
    align: 'left',
    children: [
      {
        text: '无序列表',
        color: '#000000',
      },
    ],
    id: '755f1f99-e45b-40ae-99ce-6fbe7cd420ca',
    heading: {
      nodeType: 'block',
      leval: 3,
    },
  },
  {
    align: 'left',
    children: [
      {
        text: '支持无序列表，快捷键唤起无序列表 ',
        color: '#000000',
      },
      {
        color: '#000000',
        text: '-',
        'line-code': true,
      },
      {
        color: '#000000',
        text: ' ，下一级无序列表',
      },
      {
        color: '#000000',
        text: 'tab',
        'line-code': true,
      },
      {
        color: '#000000',
        text: '。',
      },
    ],
    id: 'a87f2a74-479d-4baf-b0c1-dd07ac97a34a',
  },
  {
    'bulleted-list': true,
    id: '39089a10-5a10-4120-be51-f7e4bda53a0c',
    children: [
      {
        align: 'left',
        children: [
          {
            color: '#000000',
            text: '一级无序列表',
          },
        ],
        'bulleted-item': {
          nodeType: 'block',
          leval: 0,
        },
      },
      {
        align: 'left',
        children: [
          {
            color: '#000000',
            text: '二级无序列表',
          },
        ],
        'bulleted-item': {
          nodeType: 'block',
          leval: 1,
        },
      },
      {
        align: 'left',
        children: [
          {
            color: '#000000',
            text: '三级无序列表',
          },
        ],
        'bulleted-item': {
          nodeType: 'block',
          leval: 2,
        },
      },
    ],
  },
  {
    align: 'left',
    children: [
      {
        color: '#000000',
        text: '有序列表',
      },
    ],
    id: 'd6cd8462-25f5-40b5-ab39-15bbea3d5b67',
    heading: {
      nodeType: 'block',
      leval: 3,
    },
  },
  {
    align: 'left',
    children: [
      {
        color: '#000000',
        text: '支持有序列表，',
      },
      {
        color: '#000000',
        text: '有序列表各级单独计数',
        strikethrough: true,
      },
      {
        color: '#000000',
        text: '，快捷键唤起有序列表',
      },
      {
        color: '#000000',
        text: '1.',
        'line-code': true,
      },
      {
        color: '#000000',
        text: ' ，下一级有序列表',
      },
      {
        color: '#000000',
        text: 'tab',
        'line-code': true,
      },
      {
        color: '#000000',
        text: '。',
      },
    ],
    id: 'dfa7bf04-46cd-4853-9dae-f59af83a4935',
  },
  {
    'numbered-list': true,
    id: '749367cc-b3c6-4189-aa95-1f2df506d6c9',
    children: [
      {
        align: 'left',
        children: [
          {
            color: '#000000',
            text: '一级有序列表',
          },
        ],
        'numbered-item': {
          nodeType: 'block',
          leval: 0,
          start: 1,
        },
      },
      {
        align: 'left',
        children: [
          {
            color: '#000000',
            text: '二级有序列表',
          },
        ],
        'numbered-item': {
          nodeType: 'block',
          leval: 1,
          start: 1,
        },
      },
      {
        align: 'left',
        children: [
          {
            color: '#000000',
            text: '三级有序列表',
          },
        ],
        'numbered-item': {
          nodeType: 'block',
          leval: 2,
          start: 1,
        },
      },
      {
        align: 'left',
        children: [
          {
            color: '#000000',
            text: '单独计数待实现',
            underline: true,
            bold: true,
          },
        ],
        'numbered-item': {
          nodeType: 'block',
          leval: 0,
          start: 0,
        },
      },
    ],
  },
  {
    align: 'left',
    children: [
      {
        text: '分割线',
      },
    ],
    id: '2023394e-fc4c-4760-b2c9-1e145820ff8d',
    heading: {
      nodeType: 'block',
      leval: 3,
    },
  },
  {
    align: 'left',
    children: [
      {
        text: '支持分割线,快捷键 ',
        color: '#000000',
      },
      {
        text: '---',
        color: '#000000',
        'line-code': true,
      },
      {
        text: '。',
        color: '#000000',
      },
    ],
    id: '7a312e26-ad93-4734-b81f-c6958457f6ea',
  },
  {
    align: 'left',
    id: '3c8f9e1a-ac76-404e-a4fd-335b6bb609ad',
    children: [
      {
        color: '#000000',
        text: '',
      },
    ],
    'dividing-line': true,
  },
  {
    id: '63b005a0-ffc7-41a6-a2f9-6fbc1bac863f',
    children: [
      {
        text: '高亮块',
      },
    ],
    heading: {
      nodeType: 'block',
      leval: 3,
    },
  },
  {
    callout: {
      theme: 'info',
    },
    id: 'a90f7fee-80c5-4bcd-a1bc-4354d8b77ef4',
    children: [
      {
        children: [
          {
            text: '🌰 举个栗子',
          },
        ],
        'callout-item': true,
      },
      {
        'callout-item': true,
        children: [
          {
            text: '支持高亮块 可以用于提示文档中的重要内容。',
          },
        ],
      },
    ],
  },
  {
    callout: {
      theme: 'success',
    },
    id: 'fe54a989-603e-4491-99de-825f921f2c26',
    children: [
      {
        children: [
          {
            text: '🏝 可以为高亮块更换主题。',
          },
        ],
        'callout-item': true,
      },
    ],
  },
  {
    id: 'e1518ac3-5120-415d-8ce0-6bb55893403a',
    children: [
      {
        text: '行高',
      },
    ],
    heading: {
      nodeType: 'block',
      leval: 3,
    },
  },
  {
    id: 'f60c57b5-ca42-4f3c-8470-543c0038382a',
    children: [
      {
        text: '支持独立设置行高。当前',
      },
      {
        text: '行高=2',
        'line-code': true,
      },
    ],
    'line-height': '2',
  },
  {
    id: 'c0ae4ded-097b-4d3f-9977-906c711b1116',
    children: [
      {
        text: '图片',
      },
    ],
    heading: {
      nodeType: 'block',
      leval: 3,
    },
  },
  {
    id: '512abcfe-a737-4a00-a3c1-887cd27cb934',
    children: [
      {
        text: '支持图片上传',
      },
    ],
  },
  {
    id: 'b7412365-afc3-4c4f-b5f8-3a584062797b',
    children: [
      {
        text: '',
      },
    ],
    image: {
      src: 'https://avatars.githubusercontent.com/u/74407992',
      maxSize: {
        width: 650,
        height: 550,
      },
      size: {
        width: 430,
        height: 430,
      },
      fit: 'contain',
    },
  },
  {
    id: '564be823-9ca6-4deb-bcb1-3c732abd338e',
    children: [
      {
        text: '代码块',
      },
    ],
    heading: {
      nodeType: 'block',
      leval: 3,
    },
  },
  {
    code: {
      language: 'javascript',
    },
    id: '7bdd6743-183f-404a-acc8-9b790cbabf65',
    children: [
      {
        'code-item': true,
        children: [
          {
            text: 'const a = 1;',
          },
        ],
      },
      {
        'code-item': true,
        children: [
          {
            text: 'const b = 2;',
          },
        ],
      },
    ],
  },
  {
    id: 'b26df44f-1629-421c-906e-04a36d38f8ea',
    children: [
      {
        text: 'Ctrl + Enter',
      },
    ],
    heading: {
      nodeType: 'block',
      leval: 3,
    },
  },
  {
    id: '67a9586d-6ad7-4888-a080-3a85bc20c5ee',
    children: [
      {
        text: '支持 ',
      },
      {
        text: 'Ctrl + Enter',
        'line-code': true,
      },
      {
        text: ' 回车切入到下一行',
      },
    ],
  },
  {
    id: 'cfd2f4ea-6636-4c1b-a96f-c6243deda359',
    children: [
      {
        text: '插入链接',
      },
    ],
    heading: {
      nodeType: 'block',
      leval: 3,
    },
  },
  {
    id: 'c084fde2-1e7b-48b4-ae26-28203e50547f',
    children: [
      {
        text: '支持 ',
      },
      {
        text: 'Ctrl + K',
        'line-code': true,
      },
      {
        text: ' 快捷键',
      },
    ],
  },
  {
    id: '4edc5124-064e-4a2d-8591-4d30a69c322d',
    children: [
      {
        text: '点击进入百度',
        link: {
          link: 'www.baidu.com',
          id: '65e25f91-a948-42ef-9752-7dcb3ab9572f',
          open: false,
        },
      },
    ],
  },
  {
    id: '222d0eb7-9234-428d-a596-a4d18e11ae40',
    children: [
      {
        text: '点击进入GitHub',
        link: {
          link: 'https://github.com/ajaxpost/slate-editor-doc/tree/master',
          id: '0f155f9c-2a8f-48d6-8d28-a91d227022ec',
          open: false,
        },
      },
    ],
  },
  {
    id: 'f112ac45-baf9-4f33-b33c-4b1847ec7ee7',
    children: [
      {
        text: '其他',
      },
    ],
    heading: {
      nodeType: 'block',
      leval: 3,
    },
  },
  {
    id: '7b47bd5e-076c-4ba8-afca-c47b539bf0e3',
    children: [
      {
        text: '后续支持待完善...',
      },
    ],
  },
];

type IProps = {
  width?: number;
  style?: React.CSSProperties;
  className?: string;
};
export const Editable: FC<IProps> = ({ width, style, className }) => {
  const editorState = useEditorState();
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [menuActiveKey, setMenuActiveKey] = useState('heading-#');
  const [menuShow, setMenuShow] = useState(false);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [actions, setActions] = useState(menuConfig);
  const editor = useMemo(
    () =>
      withShortcuts(
        editorState,
        withNodeId(withReact(withHistory(createEditor())))
      ),
    []
  );
  const [toolbarState, setToolbarState] = useState<ToolbarContextType>(() => {
    return {
      textAndTitle: '',
      fontSize: {
        size: '',
        disabled: false,
      },
    };
  });

  useEffect(() => {
    const click = () => {
      setMenuShow(false);
    };
    document.addEventListener('click', click);
    return () => {
      document.removeEventListener('click', click);
    };
  }, []);

  const handlerChange = useCallback(
    _.debounce((value) => {
      console.log('Slate Value', value);
    }, 500),
    []
  );

  const onChange = (value) => {
    handlerChange(value);
    EVENT_HANDLERS.onChange(editorState, setToolbarState)(value);
  };

  const onKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    EVENT_HANDLERS.onKeyUp(editorState, {
      setMenuActiveKey,
      menuActiveKey,
      setMenuShow,
      menuShow,
      setMenuPosition,
      actions,
      setActions,
    })(event);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const events: any[] = [];

    for (const name in editorState.plugins) {
      const plugin = editorState.plugins[name];
      const plugin_events = plugin?.events || {};
      if (plugin_events.onKeyDown) {
        events.push(plugin_events.onKeyDown);
      }
    }
    for (const name in editorState.marks) {
      const mark = editorState.marks[name];
      const mark_events = mark?.events || {};
      if (mark_events.onKeyDown) {
        events.push(mark_events.onKeyDown);
      }
    }
    EVENT_HANDLERS.slashOnKeyDown(editorState, {
      setMenuActiveKey,
      menuActiveKey,
      setMenuShow,
      menuShow,
      setMenuPosition,
      actions,
      setActions,
    })(event);
    for (const e of _.uniq(events)) {
      e(editorState, HOTKEYS)(event);
    }
    EVENT_HANDLERS.onKeyDown(editorState)(event);
  };
  const items = useMemo(
    // @ts-ignore
    () => editor.children.map((element) => element.id),
    [editor.children]
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active) {
      setActiveId(event.active.id);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const overId = event.over?.id;
    // @ts-ignore
    const overIndex = editor.children.findIndex((x) => x.id === overId);
    if (overId !== activeId && overIndex !== -1) {
      Transforms.moveNodes(editor, {
        at: [],
        match: (node: any) => node.id === activeId,
        to: [overIndex],
      });
    }
    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const { renderElement, renderLeaf, decorate } = useMemo(
    () => EditorPlugin.start(editorState, items),
    [editorState, items]
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: 12,
        },
      }}
    >
      <ToolbarProvider value={toolbarState}>
        <Toolbar editorState={editorState} />
        <div
          className={css`
            padding-top: 42px;
          `}
        >
          <SlashProvider
            value={{
              menuPosition,
              setMenuPosition,
              menuShow,
              setMenuShow,
              menuActiveKey,
              setMenuActiveKey,
              actions,
              setActions,
            }}
          >
            <Slate
              editor={editor}
              onChange={onChange}
              initialValue={initialValue}
            >
              <DndContext
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
              >
                <SortableContext items={items}>
                  <_Editable
                    autoFocus
                    className={css`
                      width: ${width ? `${width}px` : '100%'};
                      padding-left: 2rem;
                      padding-right: 2rem;
                      padding-bottom: 20vh;
                      padding-top: 1rem;
                      font-size: 1rem;
                      line-height: 1.5rem;
                      outline: none;
                      height: 100%;
                      ${className}
                    `}
                    id="editable"
                    spellCheck
                    readOnly={false}
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    decorate={decorate}
                    onKeyDown={onKeyDown}
                    onKeyUp={onKeyUp}
                    style={style}
                  />
                </SortableContext>
              </DndContext>
              {menuShow && <ActionMenu />}
            </Slate>
          </SlashProvider>
        </div>
      </ToolbarProvider>
    </ConfigProvider>
  );
};
