var Automaton = require('cellular-automaton');
var sortCellsByDist = require('sort-cells-by-dist');
var cellDefs = require('./cell-defs');
var curry = require('lodash.curry');
var flatten = require('lodash.flatten');
var pluck = require('lodash.pluck');
var compact = require('lodash.compact');
var d3 = require('d3-selection');
var renderCells = require('./dom/render-cells');
var renderLogs = require('./dom/render-logs');

var initialMap = `
      xoxox
      xxoox
      xoxxo
      oopxx
      oxxxo
    `;

(function go() {
  var accumulatedLogs;
  var automaton = Automaton({
    cellMap: initialMap,
    cellDefs,
    orderingFn: curry(sortCellsByDist)({ col: 0, row: 0 })
  });

  renderControls({ onStep, onGeneration });
  renderCells({ cells: automaton.getCells() });

  function onStep() {
    var logs = automaton.step();
    accumulatedLogs = logs.concat(accumulatedLogs);
    console.log(automaton.getMap());
    render({
      cells: automaton.getCells(),
      logs: accumulatedLogs,
      latestLogs: logs
    });
  }

  function onGeneration() {
    var logs = automaton.generationStep();
    accumulatedLogs = flatten(logs).concat(accumulatedLogs);
    renderCells({ cells: automaton.getCells() });
    console.log(automaton.getMap());
    render({
      cells: automaton.getCells(),
      logs: accumulatedLogs,
      latestLogs: logs
    });
  }
})();

function render({ cells, logs, latestLogs }) {
  var instigatorId;
  var sourceIds;
  var targetIds;
  if (latestLogs.length > 0) {
    // There could be more than one instigator instance in a run, but they'll
    // always be the same id.
    instigatorId = latestLogs[0].instigator;
    sourceIds = compact(flatten(flatten(pluck(latestLogs, 'sources'))));
    targetIds = compact(flatten(flatten(pluck(latestLogs, 'targets'))));
  }
  renderCells({ cells, instigatorId, sourceIds, targetIds });
  renderLogs({ logs });
}

function renderControls({ onStep, onGeneration }) {
  d3.select('#step-button').on('click', onStep);
  d3.select('#generation-button').on('click', onGeneration);
}
