import csv from 'csv-load-sync';
import Datasource from './Datasource';

export default class CsvDatasource extends Datasource {
  constructor(file, mapping) {
    super();
    this._file = file;
    this._mapping = mapping;
    this._rows = [];
  }

  // read in the CSV file
  async init() {
    this._rows = csv(this._file).map(this._mapping);
  }

  // Accepts a filter function for filtering the data.
  // In this case, we just filter the in-memory array. If this were pulling
  // from a SQL database, we could construct a query from the same input
  find(criteria) {
    return this._rows.filter(criteria);
  }

  // Match on entity id and replace
  update(entity) {
    var idx = this._rows.findIndex((e) => e.id === entity.id);
    if (idx.length === 0) {
      throw new Error(`Update failed. No entity with id ${entity.id} exists`);
    }

    // IDs should be unique so ignore this potential error
    this._rows[idx[0]] = entity;
  }
}
