(function () {
  "use strict";

  var connect = require('connect')
    , mailRoute = require('./mail-route').route
    , telRoute = require('./tel-carrier-route').route
    , path = require('path')
    , server
    ;


  if (!connect.router) {
    connect.router = require('connect_router');
  }



  server = connect.createServer()
    //.use(connect.compress())
    .use(connect.static(path.join(__dirname, 'public')))
    .use(connect.json())
    .use(connect.query())
    .use(function (request, response, next) {
        if (response.send) {
          next();
          return;
        }

        response.send = function (data) {
          response.setHeader('Content-Type', 'application/json');
          response.write(JSON.stringify(data, null, '  '));
          response.end();
        };
        next();
      })
    ;

  server.use(connect.router(telRoute));
  server.use(connect.router(mailRoute));

  module.exports = server;

  function run() {
    var address
      ;

    address = server.listen(process.argv[2] || 3010, function () {
      console.log('Listening', address);
    }).address();
  }

  if (require.main === module) {
    run();
  }
}());
