viewGardenApp = angular.module('angViewGardenApp', ['ui.bootstrap']);

viewGardenApp.controller('viewGardenController', ['$scope', '$http', '$uibModal', function($scope, $http, $uibModal){
    let host = 'http://localhost:3010';

    $scope.activeDashboard = "";
    $scope.activeViewGarden = "active";
    $scope.activePlants = "";
    $scope.activeUserProfile = "";

    $scope.open = function() {

        var modalInstance =  $uibModal.open({
          templateUrl: "myModalContent.html",
          controller: "ModalContentCtrl",
          size: '',
        });

        modalInstance.result.then(function(response){
            $scope.result = `${response} button hitted`;
        });

    };


}]);

viewGardenApp.controller('ModalContentCtrl', function($scope, $uibModalInstance) {

  $scope.ok = function(){
    //$uibModalInstance.close("Ok");
    console.log('ok');
    $uibModalInstance.close();
  }

  $scope.cancel = function(){
    //$uibModalInstance.dismiss();
    console.log('cancel');
    $uibModalInstance.close();
  }

});