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
              $('#stocks').append("<tr><td class='symbol'>" + key + "</td></tr>")
              $('#stocks').append("<tr><td class='price'>" + data[key]+ "</td></tr>")    
        }
        $('.price').fadeOut(100).fadeIn(100) 
        $('#last-update').text(new Date().toTimeString());
    });
})