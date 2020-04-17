import { observable } from 'mobx';

class ApplicationStore {
  @observable foo = 'bar';
}

export default new ApplicationStore();
