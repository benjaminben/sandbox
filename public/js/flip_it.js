var flippie = 'Hello World My Name Is Ben Last Night There Was Fire Tommorrow Quakes With A Chance Of Rain Names Become Grain Pain Becomes Lame',
    cont  = document.getElementById('cont');
(function flip_it(){
  var arr = flippie.split(' ');
  for( var i = 0; i < arr.length; i++ ){
    if(arr[i].flipped){ return; }
    arr[1].flipped = true;
    var word = arr.splice(1, 1);
    word.flipped = true;
    arr.splice(Math.round(Math.random() * arr.length), 0, word[0]);
    // arr.splice(Math.round(Math.random() * arr.length), arr.splice(i, i+1));
    // arr.splice(Math.random() * arr.length, 1, arr[i]);
  }
  document.body.style.backgroundColor = 'rgba('+Math.round(Math.random()*255)+','+Math.round(Math.random()*255)+','+Math.round(Math.random()*255)+','+Math.round(Math.random()*255)+')';
  cont.innerHTML = arr.join(' ');
  piece = cont.innerHTML;
  flippie.flipIt = setTimeout(flip_it, 10000);
})();
