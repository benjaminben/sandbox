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
    var p1Col = '<div id="p0Col" class="pCol"><h2>' + p1.name + '</h2></div>';
    var p2Col = '<div id="p1Col" class="pCol"><h2>' + p2.name + '</h2></div>';
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
      $('#p'+index+'Col').append('<div id="p'+index+'Data" class="pData"><img src="'+data.data[0].profile_picture+'" /></div>')
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
    jsonpCallback: "jsonpcallback"
  }) ).then(
    function(data) {
      console.log(data);
      var followedBy = data.data.counts.followed_by;
      var follows = data.data.counts.follows;
      var ratio = (followedBy / follows).toFixed(4);
      $('#p'+index+'Data').append(
        '<div>followed by: '+followedBy+'</div>'
        + '<div>follows: '+follows+'</div>'
        + '<h1>RATIO: '+ratio+'</h1>'
        + '<div class="emoji">'+(ratio < 5 ? '🤓' : '😎')+'</div>')
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

function getMedia(player, index) {
  return Promise.resolve( $.ajax({
    method: "GET",
    url: "https://api.instagram.com/v1/users/"+player.id+"/media/recent?access_token=1578228172.467ede5.04a6ec58145743cc851a2d64b58d9627",
    dataType: "jsonp",
    jsonpCallback: "jsonpcallback"
  }) ).then(
    function(data) {
      console.log(data);
      clear(index);
      $('#p'+index+'Data').append(
        '<img src="'+data.data[0].images.standard_resolution.url+'" />'
        + '<div>'+data.data[0].caption.text+'</div>'
        + '<div>Likes: '+data.data[0].likes.count+'</div>'
        + '<div>Filter: '+data.data[0].filter+'</div>');
      player.instas = data.data.map(function(data) {
        return {
          url: data.images.standard_resolution.url,
          caption: data.caption.text,
          comments: data.comments.data,
          filter: data.filter,
          likes: data.likes.count,
          tags: data.tags
        };
      })
    }
  ).catch(
    function(err) {
      console.log(err)
    }
  )
}

function getMedias(names) {
  return Promise.map(arguments, function(name, i) {
    return getMedia(name, i)
  }, {concurrency: 1})
}

// function getLiked(player, index) {
//   return Promise.resolve( $.ajax({
//     method: "GET",
//     url: "https://api.instagram.com/v1/users/"+player.id+"/media/liked?access_token=1578228172.467ede5.04a6ec58145743cc851a2d64b58d9627",
//     dataType: "jsonp",
//     jsonpCallback: "jsonpcallback"
//   }) ).then(
//     function(data) {
//       console.log(data)
//     }
//   ).catch(
//     function(err) {
//       console.log(err)
//     }
//   )
// }

// function getLikes(names) {
//   return Promise.map(arguments, function(name, i) {
//     return getLiked(name, i)
//   }, {concurrency: 1})
// }

function clear(index) {
  $('#p'+index+'Data').html('')
}

// function convertUNIXtime(time){
//  var date = new Date(time * 1000);
//  var hours = date.getHours();
//  var minutes = '0' + date.getMinutes();
//  var seconds = '0' + date.getSeconds();

//  return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
// }
