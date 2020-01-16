import CovenantRepository from './src/repositories/CovenantRepository';
import FacilityRepository from './src/repositories/FacilityRepository';
import CsvDatasource from './src/datasources/CsvDatasource';
import LoanService from './src/services/LoanService'
import FundedLoanStream from './src/streams/FundedLoanStream';
import LoanRequestStream from './src/streams/LoanRequestStream';
import LoanRequestStreamProcessor from './src/stream_processors/LoanRequestStreamProcessor';

import {covenantMapping, facilityMapping} from './src/mapping.js'

const loanInputFile = `${process.cwd()}/large/loans.csv`;
const assignmentsOutputFile = `${process.cwd()}/out/assignments.csv`;
const yieldsOutputFile = `${process.cwd()}/out/yields.csv`;

let loanRequestStreamProcessor = new LoanRequestStreamProcessor(
  {
      loanRequestStream: new LoanRequestStream({csvFile: loanInputFile}),
      loanService: new LoanService({
        covenantRepository: new CovenantRepository(new CsvDatasource("./large/covenants.csv", covenantMapping)),
        facilityRepository: new FacilityRepository(new CsvDatasource("./large/facilities.csv", facilityMapping))
      }),
      fundedLoanStream: new FundedLoanStream({
        assignmentsOutputFile: assignmentsOutputFile,
        yieldsOutputFile: yieldsOutputFile
      })
  }
);

loanRequestStreamProcessor.start();
console.log("Complete!");
