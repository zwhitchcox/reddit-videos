(function(angular) {
  'use strict';
var app = angular.module('app', ['ngResource']);

app.controller('Ctrl', ['$scope','$resource','$http', function($scope,$resource,$http) {
  function getJsonFromUrl(query) {
    var result = {};
    query.split("&").forEach(function(part) {
      var item = part.split("=");
      result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
  }
  $http.jsonp('http://www.reddit.com/r/music.json?limit=100&jsonp=JSON_CALLBACK&subreddit=jokes')
    .success(function(res) {
      $scope.vids = res.data.children.reduce(function(prev,cur) {
        if (/^https?:\/\/(www\.)?youtube/.test(cur.data.url)) {
          prev.push(getJsonFromUrl(cur.data.url.substr(30)).v)
          return prev
        } else {
          return prev
        }
      },[])
      $scope.play(0)
    })
  $scope.play = function() {
    var player;
    player = new YT.Player('player', {
      height: '390',
      width: '640',
      playerVars: { 'autoplay': 1, 'playlist':$scope.vids},
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    })

    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
      event.target.playVideo();
    }

    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
    var done = false;
    function onPlayerStateChange(event) {
      if (event.data == YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 6000);
        done = true;
      }
    }
    function stopVideo() {
      player.stopVideo();
    }
  }
}]);
})(window.angular);
