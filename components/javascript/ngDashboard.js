dashboardApp = angular.module('angDashboardApp', ['chart.js']);

dashboardApp.controller('DashboardController', function($scope, $http, $window, $interval){
    let host = 'http://localhost:3010';

    let URL_DASHBOARD = host + '/dashboard';
    let URL_ALL_GARDEN = host + '/getAllGardens';
    let URL_GET_HUMIDITY = host + '/getHumidity?';
    let URL_GET_AVG_SOIL_MOISTURE = host + '/getAvgSoilMoisture';
    let URL_GET_AVG_WATER = host + '/getAvgWater';
    let URL_GET_TEMPERATURE = host + '/getTemperature?';

    let URL_GET_WATER_HISTORY_YEAR = host + '/getWaterHistoryByYear';
    let URL_GET_WATER_HISTORY_MONTH = host + '/getWaterHistoryByMonth';
    let URL_GET_WATER_HISTORY_DAY = host + '/getWaterHistoryByDay';

    $window.localStorage.setItem("activeDashboard", "active");
    $window.localStorage.setItem("activeViewGarden", "");
    $window.localStorage.setItem("activePlants", "");
    $window.localStorage.setItem("activeUserProfile", "");

    $scope.activeDashboard = "active";
    $scope.activeViewGarden = "";
    $scope.activePlants = "";
    $scope.activeUserProfile = "";
    $scope.activeGardens = "";

    let userSignIn = $window.localStorage.getItem("username");
    let userId = $window.localStorage.getItem("userId");

    console.log('userid: ' + userId);

    $scope.humidity = '';
    $scope.avgSoilMoisture = '';
    $scope.avgWater = '';
    $scope.avgTemperature = '';

    $scope.messData = '';

    $scope.test = function(){
        console.log('test');
    };

    /*=== GET DATA ===*/
    function getHumidity(){
        let gardenId = 0;
        $http.get(URL_GET_HUMIDITY + `gardenId=${gardenId}`).then(function(response){
            if(response.data != null)
                $scope.humidity = response.data[0][0].value;
                //console.log($scope.humidity);
        });
    }

    function getAvgSoilMoisture(){
        $http.get(URL_GET_AVG_SOIL_MOISTURE).then(function(response){
            $scope.avgSoilMoisture = response.data[0].avgMoisture;
        });
    }

    function getAvgWater(){
        $http.get(URL_GET_AVG_WATER).then(function(response){
            $scope.avgWater = response.data[0].avgWater;
        });
    }

    function getTemperature(){
        /*
        1. Get all hostname
        2. Get temperature in each garden
        3. Calculate average value
        */
        $scope.getAllGardens();

        setTimeout(function(){
            if ($scope.gardens != null){
                let total = 0;
                let count = 0;
                for(var i=0; i<$scope.gardens.length; i++){
                    console.log($scope.gardens[i].hostname);
                    let hostname = $scope.gardens[i].hostname;
                    $http.get(URL_GET_TEMPERATURE + `hostname=${hostname}`).then(function(response){
                        if (response.data[0] != ''){
                            let comma = response.data[0].indexOf(',');
                            let temp = response.data[0].substr(1, comma - 1);

                            total = total + temp;
                            count ++;
                        }
                    });
                }
                console.log(total);
                console.log(count);
            }
        }, 1000);



        /*$http.get(URL_ALL_GARDEN).then(function(response){
            if(response.data != null){
                let total = 0;
                let count = 0;
                for(var i=0; i<response.data.length; i++){
                    console.log(response.data[i].hostname);
                    let hostname = '192.168.43.135';
                    $http.get(URL_GET_TEMPERATURE + `hostname=${hostname}`).then(function(response){
                        if (response.data[0] != ''){
                            let comma = response.data[0].indexOf(',');
                            let temp = response.data[0].substr(1, comma - 1);

                            total = total + temp;
                            count ++;
                        }
                    });
                }
                $scope.avgTemperature = total/count;
            }
        });*/
    }

    /*=== WATER HISTORY BY YEAR ===*/
    $scope.series = [];
    $scope.showWaterHistory = function(){
        $scope.messData = '';
        $http.get(URL_GET_WATER_HISTORY_YEAR).then(function(response){
            if(response.data[0].length == 0){
                $scope.messData = 'No data';
                return;
            }
            //console.log(response.data[0]);
            //console.log(response.data[0].length);
            subData = [];
            arrGardenId = [];

            for (var i=0; i<response.data[0].length; i++){
                subSubData = [];

                arrGardenId.push(response.data[0][i].plantName);

                subSubData.push(response.data[0][i].M1);
                subSubData.push(response.data[0][i].M2);
                subSubData.push(response.data[0][i].M3);
                subSubData.push(response.data[0][i].M4);
                subSubData.push(response.data[0][i].M5);
                subSubData.push(response.data[0][i].M6);
                subSubData.push(response.data[0][i].M7);
                subSubData.push(response.data[0][i].M8);
                subSubData.push(response.data[0][i].M9);
                subSubData.push(response.data[0][i].M10);
                subSubData.push(response.data[0][i].M11);
                subSubData.push(response.data[0][i].M12);

                subData.push(subSubData);
            }
            //console.log(arrGardenId);
            //console.log(subData);

            $scope.labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
            $scope.series = arrGardenId; //['Series A', 'Series B'];
            $scope.data = subData; /*[
                [65, 59, 80, 81, 56, 55, 40],
                [28, 48, 40, 19, 86, 27, 90]
            ];*/

            $scope.onClick = function (points, evt) {
                console.log(points, evt);
            };
            $scope.dataSetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
            $scope.options = {
                scales: {
                    yAxes: [{
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left'
                    },
                    {
                        id: 'y-axis-2',
                        type: 'linear',
                        display: true,
                        position: 'right'
                    }]
                }
            };
        });
    };

    /*=== WATER HISTORY BY MONTH ===*/
    $scope.showWaterHistory_Month = function(){
        $scope.messData = '';
        $http.get(URL_GET_WATER_HISTORY_MONTH).then(function(response){
            if(response.data[0].length == 0){
                $scope.messData = 'No data';
            }
            subData = [];
            arrGardenId = [];

            for (var i=0; i<response.data[0].length; i++){
                subSubData = [];
                arrGardenId.push(response.data[0][i].plantName);

                subSubData.push(response.data[0][i].D1);
                subSubData.push(response.data[0][i].D2);
                subSubData.push(response.data[0][i].D3);
                subSubData.push(response.data[0][i].D4);
                subSubData.push(response.data[0][i].D5);
                subSubData.push(response.data[0][i].D6);
                subSubData.push(response.data[0][i].D7);
                subSubData.push(response.data[0][i].D8);
                subSubData.push(response.data[0][i].D9);
                subSubData.push(response.data[0][i].D10);
                subSubData.push(response.data[0][i].D11);
                subSubData.push(response.data[0][i].D12);
                subSubData.push(response.data[0][i].D13);
                subSubData.push(response.data[0][i].D14);
                subSubData.push(response.data[0][i].D15);
                subSubData.push(response.data[0][i].D16);
                subSubData.push(response.data[0][i].D17);
                subSubData.push(response.data[0][i].D18);
                subSubData.push(response.data[0][i].D19);
                subSubData.push(response.data[0][i].D20);
                subSubData.push(response.data[0][i].D21);
                subSubData.push(response.data[0][i].D22);
                subSubData.push(response.data[0][i].D23);
                subSubData.push(response.data[0][i].D24);
                subSubData.push(response.data[0][i].D25);
                subSubData.push(response.data[0][i].D26);
                subSubData.push(response.data[0][i].D27);
                subSubData.push(response.data[0][i].D28);
                subSubData.push(response.data[0][i].D29);
                subSubData.push(response.data[0][i].D30);
                subSubData.push(response.data[0][i].D31);

                subData.push(subSubData);
            }

            $scope.labels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
            $scope.series = arrGardenId;
            $scope.data = subData;

            $scope.onClick = function (points, evt) {
                console.log(points, evt);
            };
            $scope.dataSetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
            $scope.options = {
                scales: {
                    yAxes: [{
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left'
                    },
                    {
                        id: 'y-axis-2',
                        type: 'linear',
                        display: true,
                        position: 'right'
                    }]
                }
            };
        });
    };

    /*=== WATER HISTORY BY DAY ===*/
    $scope.showWaterHistory_Day = function(){
        $scope.messData = '';
        $http.get(URL_GET_WATER_HISTORY_DAY).then(function(response){
            if(response.data[0].length == 0){
                $scope.messData = 'No data';
            }
            subData = [];
            arrGardenId = [];

            for (var i=0; i<response.data[0].length; i++){
                subSubData = [];
                arrGardenId.push(response.data[0][i].plantName);

                subSubData.push(response.data[0][i].H1);
                subSubData.push(response.data[0][i].H2);
                subSubData.push(response.data[0][i].H3);
                subSubData.push(response.data[0][i].H4);
                subSubData.push(response.data[0][i].H5);
                subSubData.push(response.data[0][i].H6);
                subSubData.push(response.data[0][i].H7);
                subSubData.push(response.data[0][i].H8);
                subSubData.push(response.data[0][i].H9);
                subSubData.push(response.data[0][i].H10);
                subSubData.push(response.data[0][i].H11);
                subSubData.push(response.data[0][i].H12);
                subSubData.push(response.data[0][i].H13);
                subSubData.push(response.data[0][i].H14);
                subSubData.push(response.data[0][i].H15);
                subSubData.push(response.data[0][i].H16);
                subSubData.push(response.data[0][i].H17);
                subSubData.push(response.data[0][i].H18);
                subSubData.push(response.data[0][i].H19);
                subSubData.push(response.data[0][i].H20);
                subSubData.push(response.data[0][i].H21);
                subSubData.push(response.data[0][i].H22);
                subSubData.push(response.data[0][i].H23);
                subSubData.push(response.data[0][i].H24);

                subData.push(subSubData);
            }

            $scope.labels = ["01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "0:007", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "00:00"];
            $scope.series = arrGardenId;
            $scope.data = subData;

            $scope.onClick = function (points, evt) {
                console.log(points, evt);
            };
            $scope.dataSetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
            $scope.options = {
                scales: {
                    yAxes: [{
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left'
                    },
                    {
                        id: 'y-axis-2',
                        type: 'linear',
                        display: true,
                        position: 'right'
                    }]
                }
            };
        });
    };

    /*=== SIGN OUT ===*/
    $scope.signOut = function(){
        $window.localStorage.removeItem("username");
        $window.location.href = '/';
    };

    /*==== MAIN ====*/
    $scope.gardens = [];
    $scope.getAllGardens = function(){
        $http.get(URL_ALL_GARDEN).then(function(response){
            $scope.gardens = response.data;
            console.log($scope.gardens);
        });
    }

    if (userSignIn != null && userSignIn != ''){

        //Get data from sensor
        getHumidity(); // => change to get average ???
        getAvgSoilMoisture();
        getAvgWater();
        //getTemperature();

        //Show Graph
        $scope.showWaterHistory();
    }
    else{
        $window.localStorage.removeItem("username");
        $window.location.href = '/';
    }

});