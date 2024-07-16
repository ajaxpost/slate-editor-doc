import { FC, useState } from 'react';
import { css } from '@emotion/css';
import { Resizable, ResizableProps } from 're-resizable';
import Resizer from './resizer';
import { useReadOnly } from '@slate-doc/core';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { Editor, Element, Path, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

interface IProps {
  children: React.ReactNode;
  props: Record<string, unknown>;
  slate: Editor;
  element: Element;
}

const DocImage: FC<IProps> = ({ children, props, slate, element }) => {
  const maxSize = props.maxSize as { width: number; height: number };
  const size = props.size as { width: number; height: number };
  const fit = props.fit as string;
  const isReadOnly = useReadOnly();
  const [sizes, setSizes] = useState({
    width: size?.width || 650,
    height: size?.height || 440,
  });

  const resizeProps: ResizableProps = {
    minWidth: 300,
    maxWidth: maxSize.width,
    maxHeight: maxSize.height,
    size: {
      width: sizes.width,
      height: sizes.height,
    },
    lockAspectRatio: true,
    handleStyles: {
      left: { left: -30 },
      right: { right: -30 },
    },
    enable: {
      left: !isReadOnly,
      right: !isReadOnly,
    },
    onResize: (e, dir, ref) => {
      setSizes({
        width: ref.offsetWidth,
        height: ref.offsetHeight,
      });
    },
    onResizeStop: (e, dir, ref) => {
      const size = {
        width: ref.offsetWidth,
        height: ref.offsetHeight,
      };
      let path: Path = [];
      try {
        path = ReactEditor.findPath(slate, element);
      } catch (error) {
        const nodes = Editor.nodes(slate, {
          at: [],
          match: (n) => {
            return (
              Element.isElement(n) &&
              Editor.isBlock(slate, n) &&
              !!n['image'] &&
              n.id === element.id
            );
          },
        });
        for (const [node, _path] of nodes) {
          if (!node['image']) return;
          path = _path;
        }
      }
      Transforms.setNodes(
        slate,
        {
          image: {
            ...props,
            size,
          },
        },
        { at: path }
      );
    },
    resizeRatio: 2,
    handleComponent: {
      left: <Resizer />,
      right: <Resizer />,
    },
  };

  return (
    <PhotoProvider>
      <div contentEditable={false}>
        <Resizable
          {...resizeProps}
          className={css`
            box-sizing: border-box;
            margin: 0 auto;
          `}
        >
          <div
            className={css`
              width: 100%;
              height: 100%;
            `}
          >
            <PhotoView src={(props.src || '') as string}>
              <img
                src={(props.src || '') as string}
                className={css`
                  object-fit: ${fit};
                  background-color: transparent;
                  width: 100%;
                  height: 100%;
                `}
              />
            </PhotoView>
          </div>

          {children}
        </Resizable>
      </div>
    </PhotoProvider>
  );
};

export default DocImage;
