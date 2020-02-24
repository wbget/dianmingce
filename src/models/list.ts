import { observable, action, extendObservable } from 'mobx';
import Person from './person';

class List {
  id: number;
  people;
  constructor() {
    extendObservable(this, {
      name: '',
      people: observable([]),
      add: action((name: string, id?: number) => {
        let p;
        if (!id) {
          id = Math.floor(Math.random() * 10000000);
        } else {
          p = this.people.find(val => val.id === id);
        }
        if (!p) p = new Person();
        p.id = id;
        p.name = name;
        this.people.push(p);
        return p;
      }),
      del: action(id => {
        const index = this.people.findIndex(p => p.id === id);
        if (index > -1) {
          this.people.splice(index, 1);
        }
      }),
    });
  }
}

export default List;
