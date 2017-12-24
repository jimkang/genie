var rules = require('./rules');
var adjustableRules = require('./adjustable-rules');

module.exports = {
  o: {
    mapSymbol: 'o',
    type: 'populated',
    takesSpace: true,
    living: true,
    rules: [rules.aging, rules.solitude, rules.overpopulation, rules.poops]
  },
  x: {
    mapSymbol: 'x',
    type: 'empty',
    takesSpace: false,
    living: false,
    rules: [rules.populate]
  },
  p: {
    mapSymbol: 'p',
    type: 'poo',
    takesSpace: true,
    living: false,
    rules: [rules.aging, adjustableRules.Decay({ lifeSpan: 3 })]
  },
  f: {
    mapSymbol: 'f',
    type: 'food',
    takesSpace: true,
    living: false,
    rules: [rules.aging, adjustableRules.Decay({ lifeSpan: 2 })]
  }
};
