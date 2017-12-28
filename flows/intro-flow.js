var renderIntro = require('../dom/render-intro');

function introFlow({ routeState, skipIntro }) {
  renderIntro({ skipIntro, onStart });

  function onStart() {
    routeState.addToRoute({ skipIntro: 'yes' });
  }
}

module.exports = introFlow;
