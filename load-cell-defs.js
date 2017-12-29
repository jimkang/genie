var request = require('basic-browser-request');
var callNextTick = require('call-next-tick');
var RoteResponse = require('./rote-response');

function loadCellDefs({ rules, adjustableRules, templateSrc }, done) {
  if (typeof templateSrc === 'object') {
    callNextTick(done, null, convertTemplatesToDefs(templateSrc));
  } else if (typeof templateSrc === 'string') {
    request(
      { url: templateSrc, method: 'GET', json: true },
      RoteResponse({
        url: templateSrc,
        transformBody: convertTemplatesToDefs,
        done
      })
    );
  } else {
    callNextTick(
      done,
      new Error('Do not understand templateSrc: ' + templateSrc)
    );
  }

  function convertTemplatesToDefs(dict) {
    var defs = {};
    for (var key in dict) {
      let def = dict[key];
      def.rules = def.rules.map(convertRule);
      defs[key] = def;
    }
    return defs;
  }

  function convertRule(rule) {
    if (typeof rule === 'string') {
      return rules[rule];
    } else if (typeof rule === 'object') {
      let ctor = adjustableRules[rule.rule];
      return ctor(rule.params);
    } else if (typeof rule === 'function') {
      return rule;
    } else {
      throw new Error('Rule type unknown.');
    }
  }
}

module.exports = loadCellDefs;
