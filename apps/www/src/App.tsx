import { FC } from 'react';
import Editable from '@slate-doc/core';
// import "@slate-doc/core/dist/index.css";
import { Heading } from '@slate-doc/headings';
import { BlockQuote } from '@slate-doc/blockquote';
import { Callout } from '@slate-doc/callout';
import { BulletedList, NumberedList } from '@slate-doc/lists';
import { DividingLine } from '@slate-doc/dividing-line';
import { Code } from '@slate-doc/code';
import {
  Bold,
  Italic,
  Strikethrough,
  Underline,
  Align,
  LineCode,
  FontSize,
  FontColor,
} from '@slate-doc/marks';

const plugins = [
  Heading,
  BlockQuote,
  Callout,
  BulletedList,
  NumberedList,
  DividingLine,
  Code,
  Bold,
  Italic,
  Strikethrough,
  Underline,
  Align,
  LineCode,
  FontSize,
  FontColor,
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
      <Editable
        plugins={plugins}
        placeholder="Type / to open menu"
        width={600}
        style={{ margin: '0 auto' }}
      />
    </>
  );
};

export default App;
