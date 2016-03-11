'use strict';

/**
 * @ngdoc overview
 * @name angularfireSlackApp
 * @description
 * # angularfireSlackApp
 *
 * Main module of the application.
 */
angular
  .module('angularfireSlackApp', [
    'firebase',
    'angular-md5',
    'ui.router'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        resolve: {
          requireNoAuth: function($state, Auth) {
            return Auth.$requireAuth().then(function(auth) {
              $state.go('channels');
            }, function(error) {
              return;
            });
          }
        },
        templateUrl: 'home/home.html'
      })
      .state('login', {
        url: '/login',
        resolve: {
          requireNoAuth: function($state, Auth) {
            return Auth.$requireAuth().then(function(auth) {
              $state.go('channels');
            }, function(error) {
              return;
            });
          }
        },
        controller: 'AuthCtrl as authCtrl',
        templateUrl: 'auth/login.html'
      })
      .state('register', {
        url: '/register',
        resolve: {
          requireNoAuth: function($state, Auth) {
            return Auth.$requireAuth().then(function(auth) {
              $state.go('channels');
            }, function(error) {
              return;
            });
          }
        },
        controller: 'AuthCtrl as authCtrl',
        templateUrl: 'auth/register.html'
      })
      .state('profile', {
        url: '/profile',
        resolve: {
          auth: function($state, Users, Auth) {
            return Auth.$requireAuth().catch(function() {
              $state.go('home');
            });
          },
          profile: function(Users, Auth) {
            return Auth.$requireAuth().then(function(auth) {
              return Users.getProfile(auth.uid).$loaded();
            });
          }
        },
        controller: 'ProfileCtrl as profileCtrl',
        templateUrl: 'users/profile.html'
      })
      .state('channels', {
        url: '/channels',
        resolve: {
          channels: function(Channels) {
            return Channels.$loaded();
          },
          profile: function($state, Auth, Users) {
            return Auth.$requireAuth().then(function(auth) {
              return Users.getProfile(auth.uid).$loaded().then(function(profile) {
                if (profile.displayName) {
                  return profile;
                } else {
                  $state.go('profile');
                }
              });
            }, function(error) {
              $state.go('home');
            });
          }
        },
        controller: 'ChannelsCtrl as channelsCtrl',
        templateUrl: 'channels/index.html'
      })
      .state('channels.create', {
        url: '/create',
        templateUrl: 'channels/create.html',
        controller: 'ChannelsCtrl as channelsCtrl'
      })
      .state('channels.messages', {
        url: '/{channelId}/messages',
        resolve: {
          messages: function($stateParams, Messages) {
            return Messages.forChannel($stateParams.channelId).$loaded();
          },
          channelName: function($stateParams, channels) {
            return '#'+channels.$getRecord($stateParams.channelId).name;
          }
        },
        templateUrl: 'channels/messages.html',
        controller: 'MessagesCtrl as messagesCtrl'
      });

    $urlRouterProvider.otherwise('/');
  })
  .constant('FirebaseUrl', 'https://emberslack.firebaseio.com//');
