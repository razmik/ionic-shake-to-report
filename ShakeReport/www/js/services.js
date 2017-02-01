angular.module('starter.services', [])

  .factory('ScreenCapture', function ($q) {

    function capture(filename) {

      var deferred = $q.defer();

      if (window.navigator.screenshot) {
        window.navigator.screenshot.URI(function (error, res) {
          if (error) {
            deferred.reject('Error in screenshot: ' + error);
          } else {
            deferred.resolve(res);
          }
        }, 'jpg', 50, filename);
      } else {
        deferred.reject('window.navigator.screenshot not found.');
      }

      return deferred.promise;
    }

    return {
      capture: capture
    };
  })

  .factory('Email', function ($q) {

    function send(to, attachments, subject, bodyText, isHtml) {

      var deferred = $q.defer();

      if (window.plugin && window.plugin.email) {
        window.plugin.email.open({
          to: to, // email addresses for TO field
          attachments: attachments, // file paths or base64 data streams
          subject: subject, // subject of the email
          body: bodyText, // email body (for HTML, set isHtml to true)
          isHtml: isHtml, // indicats if the body is HTML or plain text
        }, success, this);
      } else {
        deferred.reject('window.plugin.email not found.');
      }

      function success(res) {
        deferred.resolve(res);
      }

      return deferred.promise;
    }

    return {
      send: send
    };
  })

  .factory('ShakeToReport', function ($q, Email, ScreenCapture) {

    var screenshot = '';
    var screenshotFileName = 'myScreenShot';

    function onShake() {

      ScreenCapture.capture(screenshotFileName).then(function (data) {
        screenshot = data.URI;

        var to = ['razmik89@gmail.com'];
        var attachments = screenshot.replace("data:image/jpeg;base64,", "base64:attachment.png//");
        var subject = 'Shake to Report - katzer';
        var bodyText = 'Look at this images!';

        Email.send(to, attachments, subject, bodyText, false)
          .then(function () {
            screenshot = '';
          })
          .catch(function (data) {
            alert(data);
          });

      }).catch(function (data) {
        alert(data);
      });

    }

    return {
      onShake: onShake
    };
  })

  .factory('Chats', function () {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
      id: 0,
      name: 'Ben Sparrow',
      lastText: 'You on your way?',
      face: 'img/ben.png'
    }, {
      id: 1,
      name: 'Max Lynx',
      lastText: 'Hey, it\'s me',
      face: 'img/max.png'
    }, {
      id: 2,
      name: 'Adam Bradleyson',
      lastText: 'I should buy a boat',
      face: 'img/adam.jpg'
    }, {
      id: 3,
      name: 'Perry Governor',
      lastText: 'Look at my mukluks!',
      face: 'img/perry.png'
    }, {
      id: 4,
      name: 'Mike Harrington',
      lastText: 'This is wicked good ice cream.',
      face: 'img/mike.png'
    }];

    return {
      all: function () {
        return chats;
      },
      remove: function (chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function (chatId) {
        for (var i = 0; i < chats.length; i++) {
          if (chats[i].id === parseInt(chatId)) {
            return chats[i];
          }
        }
        return null;
      }
    };
  });
