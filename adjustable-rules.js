// var pluck = require('lodash.pluck');

function Decay({ lifeSpan }) {
  return decay;

  function decay(cell, neighbors, changeCellType) {
    var log;
    if (cell.type !== 'empty' && !isNaN(cell.age) && cell.age > lifeSpan) {
      changeCellType(cell, 'empty');
      log = {
        instigator: cell.id,
        source: [cell.id],
        target: [cell.id],
        event: 'death',
        details: 'decayed at age ' + cell.age
      };
    }
    return log;
  }
}

module.exports = {
  Decay
};
