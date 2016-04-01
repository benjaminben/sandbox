function makeSpace(){
  var space = document.createElement('div');
  space.setAttribute('id', 'space');
  space.style.backgroundImage = "url(http://www.jpost.com/HttpHandlers/ShowImage.ashx?ID=277701)";
  document.body.appendChild(space);
  return "IN SPACE."
}

function enterPlayers(p1, p2){
  return new Promise( function(resolve) {
    console.log("running")
    var p1Col = '<div id="p0Col" class="pCol">' + p1.name + '</div>';
    var p2Col = '<div id="p1Col" class="pCol">' + p2.name + '</div>';
    var pCols = p1Col + p2Col;
    $('#space').append(pCols);
    players.push(p1, p2);
    resolve(getProfPics(p1,p2));
  })
}

var players = [],
    ben = {name:"beners"},
    drake = {name:"champagnepapi"};

function getProfPic(player, index) {
  return Promise.resolve( $.ajax({
    method: "GET",
    url: "https://api.instagram.com/v1/users/search?q="+player.name+"&access_token=1578228172.467ede5.04a6ec58145743cc851a2d64b58d9627",
    dataType: "jsonp",
    jsonp: "callback",
    jsonpCallback: "jsonpcallback",
  }) ).then(
    function(data) {
      console.log(data.data[0]);
      player.id = data.data[0].id;
      $('#p'+index+'Col').append('<img src="'+data.data[0].profile_picture+'" />')
    }
  ).catch(
    function(err) {
      console.log(err)
    }
  )
}

function getProfPics(names) {
  return Promise.map(arguments, function(name, i){
    return getProfPic(name, i)
  }, {concurrency: 1})

}

function getInsta(player, index) {
  return Promise.resolve( $.ajax({
    method: "GET",
    url: "https://api.instagram.com/v1/users/"+player.id+"?access_token=1578228172.467ede5.04a6ec58145743cc851a2d64b58d9627",
    dataType: "jsonp",
    jsonpCallback: "jsonpcallback",
  }) ).then(
    function(data) {
      console.log(data);
      var followedBy = data.data.counts.followed_by;
      var follows = data.data.counts.follows;
      var ratio = followedBy / follows;
      $('#p'+index+'Col').append(
        '<div>followed by: '+followedBy+'</div>'
        + '<div>follows: '+follows+'</div>'
        + '<h1>RATIO: '+ratio+'</h1>')
    }
  ).catch(
    function(err) {
      console.log(err)
    }
  )
}

function getInstas(names) {
  return Promise.map(arguments, function(name, i) {
    return getInsta(name, i)
  }, {concurrency: 1})
}
