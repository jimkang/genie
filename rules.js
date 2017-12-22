var pluck = require('lodash.pluck');

function solitude(cell, neighbors, changeCellType) {
  var log;
  var populatedNeighbors = neighbors.filter(takesSpace);
  if (populatedNeighbors.length < 2) {
    changeCellType(cell, 'empty');
    log = {
      instigator: cell.id,
      source: [cell.id],
      target: [cell.id],
      event: 'death',
      details: 'too lonely'
    };
  }
  return log;
}

function overpopulation(cell, neighbors, changeCellType) {
  var log;
  var populatedNeighbors = neighbors.filter(takesSpace);
  if (populatedNeighbors.length >= 4) {
    changeCellType(cell, 'empty');
    log = {
      instigator: cell.id,
      sources: [pluck(populatedNeighbors, 'id')],
      targets: [cell.id],
      event: 'death',
      details: 'too crowded'
    };
  }
  return log;
}

function populate(cell, neighbors, changeCellType) {
  var log;
  var livingNeighbors = neighbors.filter(isAlive);
  if (livingNeighbors.length >= 3) {
    changeCellType(cell, 'populated');
    log = {
      instigator: cell.id,
      sources: [pluck(livingNeighbors, 'id')],
      targets: [cell.id],
      event: 'birth',
      details: 'neighbors got together'
    };
  }
  return log;
}

function selfDestruct(cell, neighbors, changeCellType) {
  var log;
  changeCellType(cell, 'empty');
  log = {
    instigator: cell.id,
    source: [cell.id],
    target: [cell.id],
    event: 'death',
    details: 'unconditional decay'
  };
  return log;
}

function poops(cell, neighbors, changeCellType) {
  var log;
  var unpopulatedNeighbors = neighbors.filter(doesNotTakeSpace);
  if (unpopulatedNeighbors.length > 0) {
    // TODO: Pick from neighbors at random.
    var targetCell = unpopulatedNeighbors[0];
    changeCellType(targetCell, 'poo');
    log = {
      instigator: cell.id,
      sources: [cell.id],
      targets: [targetCell.id],
      event: 'poop',
      details: 'pooped'
    };
  }
  return log;
}

function takesSpace(cell) {
  return cell.takesSpace;
}

function isAlive(cell) {
  return cell.living;
}

function doesNotTakeSpace(cell) {
  return !cell.takesSpace;
}

module.exports = {
  solitude,
  overpopulation,
  populate,
  selfDestruct,
  poops
};
