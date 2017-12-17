(function() {
  var app = angular.module('myApp', ['ui.router']);
  
  app.run(function($rootScope, $location, $state, LoginService) {
    
      if(!LoginService.isAuthenticated()) {
        $state.transitionTo('login');
      }
  });
  
  app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    
    $stateProvider
      .state('login', {
        url : '/login',
        templateUrl : 'login.html',
        controller : 'LoginController'
      })
      .state('home', {
        url : '/home',
        templateUrl : 'home.html',
        controller : 'HomeController'
      });
  }]);

  app.controller('LoginController', function($scope, $rootScope, $stateParams, $state, LoginService) {
    $rootScope.title = "Login Page";
    
    $scope.formSubmit = function() {
      if(LoginService.login($scope.username, $scope.password)) {
        $scope.error = '';
        $scope.username = '';
        $scope.password = '';
        $state.transitionTo('home');
      } else {
        $scope.error = "Incorrect username/password !";
      }   
    };
    
  });
  
  app.factory('LoginService', function() {
    var admin = 'admin';
    var pass = 'admin';
    var isAuthenticated = false;
    
    return {
      login : function(username, password) {
        isAuthenticated = username === admin && password === admin;
        return isAuthenticated;
      },
      isAuthenticated : function() {
        return isAuthenticated;
      }
    };
    
  });

  app.controller('HomeController', function($scope, $rootScope, $stateParams, $state, LoginService) {
  $rootScope.title = "Home Page";  
  $scope.tasks = (localStorage.getItem('todos')!==null) ? JSON.parse(localStorage.getItem('todos')) : [];
	//$scope.tasks = [];
  $scope.editIndex = false;
  $scope.action = "Add Task";
	$scope.addTask = function () {
		if( $scope.editIndex === false){
      $scope.tasks.push({task: $scope.task});
		} else {
			$scope.tasks[$scope.editIndex].task = $scope.task;
		}
		$scope.editIndex = false;
    $scope.task = '';
    $scope.action = "Add Task";      
    localStorage.setItem('todos', JSON.stringify($scope.tasks));
	    
	}
		
	$scope.editTask = function (index) {
    $scope.action = "Edit Task";
	  $scope.task = $scope.tasks[index].task;
    $scope.editIndex = index;
    localStorage.setItem('todos', JSON.stringify($scope.tasks));
	}
	$scope.deleteTask = function (index) {
    $scope.tasks.splice(index, 1);
    $scope.task = '';
    $scope.action = "Add Task";
    localStorage.setItem('todos', JSON.stringify($scope.tasks));
  }
  $scope.logout = function(){
    $scope.username = '';
    $scope.password = '';
    $state.transitionTo('login');
  }
  });
  
})();