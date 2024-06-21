import { FC } from 'react';
import Editable from '@slate-doc/core';
import '@slate-doc/core/dist/index.css';
import { HeaderOne, HeaderTwo, HeaderThree } from '@slate-doc/headings';
import { BlockQuote } from '@slate-doc/blockquote';
import { Callout } from '@slate-doc/callout';
import { BulletedList, NumberedList } from '@slate-doc/lists';

const plugins = [
  HeaderOne,
  HeaderTwo,
  HeaderThree,
  BlockQuote,
  Callout,
  BulletedList,
  NumberedList,
];

const App: FC = () => {
  return (
    <>
      <Editable
        plugins={plugins}
        placeholder="Type / to open menu"
        width={600}
        style={{ margin: '0 auto', marginTop: '50px' }}
      />
    </>
  );
};

export default App;
