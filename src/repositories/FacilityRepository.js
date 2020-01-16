import Repository from './Repository';

export default class FacilityRepository extends Repository {

    constructor(datastore) {
      super(datastore);
      this._ds = datastore;
    }

    find(criteria) {
      return this._ds.find(criteria);
    }

    update(facility) {
      this._ds.update(facility);
    }
}
