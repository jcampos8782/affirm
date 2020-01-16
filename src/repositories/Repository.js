export default class Repository {
  // Perform any initialization.
  // This could be loading a CSV file into memory, creating a database
  // connection, connecting to a downstream service, etc.
  constructor(datastore) {
    datastore.init();
  }
}
