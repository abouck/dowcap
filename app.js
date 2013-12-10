
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var phantom = require('node-phantom');
var server = require('http').createServer(app)

var app = express();

var io = require('socket.io').listen(server);

server.listen(8080)

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);


io.sockets.on('connection', function (socket) {
    socket.emit('news', { message: 'welcome to the chat' });
});
// Get some stocks
phantom.create(function(err,ph) {
  return ph.createPage(function(err,page) {
    return page.open("http://www.marketwatch.com/investing/index/djia", function(err,status) {
       console.log("opened site? ", status);
      page.injectJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function(err) {
       
        setInterval(function() {
          return page.evaluate(function() {
           
            var stocksArr = [],
            stocksObj = {};
            $('#indexComponents .quotelist-symb a').each(function() {

              stocksObj[$(this).text()] = $(this).parent().next().text();
            });

            return stocksObj
          }, function(err,result) {
            console.log(result);
            //Send to all the clients
           io.sockets.emit('data', result);
          //    ph.exit();
          });
        }, 10000);
      });
    });
  });
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
