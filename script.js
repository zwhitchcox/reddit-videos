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
  $scope.getVids = function() {
    $http.jsonp('http://www.reddit.com/r/'+$scope.custsub+'.json?limit=100&jsonp=JSON_CALLBACK&subreddit=jokes')
      .success(function(res) {
        $scope.permalinks = []
        $scope.vids = res.data.children.reduce(function(prev,cur) {
          if (/^https?:\/\/(www\.)?youtube/.test(cur.data.url)) {
            var id = getJsonFromUrl(cur.data.url.substr(30)).v
            $scope.permalinks.push({title:cur.data.title,uri:cur.data.permalink})
            prev.push(id)
            return prev
          } else {
            return prev
          }
        },[])
        $scope.play(0)
      })
  }
  $scope.custsub = 'videos'
  $scope.getVids()

  $scope.play = function() {
    var player;
    player = new YT.Player('player', {
      height: '390',
      width: '640',
      playerVars: { 'autoplay': 0},
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    })

    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
      player.cuePlaylist($scope.vids)
      event.target.playVideo();
    }
    $scope.waiting = false
    function onPlayerStateChange(event) {
      if (player.getPlayerState()===0) {
        setTimeout(function(){player.playVideo()},3000)
      }
    }
    function addVidIdToStorage (id) {
      if (typeof(Storage) != "undefined") {
        if (localStorage.getItem("ids") === null) {
          localStorage.setItem("ids", '');
        } else {
          var ids = localStorage.getItem("ids")
          ids.push(id)
          localStorage.setItem("ids", ids)
        }
      }
    }
  }
}]);
})(window.angular);
