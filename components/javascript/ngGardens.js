gardenApp = angular.module('angGardenApp', ['ngFileUpload', 'ui.bootstrap']);

gardenApp.controller('gardenController', ['Upload', '$scope', '$http', '$uibModal',
                                    function(Upload, $scope, $http, $uibModal){
    let host = 'http://localhost:3010';

    let URL_ALL_GARDENS = host + '/getAllGardens';
    let URL_DELETE_GARDEN = host + '/deleteGarden?';

    $scope.activeDashboard = "";
    $scope.activeViewGarden = "";
    $scope.activePlants = "";
    $scope.activeUserProfile = "";
    $scope.activeGardens = "active";

    $scope.gardens = [];
    //$scope.gardenId = 0;

    /*=== Get all gardens ===*/
    $scope.getAllGardens = function(){
        $http.get(URL_ALL_GARDENS).then(function(response){
            $scope.gardens = response.data;
        });
    };

    /*=== Add/View/Edit/Delete Garden ===*/
    $scope.add = function(){
        //$scope.gardenId = 0;

        let newGarden = {
            id: 0,
            name: '',
            location: '',
            description: ''
        };
        $scope.gardenDialog(newGarden, 'add');
    }

    $scope.view = function(garden){
        $scope.gardenDialog(garden, 'view');
    }

    $scope.edit = function(garden){
        //$scope.gardenId = garden.id;
        $scope.gardenEditDialog(garden);
    }

    $scope.deleteGardenId = '';
    $scope.delete = function(garden){
        //console.log(garden);
        $scope.deleteGardenId = garden.id;
        $scope.alertDialog('Confirmation', 'Are you sure you want to delete this garden?');
    }

    /*=== SIGN OUT ===*/
    $scope.signOut = function(){
        $window.localStorage.removeItem("username");
        $window.location.href = '/';
    };

    /*=== MODAL ALERT ===*/
    $scope.alertDialog = function(header, content) {
        let modalInstance = $uibModal.open({
            templateUrl: "myModalContent.html",
            controller: "ModalContentCtrl",
            size: "csm",
            resolve: {
                header: function () {
                    return header;
                },
                content: function () {
                    return content;
                }
            }
        });
        modalInstance.result.then(function(response){
            //$scope.result = `${response} button hitted`;
            console.log(response);

            if (response == 'delete'){
                $http.get(URL_DELETE_GARDEN + `gardenId=${$scope.deleteGardenId}`).then(function(response){
                    if(response.data == 1){
                        $scope.alertDialog('Successful', 'Deleted');
                        $scope.getAllGardens();
                    }
                    else
                        $scope.alertDialog('Error', 'Something error!');
                });
            }
        });
    };

    /*=== MODAL GARDEN ===*/
    $scope.gardenDialog = function(param, action) {
        let modalInstance = $uibModal.open({
            templateUrl: "gardenModal.html",
            controller: "gardenCtrl",
            size: "xlg",
            resolve: {
                garden: function(){
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

    $scope.gardenEditDialog = function(param, action) {
        let modalInstance = $uibModal.open({
            templateUrl: "gardenEditModal.html",
            controller: "gardenEditCtrl",
            size: "xlg",
            resolve: {
                garden: function(){
                    return param;
                }
            }
        });
        modalInstance.result.then(function(response){
            if(response != 'cancel'){
                $scope.getAllGardens();
            }
        });
    }

    /*=== MAIN ===*/
    $scope.getAllGardens();
}]);

/* Modal Garden */
gardenApp.controller('gardenCtrl', function(Upload, $scope, $http, $window, $uibModalInstance, $uibModal, garden, action){
    $scope.headerInfo = '';

    $scope.showSave = true;
    $scope.showClose = true;

    $scope.userId = $window.localStorage.getItem("userId");

    let host = 'http://localhost:3010';
    let URL_ALL_PLANTS = host + '/getAllPlants';
    let URL_INSERT_GARDEN = host + '/insertGarden';
    let URL_UPDATE_LIST_PLANTS = host + '/updateListPlants';
    let URL_GET_PLANTS_BY_GARDEN_ID = host + '/getPlantsByGardenId?';

    $scope.selectedPlants = [];
    $scope.garden = {};

    $scope.hideDeleteBtn = true;
    $scope.setReadOnly = true;

    /*=== Get all plants ===*/
    $scope.getAllPlants = function(){
        $http.get(URL_ALL_PLANTS).then(function(response){
            //console.log(response.data);
            $scope.plants = response.data;
        });
    };

    $scope.gardenClose = function(){
        $uibModalInstance.close('cancel');
    }

    $scope.gardenSave = function(){
        //add new
        if ($scope.name == undefined || $scope.name == '' || $scope.name == null
            || $scope.location == undefined || $scope.location == '' || $scope.location == null){
            $scope.alertDialog('Warning', 'Please fill name and location.');
            return;
        }
        $scope.garden.id = garden.id;
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
                $scope.alertDialog('Successful', 'Action successful.');
            }
        });
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

    /*=== MODAL ALERT ===*/
    $scope.alertDialog = function(header, content) {
        let modalInstance = $uibModal.open({
            templateUrl: "myModalContent.html",
            controller: "ModalContentCtrl",
            size: "csm",
            resolve: {
                header: function () {
                    return header;
                },
                content: function () {
                    return content;
                }
            }
        });
        modalInstance.result.then(function(response){
            $scope.result = `${response} button hitted`;
            console.log(response);

            //don't use
            /*if (response == 'delete'){
                //$scope.proceedDelete();
            }*/
        });
    };

    /*=== MODAL PLANT'S DETAIL ===*/
    $scope.plantDetail = function(plant){
        let modalInstance = $uibModal.open({
            templateUrl: "plantDetail.html",
            controller: "ModalPlantCtrl",
            size: "clg",
            resolve: {
                plant: function(){
                    return plant;
                }
            }
        });
    }

    $scope.viewPlant = function(plant){
        $scope.plantDetail(plant);
    }

    /*=== MAIN ===*/
    if (action == 'view'){
        $scope.headerInfo = 'Garden Information';
        $scope.showSave = false;
        $scope.hideDeleteBtn = true;
        $scope.setReadOnly = true;

        //view information
        console.log(garden);
        $scope.name = garden.name;
        $scope.location = garden.location;
        $scope.description = garden.description;

        //get selected plants
        //$scope.selectedPlants
        $http.get(URL_GET_PLANTS_BY_GARDEN_ID + `gardenId=${garden.id}`).then(function(response){
            console.log("view result");
            console.log(response.data[0]);
            $scope.selectedPlants = response.data[0];
        });
    }
    else if (action == 'edit'){
        $scope.headerInfo = 'Edit a Garden';
        $scope.showSave = true;
        $scope.hideDeleteBtn = false;
        $scope.setReadOnly = false;

        //view information
        console.log(garden);
        $scope.name = garden.name;
        $scope.location = garden.location;
        $scope.description = garden.description;

        //get selected plants
        $http.get(URL_GET_PLANTS_BY_GARDEN_ID + `gardenId=${garden.id}`).then(function(response){
            console.log("view result");
            console.log(response.data[0]);
            $scope.selectedPlants = response.data[0];
        });
    }
    else{
        $scope.headerInfo = 'Add New Garden';
        $scope.showSave = true;
        $scope.hideDeleteBtn = false;
        $scope.setReadOnly = false;
    }
    $scope.getAllPlants();
});

/* Modal Edit Garden */
gardenApp.controller('gardenEditCtrl', function(Upload, $scope, $http, $window, $uibModalInstance, $uibModal, garden){
    $scope.headerInfo = '';

    $scope.showSave = true;
    $scope.showClose = true;

    $scope.userId = $window.localStorage.getItem("userId");

    let host = 'http://localhost:3010';
    let URL_ALL_PLANTS = host + '/getAllPlants';
    let URL_UPDATE_GARDEN = host + '/insertGarden';
    let URL_GET_PLANTS_BY_GARDEN_ID = host + '/getPlantsByGardenId?';
    let URL_INSERT_PLANT_TO_GARDEN = host + '/insertPlantToGarden';
    let URL_UPDATE_AMOUNT = host + '/updateAmount';
    let URL_DELETE_GARDEN_PLANT = host + '/deleteGardenPlant';

    $scope.selectedPlants = [];
    $scope.garden = {};

    $scope.hideDeleteBtn = true;
    $scope.setReadOnly = true;

    /*=== Get all plants ===*/
    $scope.getAllPlants = function(){
        $http.get(URL_ALL_PLANTS).then(function(response){
            //console.log(response.data);
            $scope.plants = response.data;
        });
    };

    $scope.m_gardenClose = function(){
        $uibModalInstance.close('cancel');
    }

    $scope.m_gardenSave = function(){
        if ($scope.name == undefined || $scope.name == '' || $scope.name == null
            || $scope.location == undefined || $scope.location == '' || $scope.location == null){
            $scope.alertDialog('Warning', 'Please fill name and location.');
            return;
        }
        $scope.garden.id = garden.id;
        $scope.garden.name = $scope.name;
        $scope.garden.location = $scope.location;
        $scope.garden.description = $scope.description;
        $scope.garden.userId = $scope.userId;

        $scope.garden.listPlants = [];
        /*for (var i=0; i < $scope.selectedPlants.length; i++){
            let addPl = { plantId: $scope.selectedPlants[i].id,
                            amount: $scope.selectedPlants[i].amount};
            $scope.garden.listPlants.push(addPl);
        }*/

        $http.post(URL_UPDATE_GARDEN, $scope.garden).then(function(response){
            //insert successful
            if(response.data > 0){
                //console.log(response.data);
                $scope.alertDialog('Successful', 'Action successful.');
            }
        });

        $uibModalInstance.close('save');
    }

    $scope.m_addPlants = function(plant){
        let checkExists = false;
        for (var i=0; i<$scope.selectedPlants.length; i++){
            if (plant.id == $scope.selectedPlants[i].id){
                checkExists = true;
                break;
            }
        }

        plant.amount = 1;
        plant.gardenId = garden.id;
        //if ($scope.selectedPlants.indexOf(plant) == -1)
        if (checkExists == false)
        {
            $scope.selectedPlants.push(plant);
            //save to database
            $http.post(URL_INSERT_PLANT_TO_GARDEN, plant).then(function(response){
                console.log(response);
                if(response.data == 1)
                    console.log('insert plant to garden successful');
            });
        }
        else
            $scope.alertDialog('Warning', 'Type of this plant existed in the garden');
    }

    $scope.changeAmount = function(plant, event){
        plant.amount = event.newAmount;
        //update this amount to garden_plants

        let garden_plant = {
            gardenId: garden.id,
            plantId: plant.id,
            amount: plant.amount
        };
        $http.post(URL_UPDATE_AMOUNT, garden_plant).then(function(response){
            //console.log(response);
        });
    }

    $scope.delete_garden_plant = {};
    $scope.slicePlant = {};
    $scope.m_removePlant = function(plant){
        console.log(plant);
        //delete garden_plant in database
        $scope.delete_garden_plant = {
            gardenId: garden.id,
            plantId: plant.id
        };

        $scope.slicePlant = plant;
        $scope.alertDialog('Confirmation', 'Are you sure you want to delete this plant?');

    }

    /*=== MODAL ALERT ===*/
    $scope.alertDialog = function(header, content) {
        let modalInstance = $uibModal.open({
            templateUrl: "myModalContent.html",
            controller: "ModalContentCtrl",
            size: "csm",
            resolve: {
                header: function () {
                    return header;
                },
                content: function () {
                    return content;
                }
            }
        });
        modalInstance.result.then(function(response){
            $scope.result = `${response} button hitted`;
            console.log(response);

            //delete a plant in a garden
            if (response == 'delete'){
                //$scope.proceedDelete();
                $http.post(URL_DELETE_GARDEN_PLANT, $scope.delete_garden_plant).then(function(response){
                    $scope.alertDialog('Successful', 'Deleted');

                    let index = $scope.selectedPlants.indexOf($scope.slicePlant);
                    $scope.selectedPlants.splice(index, 1);
                });
            }
        });
    };

    /*=== MODAL PLANT'S DETAIL ===*/
    $scope.plantDetail = function(plant){
        let modalInstance = $uibModal.open({
            templateUrl: "plantDetail.html",
            controller: "ModalPlantCtrl",
            size: "clg",
            resolve: {
                plant: function(){
                    return plant;
                }
            }
        });
    }

    $scope.m_viewPlant = function(plant){
        $scope.plantDetail(plant);
    }

    /*=== MAIN ===*/
    $scope.headerInfo = 'Edit a Garden';
    $scope.showSave = true;
    $scope.hideDeleteBtn = false;
    $scope.setReadOnly = false;

    //view information
    console.log(garden);
    $scope.name = garden.name;
    $scope.location = garden.location;
    $scope.description = garden.description;

    //get selected plants
    $http.get(URL_GET_PLANTS_BY_GARDEN_ID + `gardenId=${garden.id}`).then(function(response){
        console.log("view result");
        console.log(response.data[0]);
        $scope.selectedPlants = response.data[0];
    });

    $scope.getAllPlants();
});

/* Modal Alert*/
gardenApp.controller('ModalContentCtrl', function($scope, $http, $uibModalInstance, header, content) {

    $scope.alertHeader = header;
    $scope.alertContent = content;
    $scope.showOK = true;
    $scope.showCancel = true;
    $scope.showConfirmDelete = true;

    if (header == 'Warning') {
        $scope.showOK = false;
        $scope.showCancel = true;
        $scope.showConfirmDelete = false;
    }
    else if (header == 'Successful'){
        $scope.showOK = true;
        $scope.showCancel = false;
        $scope.showConfirmDelete = false;
    }
    else if (header == 'Confirmation'){
        $scope.showOK = false;
        $scope.showCancel = true;
        $scope.showConfirmDelete = true;
    }

    $scope.ok = function() {
        $uibModalInstance.close('ok');
    }

    $scope.cancel = function() {
        $uibModalInstance.close('cancel');
    }

    $scope.delete = function () {
        $uibModalInstance.close('delete');
    }
});

/* Modal Alert*/
gardenApp.controller('ModalPlantCtrl', function($scope, $http, $uibModalInstance, plant) {
    $scope.plantPhoto = plant.photo;
    $scope.plantName = plant.name;
    $scope.plantMaxHeight = plant.maxHeight;
    $scope.plantStandardSoilMoisture = plant.standardSoilMoisture;
    $scope.plantDescription = plant.description;

    $scope.cancel = function() {
        $uibModalInstance.close('cancel');
    }
});