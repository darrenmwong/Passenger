angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/lock', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        })
        .when('/', {
            templateUrl: 'views/lock.html',
            controller: 'LockCtrl'
        });


    $locationProvider.html5Mode(true);

}]);