import fs from 'fs';
import stringify from 'csv-stringify';
// A mock stream. On close(), it will output the ./out/assignments and
// ./out/yields files.
export default class FundedLoanStream {
  constructor(cfg) {
    this._fundedLoans = [];
    this._assignmentsOutputFile = cfg.assignmentsOutputFile,
    this._yieldsOutputFile = cfg.yieldsOutputFile;
  }

  publish(loan) {
    this._fundedLoans.push(loan);
  }

  open() {
      // no-op
  }

  close() {
    // Save results to CSV File
    writeCsv(
      this._assignmentsOutputFile,
      {loan_id: "loan_id", facility_id: "facility_id"},
      this._fundedLoans.map(l => [l.loan_id, l.facility_id])
    );

    // Calculate yields per facility
    let yields = {};
    this._fundedLoans.forEach(function(loan){
      if(!yields[loan.facility_id]) {
        yields[loan.facility_id] = 0;
      }
      yields[loan.facility_id] += loan.yld;
    });

    writeCsv(
      this._yieldsOutputFile,
      { facility_id: "facility_id", yld: "expected_yield"},
      Object.keys(yields).map(k => [k, yields[k]])
    );
  }
}

function writeCsv(file, columns, data) {
  stringify(data, {header: true, columns: columns}, (err,out) => {
    if (err) throw err;
    fs.writeFile(file, out, (err) => {
      if (err) throw err;
    });
  })
}
