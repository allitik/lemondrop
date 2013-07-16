  /*global $:true, _:true, console:true, window:true, forge:true, Popcorn:true, document:true */

// starts the log that would appear in the console in Chrome
(function (){
  'use strict';

  var logger = function(msg) {
    return console ? console.log(msg) : forge.logging.info(msg);
  };

  // placeholder to put the app in
  var App = {};

  // a way to declare selectors for jquery. # means ID and the . is a class
  // an object so we can just declare things once

  App.selectors = {
    practiceVideo: "#practice-video",
    prevPracticeVideo: ".prev-practice-video-btn",
    nextPracticeVideo: ".next-practice-video-btn",
    recordVideo: ".record-video-btn"
  };


// an object to store video data it has a array of other objects 
// we can add more objects to these arrays. 
// the Ids come from the youtube videos on Angels inokon@gmail.com
  App.data = {
    practiceVideoIds: [
      { id: "33Wddsu_K3U", title: "ZombieMarch" },
      { id: "RLPO7ZGdZVY", title: "ShoulderStep" },
      { id: "GOihsQCQ8pc", title: "BootyBounce" },
      { id: "fdeuR7eYfX4", title: "Swim Together" },
      { id: "UWVaUIS_gNQ", title: "ShuffleStare" },
      { id: "742vxSkNDys", title: "Down Ha" },
      { id: "1zIbbWP83Fw", title: "DownCLap" },
//      { id: "BndIaxliI7s", title: "IV.1. HipRoar" },
      { id: "iSItFmz55Es", title: "WalkRoar" },
      { id: "sZxldn2X5x8", title: "JumpCircle" },
      { id: "eUH1SaU5jtQ", title: "Stomp" },
      { id: "Ve4YHJpqYMM", title: "WuzUp" },
      { id: "fpHOePRzg8M", title: "Oh Snap" },
      { id: "mv3lKKidNPk", title: "AirGuitarRock" },
      { id: "7-bhEN9uv84", title: "GrabPullPunchDown" },
      { id: "EaecWwRm34k", title: "HoldShoulderKneesToes" },
//      { id: "EZRWVqSAsRg", title: "VIII.2. HoldPoint Pose" },
//      { id: "WZ5BiFplvU0", title: "VII.3. CrossStar" },
//      { id: "BSWFIezhrdU", title: "VII.4. Thrilla" },
      { id: "HykVfQkZ_WE", title: "Stomp2down" },
      { id: "MKxwQgqrX0Y", title: "Full Dance" }
    ]
  };

  App.shakeEventDidOccur = function shakeEventDidOccur() {
    logger('shake');
  };


  App.launchCamera = function launchCamera() {

    //
    var options = {
      "source": "camera"
    };

// When a picture is taken succesfully what do you want to do.
    var success = function success(file) {
      // Once its succesful you get a file parameter which gives you the path
      // to the file
      var displayImageEl = $("#faces"),
        filePath = file.uri,
        width = 120;

      logger('success');
      logger(file);

      displayImageEl.addClass("added-faces");
      displayImageEl.append('<img alt="camera" width="' + width + '" src="' + filePath + '" />');
    };

    var error = function error(content) {
      logger('error');
      logger(content);
    };

    logger('launch camera');

    // This line executes the camera based on https://trigger.io/docs/current/api/modules/file.html
    forge.file.getImage(options, success, error);
  };

  App.launchVideo = function launchCamera() {
    var options = {
      "source": "camera"
    };

    var success = function success(file) {
      var filePath = file.uri;

      logger('success');
      logger(file);
    };

    var error = function error(content) {
      logger('error');
      logger(content);
    };

    logger('launch video');
    forge.file.getVideo(options, success, error);
  };

  App.practicePage = {
    el: "#practice",
    titleSel: "#practice .title",
    currentVideoId: 0,
    videos: App.data.practiceVideoIds,

    isPage: function(pageEl) {
      return pageEl.attr("id") === "practice";
    },

    randomVideo: function() {
      this.currentVideoId = Math.round(Math.random() * this.videos.length);
      this.showVideo();
    },

    prevVideo: function() {
      this.currentVideoId = (this.currentVideoId === 0) ? (this.videos.length - 1) : this.currentVideoId - 1; // Loop when we get to the start
      this.showVideo();
    },

    nextVideo: function() {
      this.currentVideoId = (this.currentVideoId + 1) % this.videos.length; // Loop when we get to the end
      this.showVideo();
    },

    showVideo: function() {
      logger(this.currentVideoId + "/" + this.videos.length);

      var videoId = this.videos[this.currentVideoId].id,
        videoTitle = this.videos[this.currentVideoId].title,
        videoSel = App.selectors.practiceVideo,
        titleSel = this.titleSel;

      this.cleanup();
      var video = '<iframe width="350" height="263" type="text/html" src="http://www.youtube.com/embed/' + videoId + '?autoplay=1&loop=1&modestbranding=1&rel=0&controls=0&playlist=' + videoId + '" frameborder="0" allowfullscreen></iframe>';
      $(videoSel).prepend(video);
      $(titleSel).text(videoTitle);
    },

    swipeLeftHandler: function() {
      logger('swipe left');
      App.practicePage.nextVideo();
    },

    swipeRightHandler: function() {
      logger('swipe right');
      App.practicePage.prevVideo();
    },

    shakeEventDidOccur: function() {
      logger('shake');
      App.practicePage.randomVideo();
    },

    cleanup: function() {
      var videoSel = App.selectors.practiceVideo;
      $(videoSel).empty();

      // Not working?
      window.removeEventListener('shake', App.shakeEventDidOccur, false);
    },

    init: function() {
      var self = this;
      this.showVideo();

      $(App.selectors.prevPracticeVideo).click(function() {
        self.prevVideo();
      });

      $(App.selectors.nextPracticeVideo).click(function() {
        self.nextVideo();
      });

      $(App.selectors.recordVideo).click(function() {
        App.launchVideo();
      });

      $(self.el).on('swipeleft', this.swipeLeftHandler);
      $(self.el).on('swiperight', this.swipeRightHandler);

      window.addEventListener('shake', this.shakeEventDidOccur, false);
    }
  };

  App.updatesPage = {
    el: "#updates",
    contentEl: "#feed",

    isPage: function(pageEl) {
      return pageEl.attr("id") === "updates";
    },

    yqlPrefix: 'http://query.yahooapis.com/v1/public/yql?format=json&q=',

    // yql: "select * from flickr.photos.info where photo_id in (select id from flickr.photos.search where text='thriller' and api_key='d07dc54a9863b1e8e369ac695c5331b9') and api_key='d07dc54a9863b1e8e369ac695c5331b9'",

    // yql: "select * from flickr.photos.info where photo_id in (select id from flickr.photos.search where tags='thriller' and api_key='d07dc54a9863b1e8e369ac695c5331b9') and api_key='d07dc54a9863b1e8e369ac695c5331b9'",

    yql: "select * from flickr.photos.info where photo_id in (select id from flickr.photos.search where tags='ttw2013' and api_key='d07dc54a9863b1e8e369ac695c5331b9') and api_key='d07dc54a9863b1e8e369ac695c5331b9'",

    yqlUrl: function() {
      return this.yqlPrefix + this.yql;
    },

    photoUrl: function(photo) {
      return "http://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_s.jpg";
    },

    photoHtml: function(photo) {
      var width = 75,
        html = '<img alt="camera" width="' + width + '" src="' + this.photoUrl(photo) + '" />';

      return html;
    },

    photosHtml: function(photosArray) {
      var self = this,
        html = "";

      if (photosArray.length > 0) {
        var template = _.template("<li class='ui-button'><a target='_blank' href='<%= link %>'><%= avatarHtml %><h3><%= title %></h3></a>");

        html = "<ul data-role='listview'>";
        _.each(photosArray, function(photo) {
          html += template({
            link: photo.urls.url.content,
            avatarHtml: self.photoHtml(photo),
            title: photo.title
          });
        });
        html += "</ul>";
      }

      return html;
    },

    cleanup: function() {
      var self = this;
      $(self.contentEl).empty();
    },

    init: function() {
      var self = this;

      $.ajax({
        type: 'GET',
        url: this.yqlUrl(),
        dataType: 'json',
        success: function(data) {
          var photos = data.query.results.photo,
            html = self.photosHtml(photos);
          $(self.contentEl).prepend(html);

          // Trigger create so that jquery mobile updates styles
          $(self.contentEl).trigger("create");
        }
      });
    }
  };

//

  App.init = function init() {

    //jquery function to register clicks. we register the camera button here.
    $(".camera-btn").click(function(event) {
      event.preventDefault();
      App.launchCamera();
    });

    var logStateChangeErr = function (msg) { console.log('connection change ',msg);};
    var logStateChange = function () { console.log('conn chnge');};
    
    // all the trigger.io stuff is done on this forge object
    // camera stuff
    //Commenting out to get to work on the web

    //  forge.event.connectionStateChange.addListener(logStateChange, logStateChangeErr);
  

    $("body").on("pagechange", function(event, data) {
      var toPage = data.toPage,
        practicePage = App.practicePage,
        updatesPage = App.updatesPage;

      if (practicePage.isPage(toPage)) {
        practicePage.init();
      } else {
        practicePage.cleanup();
      }

      if (updatesPage.isPage(toPage)) {
        updatesPage.init();
      } else {
        updatesPage.cleanup();
      }
    });
  };

  //the code starts here; it gets run after the page is loaded
  //anything with a $ sign is a jquery call

  $(function() {
    App.init();

    // Put App in global namespace (for debugging);
    // means you can access it in the console  because it is a global variable
    window.App = App;
  });
})();