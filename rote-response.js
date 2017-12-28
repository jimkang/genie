function RoteResponse({ url, transformBody, done }) {
  return roteResponse;

  function roteResponse(error, httpResponse, body) {
    if (error) {
      done(error);
    } else if (!body) {
      done(new Error('Empty body received from: ' + url));
    } else if (httpResponse.statusCode < 200 || httpResponse.statusCode > 299) {
      done(
        new Error(
          'statusCode ' + httpResponse.statusCode + ' received from: ' + url
        )
      );
    } else {
      done(null, transformBody ? transformBody(body) : body);
    }
  }
}

module.exports = RoteResponse;
