import * as React from 'react';
import './app.css';
import ListStore from './stores/listStore';
import { storeContext } from './hooks/useStores';
import { useLocalStore } from 'mobx-react';

const App = ({ children }) => {
  const listStore = useLocalStore(ListStore);
  return (
    <storeContext.Provider value={{ listStore }}>
      {children}
    </storeContext.Provider>
  );
};
wx.cloud.init({});

export default App;
