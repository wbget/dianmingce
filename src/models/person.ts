import { extendObservable } from 'mobx';

class Person {
  id: number;
  constructor() {
    extendObservable(this, {
      name: '',
      status: 0,
    });
  }
}
export default Person;
