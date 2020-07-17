plantsApp = angular.module('angPlantsApp', ['ngFileUpload', 'ui.bootstrap']);

//upload file
plantsApp.directive('ngFiles', ['$parse', function ($parse) {
  function fn_link(scope, element, attrs) {
      var onChange = $parse(attrs.ngFiles);
      element.on('change', function (event) {
          onChange(scope, { $files: event.target.files });
      });
  };

  return {
      link: fn_link
  }
}]);

plantsApp.controller('plantsController', ['Upload','$window', '$scope', '$http', '$uibModal',
                function(Upload, $window, $scope, $http, $uibModal){
    let host = 'http://localhost:3010';

    let URL_ALL_PLANTS = host + '/getAllPlants';
    let URL_UPLOAD = host + '/uploadPhoto';
    let URL_INSERT = host + '/insertPlant';
    let URL_DELETE = host + '/deletePlant?'

    $scope.activeDashboard = "";
    $scope.activeViewGarden = "";
    $scope.activePlants = "active";
    $scope.activeUserProfile = "";
    $scope.activeGardens = "";

    $scope.plants = [];
    $scope.plant = {};
    $scope.imgSrc = '/img/no-image.png';

    $scope.plantId = 0;
    $scope.photo_temp = '';

    /*=== Get all plants ===*/
    $scope.getAllPlants = function(){
        $http.get(URL_ALL_PLANTS).then(function(response){
            //console.log(response.data);
            $scope.plants = response.data;
        });
    };

    $scope.add = function(){
        $scope.plantId = 0;

        let newPlant = {
            id: 0,
            photo: '/img/no-image.png',
            name: '',
            maxHeight: 10,
            standardSoilMoisture: 1,
            description: ''
        };
        $scope.plantDialog(newPlant, 'add');
    };

    $scope.view = function(plant){
        $scope.plantDialog(plant, 'view');
    };

    $scope.edit = function(plant){
        $scope.plantDialog(plant, 'edit');
    };

    $scope.deletePlantObject = {};
    $scope.delete = function(plant){
        $scope.deletePlantObject = plant;
        $scope.alertDialog('Confirmation', 'Are you sure you want to delete this plant?');
    };

    $scope.proceedDelete = function(){
        $http.get(URL_DELETE + `plantId=${$scope.deletePlantObject.id}`)
        .then(function (response) {
            let index = $scope.plants.findIndex( pl => pl.id === $scope.deletePlantObject.id );
            console.log(index);
            $scope.plants.splice(index, 1);
        });
    }

    /*=== INSERT / UPDATE ===*/
    $scope.save = function(plant){
        let userId = $window.localStorage.getItem("userId");
        plant.userId = userId;

        //Save data
        $http.post(URL_INSERT, plant).then(function(response){
            //console.log(response);
            if (response.data == 1)
            {
                $scope.alertDialog('Successful', 'Action successful.');
                $scope.getAllPlants();
            }
            else
                $scope.alertDialog('Error', 'Something Error!');
        });
    }

    /*=== MODAL ===*/
    $scope.alertDialog = function(header, content) {
        let modalInstance =  $uibModal.open({
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

            //delete a plant
            if (response == 'delete'){
                $scope.proceedDelete();
            }
        });
    };

    $scope.plantDialog = function(param, action) {
        //console.log(param);
        let modalInstance = $uibModal.open({
            templateUrl: "plantModal.html",
            controller: "plantCtrl",
            size: "clg",
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
            //console.log('plant modal: ' + response);
            if(response != 'cancel'){
                console.log(response);
                $scope.save(response);
            }
        });
    }

    /*=== SIGN OUT ===*/
    $scope.signOut = function(){
        $window.localStorage.removeItem("username");
        $window.location.href = '/';
    };

    /*=== MAIN ===*/
    $scope.getAllPlants();

}]);

plantsApp.controller('ModalContentCtrl', function($scope, $http, $uibModalInstance, header, content) {

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

plantsApp.controller('plantCtrl', function(Upload, $scope, $http, $uibModalInstance, $uibModal, plant, action){
    $scope.headerInfo = '';

    $scope.showSave = true;
    $scope.showClose = true;

    $scope.plantId = plant.id;
    $scope.imgSrc = plant.photo;
    $scope.name = plant.name;
    $scope.maxHeight = plant.maxHeight;
    $scope.standardSoilMoisture = plant.standardSoilMoisture;
    $scope.description = plant.description;
    $scope.photo_temp = plant.photo;

    //console.log(action);
    if (action == 'view'){
        $scope.headerInfo = 'Plant Information';
        $scope.showSave = false;
    }
    else if (action == 'edit'){
        $scope.headerInfo = 'Edit a Plant';
        $scope.showSave = true;
    }
    else{
        $scope.headerInfo = 'Add New Plant';
        $scope.showSave = true;
    }

    $scope.plantClose = function(){
        $uibModalInstance.close('cancel');
    }

    $scope.plantSave = function(){
        let photo = '';
        if($scope.file_model == undefined && $scope.plantId != 0)
            photo = $scope.photo_temp;
        else if($scope.file_model == undefined && $scope.plantId == 0)
            photo = '/img/no-image.png';
        else //console.log(new Date().toDateString() + '.' + $scope.file_model.name);
            photo = '/img/plants/' + new Date().toDateString() + '.' + $scope.file_model.name;

        if ($scope.name == undefined || $scope.name == '' || $scope.name == null
                    || $scope.maxHeight == undefined || $scope.maxHeight == '' || $scope.maxHeight == null || $scope.maxHeight < 10
                    || $scope.standardSoilMoisture == undefined || $scope.standardSoilMoisture == '' || $scope.standardSoilMoisture == null || $scope.standardSoilMoisture < 1
                    || $scope.description == undefined || $scope.description == '' || $scope.description == null
        )
        {
            //alert('Please fill all values. Max height >= 10. Standard Soil Moisture > 0');
            $scope.alertDialog('Warning', 'Please fill all values. Max height >= 10. Standard Soil Moisture > 0');
            return;
        }

        let newPlant = {
            id: $scope.plantId,
            photo: photo,
            name: $scope.name,
            maxHeight: $scope.maxHeight,
            standardSoilMoisture: $scope.standardSoilMoisture,
            description: $scope.description
        };

        //upload file
        if($scope.file_model != null)
            $scope.upload($scope.file_model);

        $uibModalInstance.close(newPlant);
    }

    /*=== Upload an image ===*/
    $scope.upload = function (file) {
        Upload.upload({
            url: 'http://localhost:3010/upload', //webAPI exposed to upload the file
            data:{ file:file } //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if(resp.data.error_code === 0){ //validate success
                //$window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
            } else {
                $window.alert('an error occurred');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        }, function (evt) {
            //console.log(evt);
        });
    };

    /*=== Alert Dialog ===*/
    $scope.alertDialog = function(header, content) {
        let modalInstance =  $uibModal.open({
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

            //delete a plant
            if (response == 'delete'){
                $scope.proceedDelete();
            }
        });
    };
});


