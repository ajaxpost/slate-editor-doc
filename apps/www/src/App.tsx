import { FC } from 'react';
import Editable from '@slate-doc/core';
import { HeaderOne } from '@slate-doc/headings';

const plugins = [HeaderOne];

const App: FC = () => {
  return (
    <>
      <Editable plugins={plugins} placeholder="Type / to open menu" />
    </>
  );
};

export default App;
