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
        templateUrl: 'home/home.html'
      })
      .state('login', {
        url: '/login',
        resolve: {
          requireNoAuth: function($state, Auth) {
            return Auth.$requireAuth().then(function(auth) {
              $state.go('home');
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
              $state.go('home');
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
      });

    $urlRouterProvider.otherwise('/');
  })
  .constant('FirebaseUrl', 'https://emberslack.firebaseio.com//');
