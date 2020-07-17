userProfileApp = angular.module('angUserProfileApp', ['ngFileUpload', 'ui.bootstrap']);

//upload file
userProfileApp.directive('ngFiles', ['$parse', function ($parse) {
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

userProfileApp.controller('userProfileController', function($scope, $http, $window, $uibModal, Upload){
    let host = 'http://localhost:3010';
    let URL_GET_BY_ID = host + '/userByUserId?';
    let URL_UPDATE = host + '/updateUser';
    let URL_GET_SHARING = host + '/getSharing?';
    let URL_GET_NUMBER_SHARING_GARDEN = host + '/numberSharingGarden?';
    let URL_GET_NUMBER_SHARING_PEOPLE = host + '/numberSharingPeople?';
    let URL_UPLOAD = host + '/uploadPhoto';
    let URL_GET_CARE_GARDEN = host + '/getCareGarden?';
    let URL_GET_SHARE_USERS = host + '/getShareUser?';

    $scope.activeDashboard = "";
    $scope.activeViewGarden = "";
    $scope.activePlants = "";
    $scope.activeUserProfile = "active";
    $scope.activeGardens = "";

    $scope.user = {};
    $scope.shares = [];
    $scope.numGarden = 0;
    $scope.numPeople = 0;
    $scope.photo = '/img/no-image.png';

    $scope.careGarden = [];

    $scope.update = function(){
        //upload file
        if($scope.file_model != null){
            $scope.upload($scope.file_model);
        }
        $scope.user = {
            id: $scope.userId,
            username: $scope.username.split(' ').join(''),
            password: $scope.password,
            email: $scope.email,
            firstName: $scope.firstName,
            lastName: $scope.lastName,
            address: $scope.address,
            city: $scope.city,
            country: $scope.country,
            zipcode: $scope.zipcode,
            description: $scope.description,
            photo: '/img/' + $scope.file_model.name
        };

        $http.post(URL_UPDATE, $scope.user).then(function(response){
            //console.log(response);
            if (response.data == 1)
            {
                $scope.password = '';
                $scope.alertDialog('Successful', 'Update successful.');
            }
            else{
                $scope.alertDialog('Error', 'Something Error!');
            }
        });
    };

    $scope.getUserById = function(){
        $http.get(URL_GET_BY_ID + `userId=${$scope.userId}`).then(function (response) {
            //console.log(response.data);
            $scope.photo = response.data[0].photo;
            $scope.username = response.data[0].username;
            $scope.email = response.data[0].email;
            $scope.firstName = response.data[0].firstName;
            $scope.lastName = response.data[0].lastName;
            $scope.address = response.data[0].address;
            $scope.city = response.data[0].city;
            $scope.country = response.data[0].country;
            $scope.zipcode = response.data[0].zipcode;
            $scope.description = response.data[0].description;
        });
    };

    $scope.gardenSharing = [];
    $scope.getSharing = function(){
        /*$http.get(URL_GET_SHARING + `userId=${$scope.userId}`).then(function (response) {
            console.log(response.data);
            $scope.shares = response.data[0];
        });*/

        $http.get(URL_GET_CARE_GARDEN + `userId=${$scope.userId}`).then(function (response) {
            //console.log(response.data);
            $scope.careGarden = response.data;
        });

        setTimeout(function(){
            if($scope.careGarden.length > 0){
                for(var i=0; i<$scope.careGarden[0].length; i++){
                    //console.log($scope.careGarden[0][i].gardenId);
                    let parent = {
                        gardenId: $scope.careGarden[0][i].gardenId,
                        gardenName: $scope.careGarden[0][i].gardenName,
                        lstSharing: []
                    };

                    $http.get(URL_GET_SHARE_USERS + `gardenId=${$scope.careGarden[0][i].gardenId}&userId=${$scope.userId}`).then(function (response1) {
                        //console.log(response1.data[0]);
                        let children = {};
                        for(var j=0; j<response1.data[0].length; j++){
                            children = {
                                userId: response1.data[0][j].userId,
                                userFullName: response1.data[0][j].userFullName,
                                photo: response1.data[0][j].photo
                            };
                            parent.lstSharing.push(children);
                        }
                    });
                    //console.log(parent);
                    $scope.gardenSharing.push(parent);
                }
                //console.log($scope.gardenSharing);
            }
        }, 400);
    };

    $scope.getNumberSharingGarden = function(){
        $http.get(URL_GET_NUMBER_SHARING_GARDEN + `userId=${$scope.userId}`).then(function (response) {
            if(response.data[0] != null){
                //console.log(response.data[0][0].numGarden);
                $scope.numGarden = response.data[0][0].numGarden;
            }
        });
    };

    $scope.getNumberSharingPeople = function(){
        $http.get(URL_GET_NUMBER_SHARING_PEOPLE + `userId=${$scope.userId}`).then(function (response) {
            if(response.data[0] != null){
                //console.log(response.data[0][0].numGarden);
                $scope.numPeople = response.data[0][0].numPeople;
            }
        });
    };

    $scope.clickOnUpload = function() {
        document.getElementById("btnFile").click();
    };

    /*=== Upload an image ===*/
    $scope.clickUpload = function(){
        angular.element('#upload').trigger('click');
        //document.getElementById("upload").trigger('click');
    };

    $scope.upload = function (file) {
        Upload.upload({
            url: URL_UPLOAD, //webAPI exposed to upload the file
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

    $scope.openShare = function(gardenId){
        $scope.sharingDialog('Sharing Garden History', gardenId);
    };

    /*=== MODAL SHARING ===*/
    $scope.sharingDialog = function(header, content) {
        let modalInstance =  $uibModal.open({
            templateUrl: "myModalSharing.html",
            controller: "ModalSharingCtrl",
            size: "clg",
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

            //delete ...
            if (response == 'delete'){
                //$scope.proceedDelete();
            }
        });
    };

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

            //delete ...
            if (response == 'delete'){
                //$scope.proceedDelete();
            }
        });
    };

    /*=== SIGN OUT ===*/
    $scope.signOut = function(){
        $window.localStorage.removeItem("username");
        $window.location.href = '/';
    };

    /*=== MAIN ===*/
    $scope.userId = $window.localStorage.getItem("userId");
    $scope.getUserById();
    $scope.getSharing();
    $scope.getNumberSharingGarden();
    $scope.getNumberSharingPeople();
});

userProfileApp.controller('ModalContentCtrl', function($scope, $http, $uibModalInstance, header, content) {

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

userProfileApp.controller('ModalSharingCtrl', function($scope, $http, $uibModalInstance, $sce, header, content) {
    let host = 'http://localhost:3010';
    let URL_GET_SHARING_HISTORY = host + '/getSharingHistory?';
    let URL_GET_GENERAL_INFORMATION = host + '/getGeneralInformationGarden?';

    $scope.alertHeader = header;
    $scope.alertContent = content;
    $scope.showOK = false;
    $scope.showCancel = true;
    $scope.showConfirmDelete = false;
    $scope.sharingHistories = [];
    $scope.generalInfo = {};

    $scope.ok = function() {
        $uibModalInstance.close('ok');
    }

    $scope.cancel = function() {
        $uibModalInstance.close('cancel');
    }

    $scope.delete = function () {
        $uibModalInstance.close('delete');
    }
    $scope.loadSharingHistory = function(){
        $http.get(URL_GET_SHARING_HISTORY + `gardenId=${content}`).then(function (response) {
            if(response.data != null){
                for(var i=0; i<response.data.length; i++){
                    //console.log(response.data[i]);
                    let _rate = "";
                    if (response.data[i].rate == 1)
                        _rate = '<i class="fa fa-star"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
                    else if(response.data[i].rate == 1.5)
                        _rate = '<i class="fa fa-star"></i><i class="fa fa-star-half-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
                    else if(response.data[i].rate == 2)
                        _rate = '<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
                    else if(response.data[i].rate == 2.5)
                        _rate = '<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-half-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
                    else if(response.data[i].rate == 3)
                        _rate = '<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';
                    else if(response.data[i].rate == 3.5)
                        _rate = '<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-half-o"></i><i class="fa fa-star-o"></i>';
                    else if(response.data[i].rate == 4)
                        _rate = '<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-o"></i>';
                    else if(response.data[i].rate == 4.5)
                        _rate = '<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-half-o"></i>';
                    else if(response.data[i].rate == 5)
                        _rate = '<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i>';
                    else
                        _rate = '<i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i>';

                    let row = {
                        comment: response.data[i].comment,
                        dateAction: response.data[i].dateAction,
                        gardenId: response.data[i].gardenId,
                        id: response.data[i].id,
                        rate: $sce.trustAsHtml(_rate),
                        userFullName: response.data[i].userFullName,
                        userId: response.data[i].userId
                    };
                    $scope.sharingHistories.push(row);
                }
            }
        });
    };

    $scope.getGeneralInformationGarden = function(){
        $http.get(URL_GET_GENERAL_INFORMATION + `gardenId=${content}`).then(function (response) {
            $scope.generalInfo = response.data[0][0];
        });
    };

    /*=== MAIN ===*/
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

    $scope.loadSharingHistory();
    $scope.getGeneralInformationGarden();
});