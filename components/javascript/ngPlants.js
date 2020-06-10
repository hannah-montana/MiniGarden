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
        x.style.display = 'block';
        y.style.display = 'block';
        z.style.display = 'block';

        //clear form
        $scope.clearForm();
    };
    $scope.e_name = "test";

    $scope.view = function(plant){
        x.style.display = 'block';

        $scope.imgSrc = plant.photo;
        $scope.name = plant.name;
        $scope.maxHeight = plant.maxHeight;
        $scope.standardSoilMoisture = plant.standardSoilMoisture;
        $scope.description = plant.description;

        //block Save button
        y.style.display = 'none';
        z.style.readonly = 'true';
    };

    $scope.edit = function(plant){
        $scope.plantId = plant.id;
        x.style.display = 'block';
        y.style.display = 'block';
        z.style.display = 'block';

        $scope.imgSrc = plant.photo;
        $scope.name = plant.name;
        $scope.maxHeight = plant.maxHeight;
        $scope.standardSoilMoisture = plant.standardSoilMoisture;
        $scope.description = plant.description;
        $scope.photo_temp = plant.photo;
    };

    $scope.delete = function(plant){
        x.style.display = 'none';
        if (confirm('Are you sure you want to delete this plant?')) {
            // Delete it!
            $http.get(URL_DELETE + `plantId=${plant.id}`)
                .then(function (response) {
                    let index = $scope.plants.findIndex( pl => pl.id === plant.id );
                    console.log(index);
                    $scope.plants.splice(index, 1);
                });
        } else {
            // Do nothing!
        }
    };

    /*=== INSERT / UPDATE ===*/
    $scope.submit = function(){ //function to call on form submit
        //check data
        console.log($scope.file_model);
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
            alert('Please fill all values. Max height >= 10. Standard Soil Moisture > 0');
            return;
        }

        //upload file
        $scope.upload($scope.file_model);

        //Save data
        $scope.plant = {id: $scope.plantId,
                        name: $scope.name,
                        photo: photo,
                        maxHeight: $scope.maxHeight,
                        standardSoilMoisture: $scope.standardSoilMoisture,
                        description: $scope.description};

        $http.post(URL_INSERT, $scope.plant).then(function(response){
            //console.log(response);
            if (response.data == 1)
            {
                alert ("Successful.");
                $scope.getAllPlants();

                //clear form
                $scope.clearForm();

                x.style.display = 'none';
            }
            else
                alert ("Error !!!");
        });

    }

    $scope.clearForm = function(){
        $scope.name = '';
        $scope.maxHeight = '';
        $scope.standardSoilMoisture = '';
        $scope.description = '';
        $scope.file_model = undefined;
        $scope.imgSrc = '/img/no-image.png';
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

    /*=== MODAL ===*/

    /*=== MAIN ===*/
    var x = document.getElementById('addPlant');
    x.style.display = 'none';
    var y = document.getElementById('btnSave');
    y.style.display = 'block';
    var z = document.getElementById('btnFile');
    z.style.display = 'block';

    $scope.getAllPlants();

}]);


