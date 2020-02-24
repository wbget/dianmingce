import * as React from 'react';
import { ListStore } from '../stores/listStore';

export const storeContext = React.createContext(null);

const useStores = (): { listStore: ListStore } => {
  const store = React.useContext(storeContext);
  return store;
};

export default useStores;
