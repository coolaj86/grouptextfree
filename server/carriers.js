'use strict';

var Carriers = {}
  , saveThing = require('./save-thing')
  , path = require('path')
  ;

Carriers._data = require('./carriersdb.json');
Carriers._map = {};
Carriers._data.forEach(function (c) {
  Carriers._map[c.carrierComment] = c;
});
Carriers._save = function () {
  saveThing(path.join(__dirname, 'carriersdb.json'), Carriers._data);
};
Carriers.update = function (body) {
  if (!body.carrierComment || Carriers._map[body.carrierComment]) {
    return null;
  }

  var c = {}
    ;

  c.carrier = body.carrier;
  c.carrierComment = body.carrierComment;
  c.typeComment = body.typeComment;
  c.wireless = body.wireless;
  c.smsGateway = body.smsGateway;
  c.mmsGateway = body.mmsGateway;

  Carriers._data.push(c);
  Carriers._map[c.carrierComment] = c;
  Carriers._save();

  return c;
};

module.exports = Carriers;
