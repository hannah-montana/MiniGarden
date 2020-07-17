viewGardenApp = angular.module('angViewGardenApp', ['ngAnimate', 'ui.bootstrap', 'chart.js', 'jkAngularRatingStars']);

viewGardenApp.controller('viewGardenController', ['$scope', '$http', '$uibModal', '$sce', '$window', function($scope, $http, $uibModal, $sce, $window){
    let host = 'http://localhost:3010';
    let socket = io.connect('http://localhost:3010')

    let URL_RUN_PYTHON = host + '/testCamera';
    let URL_ALL_GARDEN = host + '/getAllGardens';
    let URL_GARDEN_BY_USER_ID = host + '/getGardensByUserId?';
    let URL_VIDEO_STREAMING = host + '/videoStreaming?';
    let URL_CURRENT_PHOTO = host + '/currentPhoto?';
    let URL_ALL_PHOTOS = host + '/getAllPhotos?';
    let URL_GET_PHOTOS = host + '/getPhotos?';
    let URL_STOP_STREAMING = host + '/stop_python';
    let URl_GET_PLANTS_BY_GARDEN_ID = host + '/getPlantsByGardenId?';
    let URL_GET_SOIL_MOISTURE_EACH_KIND_OF_PLANT = host + '/getSoilMoistureOfEachKindOfPlant?';
    let URL_GET_MAX_HEIGHT_EACH_KING_OF_PLANT = host + '/getMaxHeightOfEachKindOfPlant?';

    let URL_GET_TEMPERATURE = host + '/getTemperature?';
    let URL_GET_HUMIDITY = host + '/getHumidity?';
    let URL_GET_SOIL_MOISTURE = host + '/getSoilMoisture?';
    let URL_GET_WATER = host + '/getWater?';

    let URL_HUMIDITY_CURRENT_YEAR = host + '/getHumidityCurrentYear?';
    let URL_SOIL_MOISTURE_CURRENT_YEAR = host + '/getSoilMoistureCurrentYear?';
    let URL_WATER_CURRENT_YEAR = host + '/getWaterCurrentYear?';
    let URL_TEMPERATURE_CURRENT_YEAR = host + '/geTemperatureCurrentYear?';

    let URL_GET_SHARING_HISTORY = host + '/getSharingHistory?';
    let URL_GET_SHARE_USERS = host + '/getShareUser?';
    let URL_INSERT_COMMENT = host + '/insertComment';

    let URL_START_STOP_SYSTEM = host + '/startStopSystem?';

    let URL_GET_SETTING = host + '/getSetting?';
    let URL_SAVE_SETTING = host + '/saveSetting';

    $scope.activeDashboard = "";
    $scope.activeViewGarden = "active";
    $scope.activePlants = "";
    $scope.activeUserProfile = "";
    $scope.activeGardens = "";

    $scope.gardens = [];
    $scope.photos = [];

    $scope.listGardens = {};
    $scope.gardenId = 0;

    $scope.loading = '';
    $scope.cardHeader = '';

    $scope.listenVideo = '';

    $scope.temperature = 0;
    $scope.humidity = 0;
    $scope.soilMoisture = 0;
    $scope.water = 0;

    $scope.sharingHistories = [];
    $scope.lstSharing = [];

    $scope.firstRate = 0;
    $scope.ownerGarden = 0;
    $scope.flagOwner = false;

    $scope.runningStatus = 0;
    $scope.flagStart = false;
    $scope.flagStop = false;

    $scope.mssSystem = '';

    /* General */
    $scope.getAllGardens = function(){
        $http.get(URL_GARDEN_BY_USER_ID + `userId=${$scope.userId}`).then(function(response){
            $scope.gardens = response.data[0];
            //console.log($scope.gardens);

            $scope.listGardens = {
                model: null,
                availableOptions: $scope.gardens
            };
        });
    };

    $scope.separateListGardenValue = function(){
        let hyphen = $scope.listGardens.model.indexOf('-');
        let hashtag = $scope.listGardens.model.indexOf('#');

        $scope.ownerGarden = $scope.listGardens.model.substr(0, 1);
        $scope.gardenId = $scope.listGardens.model.substr(2, hyphen - 2);
        $scope.hostname = $scope.listGardens.model.substr(hyphen + 1, $scope.listGardens.model.length - 6);
        $scope.runningStatus = $scope.listGardens.model.substr(hashtag + 1, 1);

        if ($scope.ownerGarden == 1)
            $scope.flagOwner = true;
        else
            $scope.flagOwner = false;

        if ($scope.runningStatus == 1){
            $scope.flagStart = false;
            $scope.flagStop = true;
            $scope.mssSystem = 'System is running . . .';
        }
        else {
            $scope.flagStart = true;
            $scope.flagStop = false;
            $scope.mssSystem = '';
        }
    };

    $scope.selectedGarden = function(){
        $scope.stopStreaming();
        $scope.separateListGardenValue();

        $scope.listenVideo = 'toClient_video' + $scope.hostname;

        /* Listen to the image file from server */
        socket.on($scope.listenVideo, function(data){
            console.log(data);
            //$scope.loading = '';
            $scope.imgVideo = '/python/video/' + data + '.jpg';
            console.log($scope.imgVideo);

            var img = document.getElementById("liveImg");
            img.src = $scope.imgVideo;
        });
    };

    /* Start - Stop system */
    $scope.startSystem = function(){
        /*  1. Start get photo regularly
            2. Watering (depend on setting):
                    - during a time
                    - dripping
                    - by sensor
            3. Get temperature regularly
            4. Get humidity regularly
        */

        /* last step: update running status for garden */
        /* Update in comment after start ??? not done */
        $http.get(URL_START_STOP_SYSTEM + `gardenId=${$scope.gardenId}&value=1`).then(function(response){
            if (response.data != 1){
                $scope.alertDialog('Warning', 'System Error.');
                return;
            }
            $scope.flagStart = false;
            $scope.flagStop = true;
            $scope.mssSystem = 'System is running . . .';
        });
    };

    $scope.stopSystem = function(){
        /* Stop everything */

        /* last step: update running status for garden */
        /* Update in comment after start ??? not done */
        $http.get(URL_START_STOP_SYSTEM + `gardenId=${$scope.gardenId}&value=0`).then(function(response){
            if (response.data != 1){
                $scope.alertDialog('Warning', 'System Error.');
                return;
            }
            $scope.flagStart = true;
            $scope.flagStop = false;
            $scope.mssSystem = '';
        });
    };

    /* Current photo */
    $scope.imgCurrentPhoto = '/img/no-image.png';
    $scope.currentPhoto = function(){
        $scope.stopStreaming();
        if($scope.listGardens.model != null){
            x.style.display = "block";
            y.style.display = "none";
            z.style.display = "none";
            o.style.display = "none";
            s.style.display = "none";
            t.style.display = "none";
            a.style.display = "none";
            $scope.cardHeader = 'Current Photo';

            $scope.loading = 'Loading . . . ';
            $scope.imgCurrentPhoto = '/img/no-image.png';
            console.log('current photo');
            $http.get(URL_CURRENT_PHOTO + `hostname=${$scope.hostname}`).then(function(response){
                //console.log(response);
                if (response.data == -1){
                    $scope.alertDialog('Warning', 'Error! Cannot connect RaspBerry. Please make sure you turn on this device.');
                    $scope.loading = '';
                    return;
                }
                console.log(response.data);
                $scope.imgCurrentPhoto = '/python/currentPhoto/' + response.data;
                $scope.loading = '';
            });
        }
        else {
            $scope.alertDialog('Warning', 'Please choose a garden.');
        }
    }

    /* Gallery */
    $scope.from = new Date();
    $scope.from.setDate($scope.from.getDate() - 10);
    $scope.to = new Date();

    $scope.filterPhotos = function(){
        $scope.loading = 'Loading . . . ';
        let date_from = '';
        let date_to = '';

        if ($scope.from != undefined){
            let d = $scope.from.getDate();
            let m = $scope.from.getMonth() + 1;
            let y = $scope.from.getFullYear();
            if (d < 10)
                d = '0' + d;
            if (m < 10)
                m = '0' + m;
            date_from = y + '-' + m + '-' + d + ' 00:00:00';
        }
        if($scope.to != undefined){
            let d = $scope.to.getDate();
            let m = $scope.to.getMonth() + 1;
            let y = $scope.to.getFullYear();
            if (d < 10)
                d = '0' + d;
            if (m < 10)
                m = '0' + m;
            date_to = y + '-' + m + '-' + d + ' 23:59:00';
        }
        if (new Date(date_to) < new Date(date_from)){
            $scope.alertDialog('Warning', 'From date have to less than To date.');
            return;
        }
        $http.get(URL_GET_PHOTOS + `gardenId=${$scope.gardenId}&from_date=${date_from}&to_date=${date_to}`).then(function(response){
            $scope.photos = response.data;
            $scope.loading = '';
        });
    };

    $scope.allPhotos = function(){
        let from_date = '';
        let to_date = '';

        $http.get(URL_ALL_PHOTOS + `gardenId=${$scope.gardenId}`).then(function(response){
            $scope.photos = response.data;
        });
    };

    $scope.viewGallery = function(){
        $scope.stopStreaming();
        if($scope.listGardens.model != null){
            x.style.display = "none";
            y.style.display = "block";
            z.style.display = "none";
            o.style.display = "none";
            s.style.display = "none";
            t.style.display = "none";
            a.style.display = "none";
            $scope.cardHeader = 'Garden Gallery';

            $scope.filterPhotos();
        }
        else {
            $scope.alertDialog('Warning', 'Please choose a garden.');
        }
    };

    /* Stream video */
    $scope.hostname = '';

    $scope.videoStreaming = function(){
        $scope.stopStreaming();
        console.log('start video');
        if($scope.listGardens.model != null){
            x.style.display = "none";
            y.style.display = "none";
            z.style.display = "block";
            o.style.display = "none";
            s.style.display = "block";
            t.style.display = "none";
            a.style.display = "none";

            $scope.cardHeader = 'Video Streaming';
            $scope.loading = 'Streaming . . . ';

            //NEED ???
            //1. client emit a request streaming to server
            //2. server listen and proceed running python script
            //3. server emit image data
            //4. client listen and display to web
            //let request_streaming = $scope.hostname + 'requestStreaming';
            //console.log(request_streaming);
            //socket.emit(request_streaming, $scope.orderId);

            if ($scope.gardenId != null){
                $http.get(URL_VIDEO_STREAMING + `hostname=${$scope.hostname}`).then(function(response){
                    console.log(response);

                    if (response.data == -1){
                        $scope.alertDialog('Warning', 'Error! Cannot connect RaspBerry. Please make sure you turn on this device.');
                        return;
                    }
                });
            }
        }
        else {
            $scope.alertDialog('Warning', 'Please choose a garden.');
        }
    };

    /* Stop video streaming */
    $scope.stopStreaming = function(){
        $http.get(URL_STOP_STREAMING).then(function(response){
            console.log(response);
        });
    };

    /* Setting */
    var i_t = document.getElementById("i_time");
    var i_s = document.getElementById("i_sensor");
    i_t.style.display = "none";
    i_s.style.display = "none";
    $scope.rbt_time = false;
    $scope.rbt_sensor = false;

    $scope.modelTimeCapture = 0;
    $scope.modelNumDay = 0;
    $scope.modelTimeWater = 0;
    $scope.waterMethod = '';

    // initial for time capture
    $scope.timeCaptures = [
        {value: 3, name: '3 hours'},
        {value: 6, name: '6 hours'},
        {value: 12, name: '12 hours'},
        {value: 24, name: '1 day'},
        {value: 48, name: '2 days'},
        {value: 72, name: '3 days'}
    ];
    // initial for number of day
    $scope.numDays = [
        {value: 1, name: '1 day'},
        {value: 2, name: '2 days'},
        {value: 3, name: '3 days'},
        {value: 4, name: '4 days'},
        {value: 5, name: '5 days'}
    ];

    // initial for time water
    $scope.timeWaters = [
        {value: 5, name: '5 seconds'},
        {value: 10, name: '10 seconds'},
        {value: 30, name: '30 seconds'},
        {value: 60, name: '1 minute'},
        {value: 180, name: '3 minutes'},
        {value: 300, name: '5 minutes'},
        {value: 600, name: '10 minutes'},
        {value: 900, name: '15 minutes'},
        {value: 1200, name: '20 minutes'}
    ];

    $scope.setting = function(){
        $scope.stopStreaming();

        if($scope.listGardens.model != null){
            x.style.display = "none";
            y.style.display = "none";
            z.style.display = "none";
            o.style.display = "block";
            s.style.display = "none";
            t.style.display = "none";
            a.style.display = "none";
            $scope.cardHeader = 'SETTING';

            // get setting information
            $http.get(URL_GET_SETTING + `gardenId=${$scope.gardenId}`).then(function(response){
                if(response.data != null){
                    console.log(response.data[0]);
                    $scope.modelTimeCapture = response.data[0].timeCapturePhoto;
                    $scope.modelNumDay = response.data[0].numberDay;
                    $scope.modelTimeWater = response.data[0].timeWater;
                    if (response.data[0].waterMethod == 't'){
                        $scope.rbt_time = true;
                        $scope.rbt_sensor = false;
                    }
                    else{
                        $scope.rbt_time = false;
                        $scope.rbt_sensor = true;
                    }
                }
            });

            //get watering information
            setTimeout(function(){
                if ($scope.rbt_time == true){
                    i_t.style.display = "block";
                    i_s.style.display = "none";
                    $scope.rbt_sensor = false;
                }
                else if ($scope.rbt_sensor == true){
                    i_t.style.display = "none";
                    i_s.style.display = "block";
                    $scope.rbt_time = false;
                }
            }, 300);
        }
        else {
            $scope.alertDialog('Warning', 'Please choose a garden.');
            return;
        }
    };

    $scope.changeSetting = function(value){
        console.log(value);
        if (value == 'byTime'){
            i_t.style.display = "block";
            i_s.style.display = "none";
            $scope.rbt_time = true;
            $scope.rbt_sensor = false;
        }
        else{
            i_t.style.display = "none";
            i_s.style.display = "block";
            $scope.rbt_time = false;
            $scope.rbt_sensor = true;
        }
    };

    $scope.settingModel = {};
    $scope.saveSetting = function(){
        //alert('save');
        console.log($scope.rbt_time);
        if ($scope.rbt_time == true)
            $scope.waterMethod = 't';
        else
            $scope.waterMethod = 's';
        $scope.settingModel = {
            gardenId: $scope.gardenId,
            userId: $scope.userId,
            waterMethod: $scope.waterMethod,
            timeCapturePhoto: $scope.modelTimeCapture,
            numberDay: $scope.modelNumDay,
            timeWater: $scope.modelTimeWater
        };
        console.log($scope.settingModel);
        $http.post(URL_SAVE_SETTING, $scope.settingModel).then(function(response){
            if (response.data == 1){
                $scope.alertDialog("Successful", "Setting information is updated.");
            }
            else{
                $scope.alertDialog("Warning", "Error! Cannot save setting information.");
            }
        });
    };

    /* Action */
    $scope.action = function(){
        $scope.stopStreaming();
        if($scope.listGardens.model != null){
            x.style.display = "none";
            y.style.display = "none";
            z.style.display = "none";
            o.style.display = "none";
            s.style.display = "none";
            t.style.display = "none";
            a.style.display = "block";

            $scope.cardHeader = 'Action';
            $scope.loading = '';

            $scope.loadSharingHistory();
            $scope.listSharing();
        }
        else {
            $scope.alertDialog('Warning', 'Please choose a garden.');
        }
    };

    $scope.addComment = function(){
        if ($scope.comment == undefined || $scope.comment == ''){
            $scope.alertDialog('Warning', 'Please insert your opinion.');
            return;
        }
        let date = new Date();
        let d = date.getDate();
        let m = date.getMonth() + 1;
        let y = date.getFullYear();
        let h = date.getHours();
        let mi = date.getMinutes();
        let s = date.getSeconds();

        if (d < 10)
            d = '0' + d;
        if (m < 10)
            m = '0' + m;
        let dateAction = y + '-' + m + '-' + d + ' ' + h + ':' + mi + ':' + s;

        let sharingHistory = {
            gardenId: $scope.gardenId,
            userId: $scope.userId,
            userFullName: $scope.userFullName,
            comment: $scope.comment,
            dateAction: dateAction,
            rate: $scope.firstRate
        };

        $http.post(URL_INSERT_COMMENT, sharingHistory).then(function(response){
            if (response.data == 1){
                $scope.alertDialog("Successful", "Thank you for your advice.");
                $scope.loadSharingHistory();
                $scope.comment = '';
                $scope.firstRate = 0;
            }
        });
    };

    $scope.listSharing = function(){
        $scope.lstSharing = [];

        $http.get(URL_GET_SHARE_USERS + `gardenId=${$scope.gardenId}&userId=${$scope.userId}`).then(function (response1) {
            let children = {};
            for(var j=0; j<response1.data[0].length; j++){
                children = {
                    userId: response1.data[0][j].userId,
                    userFullName: response1.data[0][j].userFullName,
                    photo: response1.data[0][j].photo
                };
                $scope.lstSharing.push(children);
            }
        });
    };

    $scope.loadSharingHistory = function(){
        $scope.sharingHistories = [];
        $http.get(URL_GET_SHARING_HISTORY + `gardenId=${$scope.gardenId}`).then(function (response) {
            if(response.data != null){
                for(var i=0; i<response.data.length; i++){
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

    $scope.editSharingPeople = function(){
        $scope.sharingDialog("Sharing Information", $scope.gardenId, $scope.userId);
    };

    $scope.statistic = function(){
        $scope.stopStreaming();
        if($scope.listGardens.model != null){
            x.style.display = "none";
            y.style.display = "none";
            z.style.display = "none";
            o.style.display = "none";
            s.style.display = "none";
            t.style.display = "block";
            a.style.display = "none";

            $scope.cardHeader = 'Statistic';
            $scope.loading = 'Loading . . . ';

            /*let hyphen = $scope.listGardens.model.indexOf('-');
            $scope.gardenId = $scope.listGardens.model.substr(0, hyphen);
            $scope.hostname = $scope.listGardens.model.substr(hyphen + 1, $scope.listGardens.model.length);*/

            /*--- get data from sensor ---*/
            //get current temperature
            $http.get(URL_GET_TEMPERATURE + `hostname=${$scope.hostname}`).then(function(response){
                //if (response.data[0] != ''){
                console.log(response);
                if (response.data[0] != null){
                    let comma = response.data[0].indexOf(',');
                    let temp = response.data[0].substr(1, comma - 1);
                    $scope.temperature = temp;
                    $scope.loading = '';
                }
            });

            //get current humidity
            $http.get(URL_GET_HUMIDITY + `gardenId=${$scope.gardenId}`).then(function(response){
                if (response.data[0] != null){
                    $scope.humidity = response.data[0][0].value;
                }
            });

            //get current soil moisture
            $http.get(URL_GET_SOIL_MOISTURE + `gardenId=${$scope.gardenId}`).then(function(response){
                if (response.data[0] != null){
                    $scope.soilMoisture = response.data[0][0].value;
                }
            });

            //get total water
            $http.get(URL_GET_WATER + `gardenId=${$scope.gardenId}`).then(function(response){
                if (response.data[0] != null){
                    $scope.water = response.data[0][0].value;
                }
            });

            //draw chart
            $scope.chartHumidity();
            $scope.chartSoilMoisture();
            $scope.chartWater();
            $scope.chartTemperature();

            $scope.chartTypeOfDifferentPlants();
            $scope.chartSoilMoistureEachKindOfPlant();
            $scope.chartMaxHeightEachKindOfPlant();
        }
        else {
            $scope.alertDialog('Warning', 'Please choose a garden.');
        }
    };

    $scope.chartHumidity = function(){
        $http.get(URL_HUMIDITY_CURRENT_YEAR + `gardenId=${$scope.gardenId}`).then(function(response){
            if(response.data[0].length == 0){
                //$scope.messData = 'No data';
                return;
            }
            let data = [];
            let subData = [];
            let labels = [];

            for(var i=0; i<response.data[0].length; i++){
                subData.push(response.data[0][i].avgValue);
                labels.push(response.data[0][i].M);
            }
            data.push(subData);

            $scope.labels_humidity = labels;
            $scope.series_humidity = ['Humid'];
            $scope.data_humidity = data;

            $scope.labels_cor_humid_temp = labels;
            $scope.series_cor_humid_temp = ['Humid'];
            $scope.data_cor_humid_temp = data;

        });
    };

    $scope.chartSoilMoisture = function(){
        $http.get(URL_SOIL_MOISTURE_CURRENT_YEAR + `gardenId=${$scope.gardenId}`).then(function(response){
            if(response.data[0].length == 0){
                //$scope.messData = 'No data';
                return;
            }
            let data = [];
            let subData = [];
            let labels = [];

            for(var i=0; i<response.data[0].length; i++){
                subData.push(response.data[0][i].avgValue);
                labels.push(response.data[0][i].M);
            }
            data.push(subData);

            $scope.labels_soilMoisture = labels;
            $scope.series_soilMoisture = ['Soil moisture'];
            $scope.data_soilMoisture = data;
        });

    };

    $scope.chartTemperature = function(){
        $http.get(URL_TEMPERATURE_CURRENT_YEAR + `gardenId=${$scope.gardenId}`).then(function(response){
            if(response.data[0].length == 0){
                //$scope.messData = 'No data';
                return;
            }
            let data = [];
            let subData = [];
            let labels = [];

            for(var i=0; i<response.data[0].length; i++){
                subData.push(response.data[0][i].avgValue);
                labels.push(response.data[0][i].M);
            }
            data.push(subData);

            $scope.labels_temperature = labels;
            $scope.series_temperature = ['Temperature'];
            $scope.data_temperature = data;

            //$scope.labels_cor_humid_temp.push(labels);
            //$scope.data_cor_humid_temp.push(subData);
            //$scope.series_cor_humid_temp.push('Temperature');
        });
    };

    $scope.chartWater = function(){
        $http.get(URL_WATER_CURRENT_YEAR + `gardenId=${$scope.gardenId}`).then(function(response){
            if(response.data[0].length == 0){
                //$scope.messData = 'No data';
                return;
            }
            let data = [];
            let subData = [];
            let labels = [];

            for(var i=0; i<response.data[0].length; i++){
                subData.push(response.data[0][i].avgValue);
                labels.push(response.data[0][i].M);
            }
            data.push(subData);

            $scope.labels_water = labels;
            $scope.series_water = ['Water'];
            $scope.data_water = data;
        });
    };

    $scope.chartTypeOfDifferentPlants = function(){
        $http.get(URl_GET_PLANTS_BY_GARDEN_ID + `gardenId=${$scope.gardenId}`).then(function(response){
            if(response.data != null){
                let data = [];
                let labels = [];

                for(var i=0; i<response.data[0].length; i++){
                    data.push(response.data[0][i].amount);
                    labels.push(response.data[0][i].name);
                }

                $scope.labels_type_of_plants = labels;
                $scope.data_type_of_plants = data;
            }
        });
    };

    $scope.chartSoilMoistureEachKindOfPlant = function(){
        $http.get(URL_GET_SOIL_MOISTURE_EACH_KIND_OF_PLANT + `gardenId=${$scope.gardenId}`).then(function(response){
            if(response.data != null){
                let data = [];
                let labels = [];
                let subData = [];

                for(var i=0; i<response.data[0].length; i++){
                    data.push(response.data[0][i].standardSoilMoisture);
                    labels.push(response.data[0][i].name);
                }
                //data.push(subData);

                $scope.labels_moisture_type_of_plants = labels;
                $scope.data_moisture_type_of_plants = data;
                $scope.series_moisture_type_of_plants = ['Moisture'];
            }
        });
    };

    $scope.chartMaxHeightEachKindOfPlant = function(){
        $http.get(URL_GET_MAX_HEIGHT_EACH_KING_OF_PLANT + `gardenId=${$scope.gardenId}`).then(function(response){
            if(response.data != null){
                let data = [];
                let labels = [];
                let subData = [];

                for(var i=0; i<response.data[0].length; i++){
                    data.push(response.data[0][i].maxHeight);
                    labels.push(response.data[0][i].name);
                }
                //data.push(subData);

                $scope.labels_max_height_type_of_plants = labels;
                $scope.data_max_height_type_of_plants = data;
                //$scope.series_max_height_type_of_plants = ['Max height'];
            }
        });
    };

    $scope.correlate_humidity_temperature = function(){
        console.log($scope.labels_cor_humid_temp);
        console.log($scope.series_cor_humid_temp);
        console.log($scope.data_cor_humid_temp);

        let labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
        let series = ['Series A', 'Series B'];

        let data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
        ];

        console.log(labels);
        console.log(series);
        console.log(data);

        $scope.labels_correlate_humid_temp = $scope.labels_cor_humid_temp;
        $scope.series_correlate_humid_temp = $scope.series_cor_humid_temp;
        $scope.data_correlate_humid_temp = $scope.data_cor_humid_temp;
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

            /*if (response == 'delete'){
                $scope.proceedDelete();
            }*/
        });
    };

    /*=== Sharing users ===*/
    $scope.sharingDialog = function(header, gardenId, userId) {
        let modalInstance =  $uibModal.open({
            templateUrl: "myModalSharing.html",
            controller: "ModalSharingCtrl",
            size: "clg",
            resolve: {
                header: function () {
                    return header;
                },
                gardenId: function () {
                    return gardenId;
                },
                userId: function () {
                    return userId;
                }
            }
        });
        modalInstance.result.then(function(response){
            $scope.result = `${response} button hitted`;

            if (response == 'ok'){
                $scope.listSharing();
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
    $scope.userFullName = $window.localStorage.getItem("userFullName");
    $scope.userPhoto = $window.localStorage.getItem("userPhoto");

    $scope.getAllGardens();
    var x = document.getElementById("i_currentPhoto");
    var y = document.getElementById("i_gallery");
    var z = document.getElementById("i_videoStreaming");
    var o = document.getElementById("i_setting");
    var s = document.getElementById("i_stop");
    var t = document.getElementById("i_statistic");
    var a = document.getElementById("i_action");
    x.style.display = "none";
    y.style.display = "none";
    z.style.display = "none";
    o.style.display = "none";
    s.style.display = "none";
    t.style.display = "none";
    a.style.display = "none";
}]);

viewGardenApp.controller('ModalContentCtrl', function($scope, $http, $uibModalInstance, header, content) {

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

viewGardenApp.controller('ModalSharingCtrl', function($scope, $http, $uibModalInstance, $window, $uibModal, header, gardenId, userId) {
    let host = 'http://localhost:3010';
    let URL_GET_SHARING_USERS = host + '/getSharingUser?';
    let URL_GET_USERS_NOT_IN_SHARING_LIST = host + '/getUserNotInSharingList?';
    let URL_UPDATE_SHARING_GARDEN = host + '/updateSharingGarden?';

    $scope.gardenId = gardenId;
    $scope.userId = userId;
    $scope.userFullName = $window.localStorage.getItem("userFullName");
    $scope.userPhoto = $window.localStorage.getItem("userPhoto");

    $scope.alertHeader = header;
    $scope.showOK = true;
    $scope.showCancel = true;
    $scope.showConfirmDelete = false;
    $scope.showAddShare = true;
    $scope.showRemoveShare = true;

    $scope.lstSharing = [];
    $scope.lstNotSharing = [];

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

        console.log($scope.lstSharing);
        //save to gardenSharing
        $http.post(URL_UPDATE_SHARING_GARDEN + `gardenId=${$scope.gardenId}`, $scope.lstSharing).then(function(response){
            if (response.data == 1){
                $scope.alertDialog("Successful", "Updated list sharing.");
            }
        });
    };

    $scope.cancel = function() {
        $uibModalInstance.close('cancel');
    };

    $scope.delete = function () {
        $uibModalInstance.close('delete');
    };

    $scope.listSharing = function(){
        $scope.lstSharing = [];

        $http.get(URL_GET_SHARING_USERS + `gardenId=${$scope.gardenId}&userId=${$scope.userId}`).then(function (response) {
            if(response.data != null){
                $scope.lstSharing = response.data[0];
            }
        });
    };

    $scope.listNotSharing = function(){
        $scope.lstNotSharing = [];

        $http.get(URL_GET_USERS_NOT_IN_SHARING_LIST + `gardenId=${$scope.gardenId}&userId=${$scope.userId}`).then(function (response) {
            if(response.data != null){
                $scope.lstNotSharing = response.data[0];
            }
        });
    };

    $scope.selectedRight = null;
    $scope.selectedLeft = null;
    $scope.userFromLeft = null;
    $scope.userFromRight = null;

    $scope.setClickedRight = function(index, user){
        $scope.selectedRight = index;
        $scope.userFromRight = user;
        //console.log(user);
    };

    $scope.setClickedLeft = function(index, user){
        $scope.selectedLeft = index;
        $scope.userFromLeft = user;
        //console.log(user);
    };

    $scope.leftToRight = function(){
        if($scope.userFromLeft != null){
            //splice from left
            $scope.lstNotSharing.splice($scope.selectedLeft, 1);

            //add to right
            $scope.lstSharing.push($scope.userFromLeft);
        }
        else {
            $scope.alertDialog("Warning", "Please choose 1 user.");
        }
        $scope.userFromLeft = null;
        $scope.selectedLeft = null;
    };

    $scope.rightToLeft = function(){
        if($scope.userFromRight.owner == 1){
            $scope.alertDialog("Warning", "You cannot remove owner.");
            return;
        }
        if($scope.userFromRight != null){
            //splice from right
            $scope.lstSharing.splice($scope.selectedRight, 1);

            //add to left
            $scope.lstNotSharing.push($scope.userFromRight);
        }
        else{
            $scope.alertDialog("Warning", "Please choose 1 user.");
        }
        $scope.userFromRight = null;
        $scope.selectedRight = null;
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
        });
    };

    /*=== MAIN ===*/
    $scope.listSharing();
    $scope.listNotSharing();
});