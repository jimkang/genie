var request = require('basic-browser-request');
var sb = require('standard-bail')();
var callNextTick = require('call-next-tick');

function loadCellDefs({ rules, adjustableRules, templateSrc }, done) {
  if (typeof templateSrc === 'object') {
    callNextTick(done, null, convertTemplatesToDefs(templateSrc));
  } else if (typeof templateSrc === 'string') {
    request(
      { url: templateSrc, method: 'GET', json: true },
      sb(processRes, done)
    );
  } else {
    callNextTick(
      done,
      new Error('Do not understand templateSrc: ' + templateSrc)
    );
  }

  function processRes(res, body) {
    if (!body) {
      done(new Error('Empty cell defs received from: ' + templateSrc));
    } else if (res.statusCode < 200 || res.statusCode > 299) {
      done(
        new Error(
          'statusCode ' + res.statusCode + ' received from: ' + templateSrc
        )
      );
    } else {
      done(null, convertTemplatesToDefs(body));
    }
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
    }
  }
}

module.exports = loadCellDefs;
