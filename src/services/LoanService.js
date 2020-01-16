export default class LoanService {
  constructor({covenantRepository, facilityRepository}){
    this._covenantRepository = covenantRepository;
    this._facilityRepository = facilityRepository;
  }

  // Retrieves the ids of the facilities which are able fund a loan.
  findFacilitiesForLoan(loan) {
    // Find covenants which apply this loan violates.
    let brokenCovenants = this._covenantRepository.find(
      covenant => covenant.max_default_likelihood < loan.max_default_likelihood
      ||
      covenant.state === loan.state
    );

    // If any of these covenants have no facility id, it applies to the bank
    let filteredBanks = brokenCovenants
      .filter(c => c.facility_id === null)
      .map(c => c.bank_id);

    let filteredFacilities = brokenCovenants
      .filter(c => c.facility_id !== null)
      .map(c => c.facility_id);

    // return facilities which violate no covenants, can cover the funds,
    // and which do not generate a negative yield.
    return this._facilityRepository.find(function(facility){
      return  !filteredFacilities.includes(facility.id)
              &&
              !filteredBanks.includes(facility.bank_id)
              &&
              facility.amount >= loan.amount
              &&
              CalculateYield(loan, facility) >= 0
    });
  }

  fundLoan(loan, facility) {
    // TODO: Verify that the facility can fund based on findFacilitiesForLoan
    // Perhaps some sort of token would work to avoid the double checking?

    // TODO #2: Would need some locking mechanisms to avoid depleting race conditions
    // for funding loans.
    facility.amount -= loan.amount;
    this._facilityRepository.update(facility);
    return CalculateYield(loan, facility);
  }
}

function CalculateYield(loan, facility) {
    let yld =
      (1 - loan.default_likelihood) * loan.interest_rate * loan.amount
      -
      loan.default_likelihood * loan.amount
      -
      facility.interest_rate * loan.amount;
    return yld;
}
