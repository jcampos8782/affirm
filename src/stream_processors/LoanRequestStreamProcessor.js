export default class LoanRequestStreamProcessor {
  constructor(cfg) {
    this._loanService = cfg.loanService;
    this._loanRequestStream = cfg.loanRequestStream;
    this._fundedLoanStream = cfg.fundedLoanStream;
  }

  start() {
    // Open the request stream for processing.
    this._loanRequestStream.onEvent((l) => this.processLoan(l));
    this._loanRequestStream.onClose(() => this.close())
    this._loanRequestStream.open();
  }

  processLoan(loan) {
    let availableFacilities = this._loanService.findFacilitiesForLoan(loan);

    // If there are no available facilities, log that the loan cannot be funded
    if (availableFacilities.length === 0) {
      console.log(`Cannot fund loan ${loan.id}. No available facilities`);
      return;
    }

    // Find the cheapest facility available
    let cheapestFacility = availableFacilities.reduce(function(cheapest, next){
      return cheapest.interest_rate > next.interest_rate ? next : cheapest;
    });

    let yld = this._loanService.fundLoan(loan, cheapestFacility);

    // Publish the new loan to the output stream.
    this._fundedLoanStream.publish({
      loan_id: loan.id,
      facility_id: cheapestFacility.id,
      yld: yld
    });
  }

  close() {
    // Close the output stream
    this._fundedLoanStream.close();
  }
}
