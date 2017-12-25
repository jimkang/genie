var d3 = require('d3-selection');
var accessor = require('accessor')();

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

var cellsRoot = d3.select('#cells-root');

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
