// var pluck = require('lodash.pluck');

function Decay({ lifeSpan }) {
  return decay;

  function decay(cell, neighbors, changeCellType) {
    if (cell.type !== 'empty' && !isNaN(cell.age) && cell.age > lifeSpan) {
      changeCellType(cell, 'empty');
      return {
        instigator: cell.id,
        source: [cell.id],
        target: [cell.id],
        event: 'death',
        details: 'decayed at age ' + cell.age
      };
    }
  }
}

module.exports = {
  Decay
};
