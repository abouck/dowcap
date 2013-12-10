// var socket = io.connect('http://localhost:8080');
//   socket.on('news', function (data) {
//     console.log(data);
//   });

$(function() {
    var socket = io.connect('http://localhost:8080');
    socket.on('news', function (data) {
      console.log(data);
    });
    socket.on('data', function(data) {
      $('#stocks').empty();
        for (var key in data) {
            var val = data[key];
              $('#stocks').append("<tr><td>" + key + "</td></tr>")
              $('#stocks').append("<tr><td>" + data[key]+ "</td></tr>")    
        } 
        $('#last-update').text(new Date().toTimeString());
    });
})