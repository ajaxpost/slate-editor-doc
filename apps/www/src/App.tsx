import { FC } from 'react';
import Editable from '@slate-doc/core';
import '@slate-doc/core/dist/index.css';
import { HeaderOne, HeaderTwo } from '@slate-doc/headings';
import { BlockQuote } from '@slate-doc/blockquote';

const plugins = [HeaderOne, HeaderTwo, BlockQuote];

const App: FC = () => {
  return (
    <>
      <Editable plugins={plugins} placeholder="Type / to open menu" />
    </>
  );
};

export default App;
