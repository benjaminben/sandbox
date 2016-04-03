function makeSpace(){
  var space = document.createElement('div');
  space.setAttribute('id', 'space');
  space.style.backgroundImage = "url(http://www.jpost.com/HttpHandlers/ShowImage.ashx?ID=277701)";
  document.body.appendChild(space);
  return "IN SPACE."
}

function enterPlayers() {

}

function enterGrams(players){

  var grams = [];

  var playerCols = []
  return Promise.each(arguments, function(player, i) {
    var playerCol = '<div id="'+player.username+'" class="pCol"><h2>' + player.username + '</h2></div>';
    playerCols.push(playerCol);
    grams.push(player);
    return playerCols;
  }).then(function(cols) {

        console.log(grams)
        pCols = playerCols.join('');
        console.log(pCols)
        var block = '<div id="gramBox" class="flex">' + pCols + '</div>';
        console.log(block);
        $('body').append(block);
    }).then(
    function() {
      getProfPics.apply(this, grams);
    }
  );

  // return new Promise( function(resolve) {
  //   var playerCol = '<div id="'+player+'" class="pCol"><h2>' + p1.username + '</h2></div>';
  //   var p2Col = '<div id="p1Col" class="pCol"><h2>' + p2.username + '</h2></div>';
  //   var pCols = p1Col + p2Col;
  //   var block = '<div id="gramBox" class="flex">' + pCols + '</div>';
  //   $('body').append(block);
  //   resolve(getProfPics(p1,p2));
  // })
}

function Gram(username) {
  this.username = username
}

// var ben = new Player("beners");
// var drake = new Player("champagnepapi");
// var radha = new Player("radha.v");

function getProfPic(player, index) {
  return Promise.resolve( $.ajax({
    method: "GET",
    url: "https://api.instagram.com/v1/users/search?q="+player.username+"&access_token=1578228172.467ede5.04a6ec58145743cc851a2d64b58d9627",
    dataType: "jsonp",
    jsonp: "callback",
    jsonpCallback: "jsonpcallback",
  }) ).then(
    function(data) {
      player.id = data.data[0].id;
      console.log(data.data[0].profile_picture)
      console.log("appending to", $('#'+player.username))
      $('#'+player.username).append('<div id="'+player.username+'Data" class="pData"><img class="profPic" src="'+data.data[0].profile_picture+'" /></div>')
      console.log("just appended pic of ", player.username)
    }
  ).catch(
    function(err) {
      console.log(err);
      // throw err
    }
  )
}

function getProfPics(players) {
  return Promise.each(arguments, function(player, i){
    // console.log(player)
    return getProfPic(player, i)
  })

}

function getInsta(player, index) {
  return Promise.resolve( $.ajax({
    method: "GET",
    url: "https://api.instagram.com/v1/users/"+player.id+"?access_token=1578228172.467ede5.04a6ec58145743cc851a2d64b58d9627",
    dataType: "jsonp",
    jsonpCallback: "jsonpcallback"
  }) ).then(
    function(data) {
      var followedBy = data.data.counts.followed_by;
      var follows = data.data.counts.follows;
      var ratio = (followedBy / follows).toFixed(4);
      $('#p'+index+'Data').append(
        '<div>followed by: '+followedBy+'</div>'
        + '<div>follows: '+follows+'</div>'
        + '<h1>RATIO: '+ratio+'</h1>'
        + '<div class="emoji">'+(ratio < 0.85 ? '🤓' : '😎')+'</div>')
    }
  ).catch(
    function(err) {
      console.log("YOU ****ING ****FACE: ", err)
    }
  )
}

function getInstas(names) {
  return Promise.map(arguments, function(name, i) {
    return getInsta(name, i)
  }, {concurrency: 1})
}

function getMedia(player, index, maxPages, url) {

  url = url || "https://api.instagram.com/v1/users/"+player.id+"/media/recent?access_token=1578228172.467ede5.04a6ec58145743cc851a2d64b58d9627&count=40";

  return Promise.resolve( $.ajax({
    method: "GET",
    url: url,
    dataType: "jsonp",
    jsonpCallback: "jsonpcallback"
  }) ).then(
    function(data) {


      if(player.instas.length == 0)
      {
        clear(index);
        $('#p'+index+'Data').append(
        '<img src="'+data.data[0].images.standard_resolution.url+'" />'
        + '<div>'+(data.data[0].caption && data.data[0].caption.text || '')+'</div>'
        + '<div>Likes: '+(data.data[0].likes.count || 0)+'</div>'
        + '<div>Filter: '+(data.data[0].filter || '#nofilter')+'</div>');
      }

      var mappedData = data.data.map(function(data) {
        return {
          url: data.images.standard_resolution.url,
          caption: data.caption && data.caption.text || '',
          comments: data.comments.data,
          filter: data.filter || 'none',
          likes: data.likes.count || 0,
          tags: data.tags
        };
      });
      player.instas = player.instas.concat(mappedData);

      if(data.pagination && data.pagination.next_url && --maxPages > 0)
      {
        return getMedia(player, index, maxPages, data.pagination.next_url);
      }

    }
  ).catch(
    function(err) {
      console.log(err);
      throw err;
    }
  )
}

function getMedias(players) {
  return Promise.each(arguments, function(player, i) {
    player.instas = [];
    return getMedia(player, i, 10).then(
      function(){
        player.totalLikes = 0;
        player.instas.forEach(function(insta){
          player.totalLikes += insta.likes;
        })
      }
    )
  })
}

function clearGramData(gram) {
  $(gram.username+'Data').remove()
}

function clearAllGramData() {
  $('.pData').remove()
}

function clearPlayer(name) {
  $('#'+name).remove()
}

function clearAllPlayers() {
  $('.pCol').remove()
}


function displayLikes(players) {
  return Promise.each(arguments, (function(player, i) {
    var pData = $('#p'+i+'Data');
    var pDataWidth = pData.width();

    for ( var l = 0; l < player.totalLikes; l++ ) {
      pData.append('<img class="absolute" src="http://icons.iconarchive.com/icons/designbolts/free-valentine-heart/16/Heart-icon.png" style="width:10px; height:10px; top:'+(Math.random()*pDataWidth)+'px; left:'+(Math.random()*pDataWidth)+'px"/>')
    }
  }) )
}

function removeLikes() {
  $('img.absolute').remove()
}

function switchLikes() {
  $('img.absolute').each(function(i, like) {
    if ($(like).parent('#p0Col')) {
      $(like).css("left", "-=100" );
    } else {
      $(like).css("left", "+=100" )
    }
  })
}

// IS THIS PROMISE NECESSARY??

function firstBabies(babies) {
  clearBoth();
  return Promise.each(arguments, (function(baby, i) {
    $('#p'+i+'Data').append(
      '<img src="'+baby.instas[baby.instas.length - 1].url+'" />'
      + '<div>'+baby.instas[baby.instas.length - 1].caption+'</div>'
      + '<div>Likes: '+baby.instas[baby.instas.length - 1].likes+'</div>'
      + '<div>Filter: '+baby.instas[baby.instas.length - 1].filter+'</div>');
  }))
}

var spitFacts = {
  gramRatio: "the average follow:follower ratio is 1:1.17",
  instaLikes: function() {
    return(texts())
    function texts() {
      console.log('"LOVE" is the 14th most popular IG hashtag');
      setTimeout(function(){
       console.log('every 10 seconds, more than 100 "#love" photos are posted');
       setTimeout(makeLove(),10000)
      }, 10000);
      setTimeout(function(){
        console.log('the highest liked hashtag on IG: #like4like');
      }, 5000)
    }
  },
  fool: "LOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOL"
}

function makeLove() {
  $.ajax({
    method: "GET",
    url: "https://api.instagram.com/v1/tags/love/media/recent?access_token=1578228172.467ede5.04a6ec58145743cc851a2d64b58d9627",
    dataType: "jsonp",
    jsonp: "callback",
    jsonpCallback: "jsonpcallback",
    success: function(data) {
      $("body").append('<div id="loveBox" style="width:100%;height:100%;position:absolute;"></div>')
      data.data.forEach(function(data) {
        imgUrl = data.images.standard_resolution.url;
        $("<div class='imgBox'><img src=" + imgUrl + "></div>").hide().appendTo('#loveBox').fadeIn(1000);
      })
    },
    error: function(err) {
      console.log(err)
    }
  })
}

function noLove() {
  $('#loveBox').remove()
}

function blackHole() {
  $('body').html('')
}


function getPic(player, i) {
  return Promise.each(arguments, (function(baby, i) {
    $('#p'+i+'Data').append(
      '<img src="'+baby.instas[baby.instas.length - 1].url+'" />'
      + '<div>'+baby.instas[baby.instas.length - 1].caption+'</div>'
      + '<div>Likes: '+baby.instas[baby.instas.length - 1].likes+'</div>'
      + '<div>Filter: '+baby.instas[baby.instas.length - 1].filter+'</div>');
  }))
}
