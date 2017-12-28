var flatten = require('lodash.flatten');
var pluck = require('lodash.pluck');
var compact = require('lodash.compact');
var renderGameControls = require('../dom/render-game-controls');
var renderCells = require('../dom/render-cells');
var renderLogs = require('../dom/render-logs');

function gameControlsFlow({ routeState, automaton }) {
  var accumulatedLogs;
  // Is this scope OK? ^

  renderCells({ cells: automaton.getCells() });
  renderGameControls({ onStep, onGeneration, onShowIntro });

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

  function onShowIntro() {
    routeState.addToRoute({ skipIntro: 'no' });
  }

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
}

module.exports = gameControlsFlow;

// TODO: Own flow, own renderer.
