angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope, $ionicPopup, ScreenCapture, Email, AppDetails) {
    var vm = this;
    vm.screenshot = '';
    vm.screenshotFileName = 'myScreenShot';
    vm.capture = capture;
    vm.emailkatzer = emailkatzer;
    vm.showDetails = showDetails;

    function showDetails() {

      AppDetails.getAll()
        .then(function (data) {
          $ionicPopup.alert({
            title: 'App Data',
            template: 'App data as follows:\n' + JSON.stringify(data) 
          });
        })
        .catch(function (data) {
          alert('Error: ' + data);
        });
    }

    function emailkatzer() {

      var to = ['razmik89@gmail.com'];
      var attachments = vm.screenshot.replace("data:image/jpeg;base64,", "base64:attachment.png//");
      var subject = 'Shake to Report - katzer';
      var bodyText = 'Look at this images!';

      Email.send(to, attachments, subject, bodyText, false)
        .then(function () {
          vm.screenshot = '';
        })
        .catch(function (data) {
          alert(data);
        });
    }

    function capture() {

      ScreenCapture.capture(vm.screenshotFileName).then(function (data) {
        vm.screenshot = data.URI;
      }).catch(function (data) {
        alert(data);
      });
    }
  })

  .controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
