import csv from 'csv-load-sync';
import {loanMapping} from '../mapping.js'

export default class LoanRequestStream {
  constructor(cfg) {
    this._csvFile = cfg.csvFile;
    this._eventHandlers = [];
  }

  open() {
    // Load all requests into memory
    let loanRequests = csv(this._csvFile).map(loanMapping);
    loanRequests.map(loan => this._eventHandlers.map(h => h(loan)));
    this.close();
  }

  onEvent(handler) {
    this._eventHandlers.push(handler);
  }

  onClose(f) {
    this._onClose = f;
  }

  close() {
    if (this._onClose) {
      this._onClose();
    }
  }
}
