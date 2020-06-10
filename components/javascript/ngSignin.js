signInApp = angular.module('angSignInApp', []);

signInApp.controller('SignInController', function($scope, $http, $window){
    let host = "http://localhost:3010";

    let URL_ALL_USERS = host + '/allUsers';
    let URL_USER = host + '/user?';

    $scope.users = [];
    $scope.user = null;
    $scope.errorMess = "";

    $scope.signIn = function(){
        if($scope.username == undefined || $scope.pass == undefined
                || $scope.username == '' || $scope.pass == '') {
            alert('Please fill Username and Password!');
            return;
        }

        console.log($scope.pass);
        let encryptPass = CryptoJS.AES.encrypt($scope.pass, '123');
        console.log("encrypt:")
        console.log(encryptPass);
        console.log(encryptPass.key.words.length);

        //let decryptPass = CryptoJS.AES.decrypt(encryptPass, '123').toString(CryptoJS.enc.Utf8);
        //console.log('Decrypt');
        //console.log(decryptPass);

        /*$http({
            method  : 'POST',
            url     : URL_USER,
            data    : { username : $scope.username, pass : $scope.pass }
        }).then(function(response) {
            //var data = response.results;
            console.log(response);
            console.log(response.status);
        });*/

        /*$http.get(URL_ALL_USERS)
            .then(function(response){
            $scope.users = response.data;
            console.log($scope.users);

        });*/


        $http.get(URL_USER + `username=${$scope.username}&pass=${encryptPass}`)
            .then(function(response){
            $scope.user = response.data[0];
            //console.log($scope.user);
            if($scope.user != null){
                $window.localStorage.setItem("username", $scope.user.username);
                $window.location.href = '/dashboard';
            }
            else
                $scope.errorMess = "Your Username and Password is wrong!";
        });

        /*if ($scope.user == undefined){
            alert('Unsuccessful');
        }*/
    }

});