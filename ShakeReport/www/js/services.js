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

  .factory('AppDetails', function ($q) {

    var deferred = $q.defer();

    function getAll() {

      if (window.device && window.cordova) {
        window.cordova.getAppVersion.getVersionNumber(function (version) {
          deferred.resolve(composeData(version));
        });
      } else {
        deferred.reject('window.cordova not found.');
      }

      function composeData(version) {
        var navigator = window.navigator;
        return {
          browserVersion: navigator.appVersion,
          language: navigator.language,
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          cordova: window.device.cordova,
          model: window.device.model,
          platform: window.device.platform,
          deviceVersion: window.device.version,
          manufacturer: window.device.manufacturer,
          appVersion: version
        }
      }

      return deferred.promise;
    }

    return {
      getAll: getAll
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

  .factory('ShakeToReport', function ($q, Email, ScreenCapture, AppDetails) {

    var screenshot = '';
    var screenshotFileName = 'myScreenShot';

    function onShake() {

      ScreenCapture.capture(screenshotFileName).then(function (data) {

        screenshot = data.URI;
        var to = ['razmik89@gmail.com'];
        var attachments = screenshot.replace("data:image/jpeg;base64,", "base64:attachment.png//");
        var subject = 'Shake to Report - katzer';
        var bodyText = '';

        AppDetails.getAll()
          .then(function (data) {

            bodyText = 'Dear Customer Service, \n\n' +
              'I would like to report an issue with Approve.ly. My device details are: \n\n' +
              'Approve.ly Version: ' + data.appVersion + '\n' +
              'Location: ' + JSON.stringify(window.location) + '\n' +
              'Platform: ' + data.platform + '\n' +
              'Model: ' + data.model + '\n' +
              'Device Version: ' + data.deviceVersion + '\n' +
              'Manufacturer: ' + data.manufacturer + '\n' +
              'Cordova version: ' + data.cordova + '\n' +
              'User Agent: ' + data.userAgent + '\n' +
              'Language: ' + data.language + '\n\n';

            Email.send(to, attachments, subject, bodyText, false)
              .then(function () {
                screenshot = '';
              })
              .catch(function (data) {
                alert(data);
              });

          })
          .catch(function (data) {
            alert('Error: ' + data);
          });

      }).catch(function (data) {
        alert(data);
      });

    }

    return {
      onShake: onShake
    };
  })



  .factory('ShakeToReportRefactored', function ($q, Email, ScreenCapture, AppDetails) {

    var loadScreenshot = function (filename) {
      return ScreenCapture
        .capture(filename)
        .then(function (data) {
          return data.URI;
        })
    },
      loadAppDetails = function (screenshotURI) {
        return AppDetails
          .getAll()
          .then(function (data) {
            return { appData: data, screenshotURI: screenshotURI };
          })
      },
      loadEmail = function (data) {
        var to = ['razmik89@gmail.com'];
        var attachments = data.screenshotURI.replace("data:image/jpeg;base64,", "base64:attachment.png//");
        var subject = 'Shake to Report Refactored - katzer';
        var bodyText = materialize(data.appData);

        return Email
          .send(to, attachments, subject, bodyText, false);
      },
      materialize = function (data) {
        return 'Dear Customer Service, \n\n' +
          'I would like to report an issue with Approve.ly. My device details are: \n\n' +
          'Approve.ly Version: ' + data.appVersion + '\n' +
          'Location: ' + JSON.stringify(window.location) + '\n' +
          'Platform: ' + data.platform + '\n' +
          'Model: ' + data.model + '\n' +
          'Device Version: ' + data.deviceVersion + '\n' +
          'Manufacturer: ' + data.manufacturer + '\n' +
          'Cordova version: ' + data.cordova + '\n' +
          'User Agent: ' + data.userAgent + '\n' +
          'Language: ' + data.language + '\n\n';
      }

    function onShake() {

      loadScreenshot('myScreenShot').then(loadAppDetails).then(loadEmail).catch(function (err) { alert('Error: ' + err) });

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
