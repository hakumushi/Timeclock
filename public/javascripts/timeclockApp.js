var app = angular.module('timeclockApp', ['ngRoute', 'ngCookies', 'ngResource']).run(function($rootScope, $http, $cookies) {
  $rootScope.authenticated = false;
  $rootScope.current_user = '';

  $rootScope.logout = function(){
    $http.get('/logout');

    $cookies.Token = '';
    $rootScope.authenticated = false;
    $rootScope.current_user = '';
  };
});

app.config(function($routeProvider){
  $routeProvider
    //the timeline display
    .when('/', {
      templateUrl: 'main.html',
      controller: 'mainController'
    })
    //the login display
    .when('/login', {
      templateUrl: 'login.html',
      controller: 'usersController'
    })
    //the signup display
    .when('/register', {
      templateUrl: 'register.html',
      controller: 'usersController'
    })
    //time register
    .when('/days', {
      templateUrl: 'timeRegister.html',
      controller: 'daysController'
    });
});

app.controller('mainController', function($rootScope, $scope, $cookies, $http){
  var token = $cookies;
  if(token){
    $http.get('/getUserByToken', {headers: {'Authorization': 'JWT '+token['Token']}}).success(function(user){
      $rootScope.authenticated = true;
      $rootScope.current_user = user;
      $http.get('/get_status_time_by_id/'+user._id, {headers: {'Authorization': 'JWT '+token['Token']}}).success(function(generalStatus){
        $rootScope.generalStatus = generalStatus;
      });
      var date = new Date();
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      $http.get('/get_status_time/'+user._id+'&'+firstDay+'&'+lastDay, {headers: {'Authorization': 'JWT '+token['Token']}}).success(function(monthlyStatus){
        $rootScope.monthlyStatus = monthlyStatus;
      });
    });
  }
});

app.controller('daysController', function($scope, $rootScope, $http, $cookies, $location){
  var token = $cookies;
  if(token){
    $http.get('/getUserByToken', {headers: {'Authorization': 'JWT '+token['Token']}}).success(function(user){
      $rootScope.authenticated = true;
      $rootScope.current_user = user;
    });
  }
  $scope.days = function(){
    var day = {
      day: $scope.day.day,
      user_id: $rootScope.current_user._id,
      status: 1,
      inputs: [
        {enter: $scope.day.inputs.enter, out: $scope.day.inputs.mealin, type:0},
        {enter: $scope.day.inputs.mealin, out: $scope.day.inputs.mealout, type:1},
        {enter: $scope.day.inputs.mealout, out: $scope.day.inputs.out, type:0},
      ]
    }
    $http.post('/days', day, {headers: {Authorization: 'JWT '+ token['Token']}}).success(function(data){
      $location.path('/');
    });
  };

});

app.controller('usersController', function($scope, $rootScope, $http, $location){
    $scope.user = {email: '', password: ''};
    $scope.error_message = '';
  
    $scope.login = function(){
      $http.post('/login', $scope.user).success(function(data){
        $rootScope.authenticated = true;
        $rootScope.current_user = data;

        $location.path('/');
      });
    };
  
    $scope.register = function(){
      $http.post('/register', $scope.user).success(function(data){
        $rootScope.authenticated = true;
        $rootScope.current_user = data;

        $location.path('/');
      });
    };
  });