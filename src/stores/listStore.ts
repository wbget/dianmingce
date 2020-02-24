import List from '../models/list';
interface ListStore {
  list: List[];
  currentList: List;
  add(name: string, id?: number): List;
  del(id: number);
}

export default () =>
  ({
    list: [],
    currentList: null,
    add(name: string, id?: number): List {
      let p;
      if (!id) {
        id = Math.floor(Math.random() * 10000000);
      } else {
        p = this.list.find(val => val.id === id);
      }
      if (!p) p = new List();
      p.id = id;
      p.name = name;
      this.list.push(p);
      return p;
    },
    del(id: number) {
      const index = this.list.findIndex(p => p.id === id);
      if (index > -1) {
        this.list.splice(index, 1);
      }
    },
  } as ListStore);

export { ListStore };
