var d3 = require('d3-selection');

var startButton = d3.select('#start-button');
var metaSection = d3.select('section.meta');

function renderIntro({ skipIntro, onStart }) {
  startButton.on('click.start', null);
  startButton.on('click.start', onStart);
  metaSection.classed('hidden', skipIntro === 'yes');
}

module.exports = renderIntro;
