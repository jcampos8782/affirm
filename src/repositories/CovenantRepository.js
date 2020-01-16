import Repository from './Repository';

export default class CovenantRepository extends Repository {

    constructor(datastore) {
      super(datastore);
      this._ds = datastore;
    }

    find(criteria) {
      return this._ds.find(criteria);
    }
}
