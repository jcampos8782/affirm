// Mapping functions tell how to format the csv values.
export const bankMapping = b => ({
  id: parseInt(b.id),
  name: b.name
});

export const covenantMapping = c => ({
  facility_id: parseInt(c.facility_id),
  bank_id: parseInt(c.bank_id),
  max_default_likelihood: parseFloat(c.max_default_likelihood),
  state: c.state
});

export const facilityMapping = f => ({
  id: parseInt(f.id),
  bank_id: parseInt(f.bank_id),
  amount: parseFloat(f.amount),
  interest_rate: parseFloat(f.interest_rate)
});

export const loanMapping = l => ({
    id: parseInt(l.id),
    amount: parseFloat(l.amount),
    interest_rate: parseFloat(l.interest_rate),
    default_likelihood: parseFloat(l.default_likelihood),
    state: l.state
});
