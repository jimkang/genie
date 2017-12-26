var d3 = require('d3-selection');
var accessor = require('accessor')();
var Zoom = require('d3-zoom');
var cellsRoot = d3.select('#cells-root');

(function setUpZoom() {
  var board = d3.select('#board');
  var zoomLayer = board.select('#board .zoom-layer');
  var zoom = Zoom.zoom()
    .scaleExtent([0.1, 4])
    .on('zoom', zoomed);

  board.call(zoom);

  function zoomed() {
    zoomLayer.attr('transform', d3.event.transform);
  }
})();

var Crown = require('csscrown');

var crown = Crown({
  crownClass: 'instigator'
});

// var colorsForTypes = {
//   populated: '#0cbb5c',
//   poo: 'brown'
// };

var symbolsForTypes = {
  person: '🚶',
  poo: '💩',
  meat: '🍖',
  plant: '🌿'
};

const cellSize = 100;

function renderCells({ cells, instigatorId, sourceIds, targetIds }) {
  var cellSel = cellsRoot.selectAll('.cell').data(cells, accessor());
  cellSel.exit().remove();

  var newCellSel = cellSel
    .enter()
    .append('g')
    .classed('cell', true)
    .attr('id', accessor())
    .attr('transform', getCellTransform);

  newCellSel
    .append('text')
    .classed('symbol', true)
    .attr('alignment-baseline', 'middle')
    .attr('x', cellSize / 2)
    .attr('y', cellSize / 2)
    .attr('dy', cellSize / 10); // Fudging it.
  newCellSel
    .append('rect')
    .attr('width', cellSize)
    .attr('height', cellSize)
    .classed('frame', true);

  var updateSel = newCellSel.merge(cellSel);
  updateSel
    .select('.symbol')
    .attr('visibility', getCellVisibility)
    .text(getCellText);
  updateSel
    .select('.frame')
    .classed('target', cellIsTarget)
    .classed('source', cellIsSource);

  if (instigatorId) {
    crown(document.getElementById(instigatorId));
  }

  function cellIsTarget(cell) {
    return targetIds && targetIds.indexOf(cell.id) !== -1;
  }

  function cellIsSource(cell) {
    return sourceIds && sourceIds.indexOf(cell.id) !== -1;
  }
}

function getCellVisibility(cell) {
  return cell.type === 'empty' ? 'hidden' : 'visibility';
}

function getCellTransform(cell) {
  return `translate(${cell.col * cellSize}, ${cell.row * cellSize})`;
}

// function getCircleColor(cell) {
//   return colorsForTypes[cell.type];
// }

function getCellText(cell) {
  return symbolsForTypes[cell.type];
}

module.exports = renderCells;
