import { FC } from 'react';
import Editable from '@slate-doc/core';
// import "@slate-doc/core/dist/index.css";
import { Heading } from '@slate-doc/headings';
import { BlockQuote } from '@slate-doc/blockquote';
import { Callout } from '@slate-doc/callout';
import { BulletedList, NumberedList } from '@slate-doc/lists';
import { DividingLine } from '@slate-doc/dividing-line';
import { Code } from '@slate-doc/code';
import { Image } from '@slate-doc/image';
import { Table } from '@slate-doc/table';
import {
  Bold,
  Italic,
  Strikethrough,
  Underline,
  Align,
  LineHeight,
  LineCode,
  FontSize,
  FontColor,
  Link,
} from '@slate-doc/marks';
import { css } from '@emotion/css';
import { data } from './default-value.json';

const plugins = [
  Heading,
  BlockQuote,
  Callout,
  BulletedList,
  NumberedList,
  DividingLine,
  Code,
  Image,
  Table,
  Bold,
  Italic,
  Strikethrough,
  Underline,
  Align,
  LineHeight,
  LineCode,
  FontSize,
  FontColor,
  Link,
];

const App: FC = () => {
  return (
    <>
      <style>
        {`
      body{
        margin:0;
        padding:0;
      }
      `}
      </style>
      <header
        className={css`
          position: sticky;
          top: 0;
          background: #fff;
          z-index: 1000;
        `}
      >
        <div
          className={css`
            min-height: 50px;
            display: flex;
            line-height: 50px;
            box-box: border-box;
            padding: 0 30px;
          `}
        >
          <div
            className={css`
              flex: auto;
              text-align: left;
            `}
          >
            <h1
              className={css`
                width: 85px;
                font-size: 1.25rem;
                line-height: 1.75rem;
                font-weight: 700;
                display: flex;
                background-color: #f4f4f5;
              `}
            >
              <span>SLATE</span>
              <span
                className={css`
                  background-color: #09090b;
                  color: #fff;
                `}
              >
                DOC
              </span>
            </h1>
          </div>
          <div
            className={css`
              flex: auto;
              text-align: right;
            `}
          >
            <div
              className={css`
                display: flex;
                align-items: center;
                height: 100%;
                flex: auto;
                justify-content: flex-end;
              `}
            >
              <a
                href="https://github.com/ajaxpost/slate-editor-doc"
                target="_blank"
                title="github"
              >
                <svg
                  height="19"
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  version="1.1"
                  width="19"
                  data-view-component="true"
                >
                  <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>
      <div
        className={css`
          background: #f2f3f5;
        `}
      >
        <Editable
          plugins={plugins}
          placeholder="键入 / 打开菜单"
          width={700}
          value={data}
          readonly={false}
          style={{ margin: '0 auto', background: '#fff' }}
        />
      </div>
    </>
  );
};

export default App;
