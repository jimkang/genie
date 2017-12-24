var d3 = require('d3-selection');
var logsRoot = d3.select('#logs-root');

function renderLogs({ logs }) {
  var logSel = logsRoot.selectAll('.log').data(logs);
  logSel.exit().remove();

  var newLogSel = logSel
    .enter()
    .append('li')
    .classed('log', true);
  newLogSel.append('pre');

  newLogSel
    .merge(logSel)
    .select('pre')
    .text(getLogJSON);
}

function getLogJSON(log) {
  return JSON.stringify(log, null, 2);
}

module.exports = renderLogs;
