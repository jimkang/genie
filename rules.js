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

function aging(cell) {
  if (isNaN(cell.age)) {
    cell.age = 1;
  } else {
    cell.age += 1;
  }
  return {
    instigator: cell.id,
    sources: [cell.id],
    targets: [cell.id],
    event: 'aging',
    details: 'aged one step'
  };
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
    changeCellType(cell, 'person');
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

function metabolism(cell) {
  if (cell.living && !isNaN(cell.nutrition)) {
    cell.nutrition -= 1;
    return {
      instigator: cell.id,
      source: [cell.id],
      target: [cell.id],
      event: 'metabolize',
      details: 'Metabolized. Nutrition reduced to ' + cell.nutrition
    };
  }
}

function eating(cell, neighbors, changeCellType) {
  var nearbyFood = neighbors.filter(isFood);
  // TODO: Different food choosing mechanism?
  if (nearbyFood.length > 0) {
    var targetCell = nearbyFood[0];
    changeCellType(targetCell, 'empty');
    if (isNaN(cell.nutrition)) {
      // TODO: Could food have different kinds of nutritional value?
      cell.nutrition = 1;
    } else {
      cell.nutrition += 1;
    }
    return {
      instigator: cell.id,
      source: [cell.id],
      target: [targetCell.id],
      event: 'eat',
      details: 'Food eaten. nutrition increased to ' + cell.nutrition
    };
  }
}

function starvation(cell, neighbors, changeCellType) {
  if (cell.living && cell.nutrition < 1) {
    changeCellType(cell, 'empty');
    return {
      instigator: cell.id,
      source: [cell.id],
      target: [cell.id],
      event: 'death',
      details: 'starved'
    };
  }
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

function isFood(cell) {
  return cell.type === 'food';
}

module.exports = {
  solitude,
  overpopulation,
  populate,
  selfDestruct,
  poops,
  aging,
  eating,
  metabolism,
  starvation
};
