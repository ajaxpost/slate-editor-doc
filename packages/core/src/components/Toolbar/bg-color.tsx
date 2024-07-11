import { FC, useState, useEffect } from 'react';
import { btn, widget } from './css';
import { Button, Popover, Tooltip } from 'antd';
import { css } from '@emotion/css';
import { colors } from './config';
import { Editor } from 'slate';
import { useEditorState } from '../../context/editor-context';

const BgColor: FC = () => {
  const editorState = useEditorState();
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState('#DF2A3F');

  useEffect(() => {
    const click = () => {
      setOpen(false);
    };
    document.addEventListener('click', click);
    return () => {
      document.removeEventListener('click', click);
    };
  }, []);

  const colorClick = (item) => {
    const slate = editorState.slate;
    if (!slate || !slate.selection) return;
    setOpen(false);
    setColor(item.color);
    Editor.addMark(slate, 'bg-color', item.color);
  };

  return (
    <Popover
      arrow={false}
      open={open}
      content={
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {/* 默认 */}
          <div
            className={css`
              display: flex;
              align-items: center;
              padding: 4px 8px;
              margin: 4px 0 8px;
              border-radius: 2px;
              cursor: pointer;
              box-sizing: border-box;
              &:hover {
                background-color: #f4f5f5;
              }
            `}
            onClick={() => colorClick({ color: '#000000', title: '黑色' })}
          >
            <span
              className={css`
                width: 24px;
                height: 24px;
                padding: 2px 2px;
                display: inline-block;
                border-radius: 3px 3px;
                border: 1px solid transparent;
                flex: 0 0 auto;
                cursor: pointer;
                box-sizing: border-box;
              `}
            >
              <span
                className={css`
                  position: relative;
                  width: 18px;
                  height: 18px;
                  display: block;
                  border-radius: 2px 2px;
                  border: 1px solid transparent;
                  background-color: rgb(38, 38, 38);
                  box-sizing: border-box;
                `}
              ></span>
            </span>
            <span
              className={css`
                margin-left: 8px;
                line-height: 2;
              `}
            >
              默认
            </span>
          </div>
          {/* color group */}
          {colors.map((arr, key) => {
            return (
              <span
                key={key}
                className={css`
                  display: flex;
                  padding: 0 8px;
                  width: 100%;
                  height: auto;
                  position: relative;
                  box-sizing: border-box;
                `}
              >
                {arr.map((item) => {
                  return (
                    <span
                      key={item.color}
                      title={item.title}
                      className={css`
                        width: 24px;
                        height: 24px;
                        padding: 2px 2px;
                        display: inline-block;
                        border-radius: 3px 3px;
                        border: 1px solid transparent;
                        flex: 0 0 auto;
                        cursor: pointer;
                        box-sizing: border-box;
                        &:hover {
                          border: 1px solid #d9d9d9;
                          box-shadow: 0 1px 2px rgb(0 0 0 / 12%);
                        }
                      `}
                      onClick={() => colorClick(item)}
                    >
                      <span
                        className={css`
                          position: relative;
                          width: 18px;
                          height: 18px;
                          display: block;
                          border-radius: 2px 2px;
                          border: 1px solid rgba(0, 0, 0, 0.04);
                          background-color: ${item.color};
                          box-sizing: border-box;
                        `}
                      ></span>
                    </span>
                  );
                })}
              </span>
            );
          })}
        </div>
      }
      trigger={['click']}
      overlayInnerStyle={{
        borderRadius: 5,
        background: '#fff',
        border: '1px solid #e7e9e8',
        boxShadow: '0 8px 16px 4px rgb(0 0 0 / 4%)',
        color: '#262626',
        padding: 0,
      }}
    >
      <div className={widget} data-actived={open}>
        {/* A */}
        <Tooltip arrow={false} title={'背景颜色'}>
          <Button
            className={btn}
            type="text"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              colorClick({ color });
            }}
          >
            <svg
              width="18px"
              height="18px"
              viewBox="0 0 256 256"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                id="icon/填充色"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
              >
                <g id="icon/背景颜色">
                  <g id="编组" fill="currentColor">
                    <g
                      transform="translate(119.502295, 137.878331) rotate(-135.000000) translate(-119.502295, -137.878331) translate(48.002295, 31.757731)"
                      id="矩形"
                    >
                      <path
                        d="M100.946943,60.8084699 L43.7469427,60.8084699 C37.2852111,60.8084699 32.0469427,66.0467383 32.0469427,72.5084699 L32.0469427,118.70847 C32.0469427,125.170201 37.2852111,130.40847 43.7469427,130.40847 L100.946943,130.40847 C107.408674,130.40847 112.646943,125.170201 112.646943,118.70847 L112.646943,72.5084699 C112.646943,66.0467383 107.408674,60.8084699 100.946943,60.8084699 Z M93.646,79.808 L93.646,111.408 L51.046,111.408 L51.046,79.808 L93.646,79.808 Z"
                        fillRule="nonzero"
                      ></path>
                      <path
                        d="M87.9366521,16.90916 L87.9194966,68.2000001 C87.9183543,69.4147389 86.9334998,70.399264 85.7187607,70.4 L56.9423078,70.4 C55.7272813,70.4 54.7423078,69.4150264 54.7423078,68.2 L54.7423078,39.4621057 C54.7423078,37.2523513 55.5736632,35.1234748 57.0711706,33.4985176 L76.4832996,12.4342613 C78.9534987,9.75382857 83.1289108,9.5834005 85.8093436,12.0535996 C87.1658473,13.303709 87.9372691,15.0644715 87.9366521,16.90916 Z"
                        fillRule="evenodd"
                      ></path>
                      <path
                        d="M131.3,111.241199 L11.7,111.241199 C5.23826843,111.241199 0,116.479467 0,122.941199 L0,200.541199 C0,207.002931 5.23826843,212.241199 11.7,212.241199 L131.3,212.241199 C137.761732,212.241199 143,207.002931 143,200.541199 L143,122.941199 C143,116.479467 137.761732,111.241199 131.3,111.241199 Z M124,130.241 L124,193.241 L19,193.241 L19,130.241 L124,130.241 Z"
                        fillRule="nonzero"
                      ></path>
                    </g>
                  </g>
                  <path
                    d="M51,218 L205,218 C211.075132,218 216,222.924868 216,229 C216,235.075132 211.075132,240 205,240 L51,240 C44.9248678,240 40,235.075132 40,229 C40,222.924868 44.9248678,218 51,218 Z"
                    id="矩形"
                    fill={color}
                  ></path>
                </g>
              </g>
            </svg>
          </Button>
        </Tooltip>
        {/* arrow */}
        <Tooltip arrow={false} title="背景颜色">
          <Button
            className={btn}
            style={{
              width: 16,
              minWidth: 16,
            }}
            type="text"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
          >
            <span
              className={css`
                width: 16px;
                height: 16px;
                background-position: 50%;
                background-repeat: no-repeat;
                background-size: cover;
                display: inline-block;
                background-image: url(https://gw.alipayobjects.com/zos/bmw-prod/d5fce5b0-cd60-43b0-a351-9463486be4d2.svg);
              `}
            ></span>
          </Button>
        </Tooltip>
      </div>
    </Popover>
  );
};

export default BgColor;
