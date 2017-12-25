var rules = require('./rules');
var adjustableRules = require('./adjustable-rules');

module.exports = {
  o: {
    mapSymbol: 'o',
    type: 'person',
    takesSpace: true,
    nutrition: 3,
    living: true,
    rules: [
      rules.aging,
      // rules.solitude,
      // rules.overpopulation,
      rules.eating,
      rules.metabolism,
      rules.starvation,
      rules.poops
    ]
  },
  x: {
    mapSymbol: 'x',
    type: 'empty',
    takesSpace: false,
    living: false,
    rules: [rules.populate, rules.fertilization]
  },
  p: {
    mapSymbol: 'p',
    type: 'poo',
    takesSpace: true,
    living: false,
    rules: [
      rules.aging,
      adjustableRules.Decay({ lifeSpan: 3 }),
      rules.fertilization
    ]
  },
  m: {
    mapSymbol: 'm',
    type: 'meat',
    takesSpace: true,
    living: false,
    rules: [rules.aging, adjustableRules.Decay({ lifeSpan: 2 })]
  },
  v: {
    mapSymbol: 'v',
    type: 'plant',
    takesSpace: true,
    living: true,
    rules: [rules.aging, adjustableRules.Decay({ lifeSpan: 4 })]
  }
};
