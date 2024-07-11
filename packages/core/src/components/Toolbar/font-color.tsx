import { FC, useState, useEffect } from 'react';
import { btn, widget } from './css';
import { Button, Popover, Tooltip } from 'antd';
import { css } from '@emotion/css';
import { colors } from './config';
import { Editor } from 'slate';
import { useEditorState } from '../../context/editor-context';

const FontSize: FC = () => {
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
    Editor.addMark(slate, 'color', item.color);
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
        <Tooltip arrow={false} title={'字体颜色'}>
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
              viewBox="0 0 240 240"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                id="icon/字体颜色"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
              >
                <g transform="translate(0.000000, 0.500000)">
                  <g transform="translate(39.000000, 17.353553)">
                    <path
                      d="M11,201.146447 L167,201.146447 C173.075132,201.146447 178,206.071314 178,212.146447 C178,218.221579 173.075132,223.146447 167,223.146447 L11,223.146447 C4.92486775,223.146447 7.43989126e-16,218.221579 0,212.146447 C-7.43989126e-16,206.071314 4.92486775,201.146447 11,201.146447 Z"
                      id="矩形"
                      fill={color}
                      fillRule="evenodd"
                    ></path>
                    <path
                      d="M72.3425855,16.8295583 C75.799482,7.50883712 86.1577877,2.75526801 95.4785089,6.21216449 C100.284516,7.99463061 104.096358,11.7387855 105.968745,16.4968188 L106.112518,16.8745422 L159.385152,161.694068 C161.291848,166.877345 158.635655,172.624903 153.452378,174.531599 C148.358469,176.405421 142.719567,173.872338 140.716873,168.864661 L140.614848,168.598825 L89.211,28.86 L37.3759214,168.623816 C35.4885354,173.712715 29.8981043,176.351047 24.7909589,174.617647 L24.5226307,174.522368 C19.4337312,172.634982 16.7953993,167.044551 18.5287999,161.937406 L18.6240786,161.669077 L72.3425855,16.8295583 Z"
                      id="路径-21"
                      fill="currentColor"
                      fillRule="nonzero"
                    ></path>
                    <path
                      d="M121,103.146447 C126.522847,103.146447 131,107.623599 131,113.146447 C131,118.575687 126.673329,122.994378 121.279905,123.142605 L121,123.146447 L55,123.146447 C49.4771525,123.146447 45,118.669294 45,113.146447 C45,107.717207 49.3266708,103.298515 54.7200952,103.150288 L55,103.146447 L121,103.146447 Z"
                      id="路径-22"
                      fill="currentColor"
                      fillRule="nonzero"
                    ></path>
                  </g>
                </g>
              </g>
            </svg>
          </Button>
        </Tooltip>
        {/* arrow */}
        <Tooltip arrow={false} title="字体颜色">
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

export default FontSize;
