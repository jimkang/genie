var Automaton = require('cellular-automaton');
var sortCellsByDist = require('sort-cells-by-dist');
var loadCellDefs = require('./load-cell-defs');
var handleError = require('handle-error-web');
var RouteState = require('route-state');
var rules = require('./rules');
var adjustableRules = require('./adjustable-rules');
var basicCellTemplates = require('./data/basic-cell-templates.json');
var sb = require('standard-bail')();
var getMap = require('./get-map');
var queue = require('d3-queue').queue;
var introFlow = require('./flows/intro-flow');
var gameControlsFlow = require('./flows/game-controls-flow');
var curry = require('lodash.curry');

(function go() {
  window.onerror = reportTopLevelError;
  var routeState = RouteState({
    followRoute,
    windowObject: window
  });

  routeState.routeFromHash();

  function followRoute(routeDict) {
    introFlow({ routeState, skipIntro: routeDict.skipIntro });

    var templateSrc = routeDict.cellDefSrc || basicCellTemplates;
    var q = queue();
    q.defer(loadCellDefs, { rules, adjustableRules, templateSrc });
    q.defer(getMap, routeDict.mapSrc);
    q.await(sb(startAutomaton, handleError));
  }

  function startAutomaton(cellDefs, cellMap) {
    var automaton = Automaton({
      cellMap,
      cellDefs,
      orderingFn: curry(sortCellsByDist)({ col: 0, row: 0 })
    });
    gameControlsFlow({ routeState, automaton });
  }
})();

function reportTopLevelError(msg, url, lineNo, columnNo, error) {
  handleError(error);
}
