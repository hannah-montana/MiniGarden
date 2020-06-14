viewGardenApp = angular.module('angViewGardenApp', ['ui.bootstrap']);

viewGardenApp.controller('viewGardenController', ['$scope', '$http', '$uibModal', function($scope, $http, $uibModal){
    let host = 'http://localhost:3010';

    $scope.activeDashboard = "";
    $scope.activeViewGarden = "active";
    $scope.activePlants = "";
    $scope.activeUserProfile = "";
    $scope.activeGardens = "";

    $scope.items = 'ahihi';

    $scope.open = function() {
        var modalInstance =  $uibModal.open({
            templateUrl: "myModalContent.html",
            controller: "ModalContentCtrl",
            size: 'csm',
            resolve: {
                param: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function(response){
            $scope.result = `${response} button hitted`;
        });
    };

    /*=== SIGN OUT ===*/
    $scope.signOut = function(){
        $window.localStorage.removeItem("username");
        $window.location.href = '/';
    };

    /*=== MAIN ===*/

}]);

viewGardenApp.controller('ModalContentCtrl', function($scope, $uibModalInstance, param) {

  $scope.ok = function(){
    //$uibModalInstance.close("Ok");
    console.log('ok: ' + param);
    $uibModalInstance.close();
  }

  $scope.cancel = function(){
    //$uibModalInstance.dismiss();
    console.log('cancel');
    $uibModalInstance.close();
  }

});