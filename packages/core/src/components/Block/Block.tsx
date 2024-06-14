/**
 * @deprecated
 */
import { FC, ReactNode, useState } from 'react';
import { useEditorState } from '../../context/editor-context';
import { EditorBlockData } from '../../preset/types';

type IProps = {
  blockId: string;
  block: EditorBlockData;
  children: ReactNode;
};
const Block: FC<IProps> = ({ blockId, children, block }) => {
  const editor = useEditorState();
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  const handleMouseEnter = () => {
    if (editor.readOnly) return;
    setActiveBlockId(blockId);
  };
  const handleMouseLeave = () => {
    if (editor.readOnly) return;
    setActiveBlockId(null);
  };
  const isHovered = activeBlockId === blockId;
  const contentStyles = { borderBottom: '2px solid #007aff' };

  return (
    <div
      className="editor-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-editor-block
      data-editor-block-id={blockId}
      data-editor-hovered-block={isHovered}
    >
      {/* 控制 新增,拖动 按钮 */}
      <></>
      {/* 实际内容 */}
      <div style={contentStyles}>{children}</div>
      {/* selection 选中 */}
      <></>
    </div>
  );
};

export default Block;
