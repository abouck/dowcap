
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
// var phantom = require('node-phantom');
var phantom = require('phantom');
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
phantom.create(function(ph) {
  ph.createPage(function(page) {

    page.open("https://accounts.google.com/Login", function(status) {
      page.onConsoleMessage = function (msg){
      console.log(msg);
      };
      console.log("opened site?", status);
        page.evaluate(function() {
         console.log('login started')
         console.log(document.getElementById('gaia_loginform'))
          document.getElementById('Email').value = ''
          console.log(document.getElementById('Email').value)
          document.getElementById('Passwd').value = ''
          console.log(document.getElementById('Passwd').value)
          document.getElementById('gaia_loginform').submit()
          console.log('submitting...')
          return document.getElementById('Email').value;
        }, function(result) {
            console.log(result);
            });  
      
    });

    setTimeout(function(){
      console.log("fetching index")
      page.open("https://www.google.com/finance/portfolio?action=view&pid=1&ei=E1WnUpjZM6WYiQKD2QE", function(status) {
        console.log("opened site?", status); 
          setInterval(function() {
            // page.render('googfinance.png')
            page.evaluate(function() {

              var stocksObj = {};
              var nodeList = document.querySelectorAll(".gf-table tbody tr .pf-table-s"),
              nodeArray = [].slice.call(nodeList);
               nodeArray.forEach(function(x){
                 stocksObj[x.innerText] = x.nextSibling.innerText
               })

              return stocksObj
            }, function(result) {
              console.log(result);
              //Send to all the clients
              io.sockets.emit('data', result);
             //   ph.exit();
            });
          }, 10000);
        });
    }, 5000);
  });
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
