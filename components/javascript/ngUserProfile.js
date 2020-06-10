userProfileApp = angular.module('angUserProfileApp', []);

userProfileApp.controller('userProfileController', function($scope, $http, $window){
    let host = 'http://localhost:3010';

    $scope.activeDashboard = "";
    $scope.activeViewGarden = "";
    $scope.activePlants = "";
    $scope.activeUserProfile = "active";

});