# Coding Challenge Solution for Affirm

## Building & Running the Solution
This solution is intended to be run via Docker but can be run on any machine
with `nodejs` and `npm` installed. The output artifacts will be placed into the
`out` directory regardless of which method you choose to run this application.

### Running with Docker
Navigate to the project directory and then run the following docker commands:
```
docker build . -t jcampos/affirm
docker run --mount type=bind,src=$(pwd)/out,target=/Affirm/out $( docker images | grep 'jcampos/affirm' | awk '{print $3}')
```

### Running with `npm`
Navigate to the project directory and run the following commands:
```
npm install
npm start
```

## Q & A
#### How long did you spend working on the problem? What did you find to be the most difficult part?
I spent a little over four hours working on this solution. If not for wanting to create some abstractions
around the data sources and inputs, I could have completed it sooner. My goal was to be able to abstract away
the fact that the data was coming from CSV files and make the solution adaptable to use databases for the
covenant and facility sources and streams for the loan requests and loan funding events. Creating these
abstractions was the most difficult part of my solution.

#### How would you modify your data model or code to account for an eventual introduction of new, as-of-yet unknown types of covenants, beyond just maximum default likelihood and state restrictions?

To update how covenants are applied, the only changes would need to be in the business logic located in the `src/services/LoanService` class. In particular, the following code in `findFacilitiesForLoan()` would need modification:

```
let brokenCovenants = this._covenantRepository.find(
  covenant => covenant.max_default_likelihood < loan.max_default_likelihood
  ||
  covenant.state === loan.state
);
```

#### How would you architect your solution as a production service wherein new facilities can be introduced at arbitrary points in time. Assume these facilities become available by the finance team emailing your team and describing the addition with a new set of CSVs.
I believe I have architected this solution in such a manner that the source of facilities could be altered to include new csv files, a database, or really any type of structured data source.

#### Your solution most likely simulates the streaming process by directly calling a method in your code to process the loans inside of a for loop. What would a REST API look like for this same service? Stakeholders using the API will need, at a minimum, to be able to request a loan be assigned to a facility, and read the funding status of a loan, as well as query the capacities remaining in facilities.

A REST API for this solution might look something like the following:
```
GET /facilities/{id} - Return the status of a facility
GET /loans/{id} - Return the status of a loan.
GET /facilities?default_likelihood={d}&state={s} - Return all facilities capable of funding a loan based on the restrictions supplied
POST /facilities/{id}/loans - Assign a loan to a facility
```

#### How might you improve your assignment algorithm if you were permitted to assign loans in batch rather than streaming? We are not looking for code here, but pseudo code or description of a revised algorithm appreciated.

The definition of "improve" the algorithm depends on how you define improvement. From a business perspective, it may
be possible to improve yields over a specific batch. Or, from a resource perspective we could reduce the amount of
round trips to databases and disk i/o by building composite queries instead of querying the data set once for each
record.

#### Discuss your solution’s runtime complexity.
The solution's runtime complexity is a product of the number of loan requests, covenants, and facilities. As the number of covenants and facilities increases, so does the amount of time to query the data per loan. This could be mitigated by building efficient indexes on the data sets.

## Notes
 * Although there are no unit tests, I was using TDD via the `small` data sets. Real, production code would obviously be much more rigorously tested.
 * This application is intended to be run as a single instance. If this were reaching out to databases and funding real loans,
 there would be several places where race conditions would create problems. We would need to use something like ZooKeeper to create locks on facility resources prior to funding.

 ## Questions?
 If you have any questions for me, please feel free to reach out at jcampos8782@gmail.com
