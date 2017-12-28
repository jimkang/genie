var d3 = require('d3-selection');

function renderGameControls({ onStep, onGeneration, onShowIntro }) {
  // TODO: Unregister/reregister handlers.
  d3.select('#step-button').on('click', onStep);
  d3.select('#generation-button').on('click', onGeneration);
  d3.select('#show-intro-button').on('click', onShowIntro);
}

module.exports = renderGameControls;
