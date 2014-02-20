'use strict';

var Numbers = require('./numbers')
  , Gateways = require('./gateways')
  , Carriers = require('./carriers')
  , normalizeNumber = require('./normalize-number')
  , forEachAsync = require('foreachasync').forEachAsync
  , TelCarrier = require('tel-carrier')
  , telCarrier
  ;

telCarrier = TelCarrier.create({ service: 'tel-carrier-cache' });

function returnMany(numbers, cb) {
  var result = []
    ;

  forEachAsync(numbers, function (next, number) {
    // sometimes '+' becomes ' ' or '%20'
    var valNum = normalizeNumber(number) 
      ;

    if (!valNum) {
      next();
      return;
    }

    number = valNum;
    telCarrier.lookup(number, function (err, info) {
      if (info) {
        result.push(info);
      }
      next();
    });
  }).then(function () {
    cb(result);
  });
}

function route(app) {
  app.post('/analytics', function (request, response, next) {
    if (!Object.keys(request.body).length) { 
      next();
      return;
    }

    if (request.body.numbers) {
      Object.keys(request.body.numbers).forEach(function (number) {
        Numbers.update(number, request.body.numbers[number].carrier, request.body.numbers[number].wireless);
      });
    }

    if (request.body.carriers) {
      Object.keys(request.body.carriers).forEach(function (carrier) {
        Gateways.update(carrier, request.body.carriers[carrier].sms, request.body.carriers[carrier].mms);
      });
    }

    response.send({ success: true });
  });

  app.get('/gateways', function (request, response) {
    response.send(Gateways._data);
  });

  app.get('/carriers', function (request, response) {
    response.send(Carriers._data);
  });

  app.post('/carriers', function (request, response, next) {
    if (!Object.keys(request.body).length) { 
      next();
      return;
    }

    response.send(Carriers.update(request.body));
  });

  app.post('/lookup', function (request, response, next) {
    if (!Array.isArray(request.body.numbers)) {
      next();
      return;
    }

    returnMany(request.body.numbers, response.send.bind(response));
  });

  app.get('/lookup', function (request, response, next) {
    if (request.query.numbers) {
      returnMany(request.query.numbers.split(','), response.send.bind(response));
    } else if (request.query.number) {
      returnMany([request.query.number], function (arr) {
        response.send(arr[0] || null);
      });
    } else {
      next();
    }
  });
}

module.exports.route = route;
