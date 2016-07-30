function makeVom(){
  if( !document.querySelector('div.vom-bucket') ){
    document.body.className = "vom";
    var input = document.createElement('div');
    input.className = "vom-bucket";
    input.setAttribute('contenteditable', true);
    document.body.appendChild(input);

    vom_init();
  }
};
function wipeVom(){
  if( document.querySelector('div.vom-bucket') ){
    $('div.vom-bucket').remove();
  }
}
function spreadVom(){
  if( document.querySelector('div.vom-bucket') ){
    socket.emit('spread_vom')
  }
}
function hideVom(){
  if( document.querySelector('div.vom-bucket') ){
    $('div.vom-bucket').hide()
  }
}

var vom = {}

// vom.freeze = function() {
//   var
// }

var vom_init = function(){
  var textarea = document.querySelector('div.vom-bucket');
  textarea.addEventListener("input", function(e){
    var char = textarea.innerHTML[textarea.innerHTML.length - 1];
    socket.emit('vom', {char : char, string : textarea.innerHTML});
  })

  socket.on('ship_vom', function(char){
    console.log(char)
    textarea.innerHTML += char;
  })
}

socket.on('host_in', function(){
  makeVom()
})
socket.on('enter_vom', function(){
  makeVom()
})
socket.on('host_dip', function(){
  wipeVom()
})
socket.on('vom_clients', function(strings){
  hideVom();
  strings.forEach(function(vom_string){
    var string = document.createElement('span');
    string.className = 'vom-string';
    string.innerHTML = vom_string;
    document.body.appendChild(string)
  })
})
