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

            /* view/edit/add */
            if(response != 'cancel'){
                //$scope.save(response);
                $scope.getAllGardens();
            }
        });
    }

    /*=== MAIN ===*/
    $scope.getAllGardens();
}]);

gardenApp.controller('gardenCtrl', function(Upload, $scope, $http, $window, $uibModalInstance, $uibModal, plant, action){
    $scope.headerInfo = '';

    $scope.showSave = true;
    $scope.showClose = true;

    $scope.userId = $window.localStorage.getItem("userId");

    let host = 'http://localhost:3010';
    let URL_ALL_PLANTS = host + '/getAllPlants';
    let URL_INSERT_GARDEN = host + '/insertGarden';
    let URL_UPDATE_LIST_PLANTS = host + '/updateListPlants';

    $scope.selectedPlants = [];
    $scope.garden = {};

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
        //add new
        if ($scope.garden != '{}'){
            $scope.garden.name = $scope.name;
            $scope.garden.location = $scope.location;
            $scope.garden.description = $scope.description;
            $scope.garden.userId = $scope.userId;

            $scope.garden.listPlants = [];
            for (var i=0; i < $scope.selectedPlants.length; i++){
                let addPl = { plantId: $scope.selectedPlants[i].id,
                                amount: $scope.selectedPlants[i].amount};
                $scope.garden.listPlants.push(addPl);
            }

            $http.post(URL_INSERT_GARDEN, $scope.garden).then(function(response){
                //insert successful
                if(response.data > 0){
                    console.log(response.data);
                }
            });
        }
        $uibModalInstance.close('save');
    }

    $scope.addPlants = function(plant){
        plant.amount = 1;
        if ($scope.selectedPlants.indexOf(plant) == -1)
            $scope.selectedPlants.push(plant);
        //console.log($scope.selectedPlants);
    }

    $scope.changeAmount = function(plant, event){
        plant.amount = event.newAmount;
    }

    $scope.removePlant = function(plant){
        let index = $scope.selectedPlants.indexOf(plant);
        $scope.selectedPlants.splice(index, 1);
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