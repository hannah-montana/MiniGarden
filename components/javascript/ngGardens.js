gardenApp = angular.module('angGardenApp', ['ngFileUpload', 'ui.bootstrap']);

gardenApp.controller('gardenController', ['Upload', '$scope', '$http', '$uibModal',
                                    function(Upload, $scope, $http, $uibModal){
    let host = 'http://localhost:3010';

    let URL_ALL_GARDENS = host + '/getAllGardens';

    $scope.activeDashboard = "";
    $scope.activeViewGarden = "";
    $scope.activePlants = "";
    $scope.activeUserProfile = "";
    $scope.activeGardens = "active";

    $scope.gardens = [];

    /*=== Get all gardens ===*/
    $scope.getAllGardens = function(){
        $http.get(URL_ALL_GARDENS).then(function(response){
            $scope.gardens = response.data;
        });
    };

    /*=== Add/View/Edit/Delete Garden ===*/
    $scope.add = function(){
        $scope.gardenId = 0;

        let newGarden = {
            id: 0,
            name: '',
            location: '',
            description: ''
        };
        $scope.gardenDialog(newGarden, 'add');
    }

    /*=== SIGN OUT ===*/
    $scope.signOut = function(){
        $window.localStorage.removeItem("username");
        $window.location.href = '/';
    };

    /*=== MODAL ===*/
    $scope.gardenDialog = function(param, action) {
        let modalInstance = $uibModal.open({
            templateUrl: "gardenModal.html",
            controller: "gardenCtrl",
            size: "xlg",
            resolve: {
                plant: function(){
                    return param;
                },
                action: function(){
                    return action
                }
            }
        });
        modalInstance.result.then(function(response){
            console.log(response);
            if(response != 'cancel'){
                console.log(response);
                //$scope.save(response);
            }
        });
    }

    /*=== MAIN ===*/
    $scope.getAllGardens();
}]);

gardenApp.controller('gardenCtrl', function(Upload, $scope, $http, $uibModalInstance, $uibModal, plant, action){
    $scope.headerInfo = '';

    $scope.showSave = true;
    $scope.showClose = true;

    let host = 'http://localhost:3010';
    let URL_ALL_PLANTS = host + '/getAllPlants';

    /*=== Get all plants ===*/
    $scope.getAllPlants = function(){
        $http.get(URL_ALL_PLANTS).then(function(response){
            //console.log(response.data);
            $scope.plants = response.data;
        });
    };

    $scope.plantClose = function(){
        $uibModalInstance.close('cancel');
    }

    $scope.plantSave = function(){
        $uibModalInstance.close('save');
    }

    /*=== MAIN ===*/
    if (action == 'view'){
        $scope.headerInfo = 'Garden Information';
        $scope.showSave = false;
    }
    else if (action == 'edit'){
        $scope.headerInfo = 'Edit a Garden';
        $scope.showSave = true;
    }
    else{
        $scope.headerInfo = 'Add New Garden';
        $scope.showSave = true;
    }
    $scope.getAllPlants();
});