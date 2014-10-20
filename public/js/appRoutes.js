angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        })
        .when('/lock', {
            templateUrl: 'views/lock.html',
            controller: 'LockCtrl'
        });


    $locationProvider.html5Mode(true);

}]);