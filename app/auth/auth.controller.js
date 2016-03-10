angular.module('angularfireSlackApp')
  .controller('AuthCtrl', function(Auth, $state) {
    var authCtrl = this;

    authCtrl.user = {
      email: '',
      password: ''
    };

    // send user to home state if authentication is successful, else send error to controller
    authCtrl.login = function() {
      Auth.$authWithPassword(authCtrl.user).then(function(auth) {
        $state.go('home');
      }, function(error) {
        authCtrl.error = error;
      });
    };

    // call login if createUser succeeds, else send error to controller
    authCtrl.register = function() {
      Auth.$createUser(authCtrl.user).then(function(user) {
        authCtrl.login();
      }, function(error) {
        authCtrl.error = error;
      });
    };
  });
