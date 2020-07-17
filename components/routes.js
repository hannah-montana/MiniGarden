module.exports = (app, db, CryptoJS, exec, PythonShell, io) => {
    /*======== CSS =========*/
    /*app.get('/bootstrap.css', function(req, res) {
        res.setHeader('Content-Type', 'text/css');
        res.sendFile( __dirname + '/css' + '/bootstrap.css');
    });*/

    /*======== JS =========*/
    app.get('/Chart.min.js', function(req, res) {
        res.setHeader('Content-Type', 'application/javascript');
        res.sendFile((__dirname.substring(0, __dirname.length - 11).split('\\').join('/'))
                             + '/node_modules/chart.js/dist/Chart.min.js');
    });

    app.get('/angular-chart.min.js', function(req, res) {
        res.setHeader('Content-Type', 'application/javascript');
        res.sendFile((__dirname.substring(0, __dirname.length - 11).split('\\').join('/'))
                             + '/node_modules/angular-chart.js/dist/angular-chart.min.js');
    });

    app.get('/ng-file-upload-shim.min.js', function(req, res) {
        res.setHeader('Content-Type', 'application/javascript');
        res.sendFile((__dirname.substring(0, __dirname.length - 11).split('\\').join('/'))
                             + '/node_modules/ng-file-upload/dist/ng-file-upload-shim.min.js');
    });

    app.get('/ng-file-upload.min.js', function(req, res) {
        res.setHeader('Content-Type', 'application/javascript');
        res.sendFile((__dirname.substring(0, __dirname.length - 11).split('\\').join('/'))
                             + '/node_modules/ng-file-upload/dist/ng-file-upload.min.js');
    });

    app.get('/chartist.min.js', function(req, res) {
        // send the angular app
        res.setHeader('Content-Type', 'application/javascript');
        res.sendFile( __dirname + '/js/plugins' + '/chartist.min.js');
    });

    app.get('/ui-bootstrap-tpls-2.5.0.js', function(req, res) {
        // send the angular app
        res.setHeader('Content-Type', 'application/javascript');
        res.sendFile( __dirname + '/js' + '/ui-bootstrap-tpls-2.5.0.js');
    });

    app.get('/angular-animate.js', function(req, res) {
        res.setHeader('Content-Type', 'application/javascript');
        res.sendFile((__dirname.substring(0, __dirname.length - 11).split('\\').join('/'))
                             + '/node_modules/angular-animate/angular-animate.js');
    });

    app.get('/angular.js', function(req, res) {
        // send the angular app
        res.setHeader('Content-Type', 'application/javascript');
        res.sendFile( __dirname + '/js' + '/angular.js');
    });

    /*========= NG FILE =========*/
    // inject to http request
    app.get('/ngDashboard.js', function(req, res) {
        // send the angular app
        res.setHeader('Content-Type', 'application/javascript');
        res.sendFile( __dirname + '/javascript' + '/ngDashboard.js');
    });

    app.get('/ngSignin.js', function(req, res) {
        // send the angular app
        res.setHeader('Content-Type', 'application/javascript');
        res.sendFile( __dirname + '/javascript' + '/ngSignin.js');
    });

    app.get('/ngPlants.js', function(req, res) {
        res.setHeader('Content-Type', 'application/javascript');
        res.sendFile( __dirname + '/javascript' + '/ngPlants.js');
    });

    app.get('/ngViewGarden.js', function(req, res) {
        // send the angular app
        res.setHeader('Content-Type', 'application/javascript');
        res.sendFile( __dirname + '/javascript' + '/ngViewGarden.js');
    });

    app.get('/ngUserProfile.js', function(req, res) {
        // send the angular app
        res.setHeader('Content-Type', 'application/javascript');
        res.sendFile( __dirname + '/javascript' + '/ngUserProfile.js');
    });

    app.get('/ngGardens.js', function(req, res) {
        // send the angular app
        res.setHeader('Content-Type', 'application/javascript');
        res.sendFile( __dirname + '/javascript' + '/ngGardens.js');
    });

    app.get('/test.js', function(req, res) {
        // send the angular app
        res.setHeader('Content-Type', 'application/javascript');
        res.sendFile( __dirname + '/javascript' + '/test.js');
    });

    app.get('/test', function(req, res){
        res.setHeader('Content-Type', 'text/html');
        res.sendFile(__dirname + '/views' + '/test.html');
    });

    /*=========== Main Menu ============*/
    app.get('/', function(req, res){
        res.setHeader('Content-Type', 'text/html');
        res.sendFile(__dirname + '/views' + '/signin.html');
    });

    app.get('/logo', function(req, res){
        res.setHeader('Content-Type', 'text/html');
        res.sendFile(__dirname + '/views' + '/logo.html');
    });

    app.get('/sideBar', function(req, res){
        res.setHeader('Content-Type', 'text/html');
        res.sendFile(__dirname + '/views' + '/sideBar.html');
    });

    app.get('/navbar', function(req, res){
        res.setHeader('Content-Type', 'text/html');
        res.sendFile(__dirname + '/views' + '/navbar.html');
    });

    app.get('/footer', function(req, res){
        res.setHeader('Content-Type', 'text/html');
        res.sendFile(__dirname + '/views' + '/footer.html');
    });

    app.get('/dashboard', function(req, res){
        res.setHeader('Content-Type', 'text/html');
        res.sendFile(__dirname + '/views' + '/dashboard.html');
    });

    app.get('/viewGarden', function(req, res){
        res.setHeader('Content-Type', 'text/html');
        res.sendFile(__dirname + '/views' + '/viewGarden.html');
    });

    app.get('/plants', function(req, res){
        res.setHeader('Content-Type', 'text/html');
        res.sendFile(__dirname + '/views' + '/plants.html');
    });

    app.get('/userProfile', function(req, res){
        res.setHeader('Content-Type', 'text/html');
        res.sendFile(__dirname + '/views' + '/userProfile.html');
    });

    app.get('/gardens', function(req, res){
        res.setHeader('Content-Type', 'text/html');
        res.sendFile(__dirname + '/views' + '/gardens.html');
    });

    /*=========== USERS ============*/
    app.get('/allUsers', function(req, res){
        let sql = "SELECT * FROM users";

        let processSQL = function(err, result){
            if(err) throw err;
            res.json(result);
        };
        db.query(sql, processSQL);
    });

    app.get('/user', function(req, res){
        let username = (req.query.username);
        let pass = (req.query.pass);
        console.log(pass);

        let decryptedPass = CryptoJS.AES.decrypt(pass, '123').toString(CryptoJS.enc.Utf8);

        //console.log('decrypted');
        //console.log(decryptedPass);

        let sql = "SELECT * FROM users WHERE username = ? AND password = ?";
        let values = [username, decryptedPass];

        let processSQL = function(err, result){
            if (err) throw err;
            //console.log(result);
            res.json(result);
        };
        db.query(sql, values, processSQL);

    });

    app.get('/userByUserId', function(req, res){
        let userId = (req.query.userId);

        let sql = "SELECT * FROM users WHERE id = ?";
        let values = [userId];

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(result);
        };
        db.query(sql, values, processSQL);

    });

    app.post('/updateUser', function(req, res){
        let sql = "";
        let values = [];
        if (req.body.password != undefined && req.body.password != ''){
            sql = "UPDATE users"
                + " SET username = ?, password = ?, email = ?, firstName = ?, lastName = ?, address = ?, city = ?, country = ?, zipcode = ?, description = ?, photo = ?"
                + " WHERE id = ?";
            values = [req.body.username, req.body.password, req.body.email, req.body.firstName, req.body.lastName, req.body.address, req.body.city, req.body.country, req.body.zipcode, req.body.description, req.body.photo, req.body.id];
        }
        else {
            sql = "UPDATE users"
                + " SET username = ?, email = ?, firstName = ?, lastName = ?, address = ?, city = ?, country = ?, zipcode = ?, description = ?, photo = ?"
                + " WHERE id = ?";
            values = [req.body.username, req.body.email, req.body.firstName, req.body.lastName, req.body.address, req.body.city, req.body.country, req.body.zipcode, req.body.description, req.body.photo, req.body.id];
        }
        //console.log(sql);
        let processSQL = function(err, result){
            if (err) throw err;
            res.json(1);
        }

        db.query(sql, values, processSQL);
    });

    /* Start - stop system */
    app.get('/startStopSystem', function(req, res){
        let gardenId = req.query.gardenId;
        let value = req.query.value;

        let sql = 'UPDATE gardens SET running = ? WHERE id = ?';
        let values = [value, gardenId];

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(1);
        };
        db.query(sql, values, processSQL);
    });

    /* Get sharing */
    app.get('/getSharing', function(req, res){
        let userId = (req.query.userId);

        let sql = "CALL getSharing(?)";
        let values = [userId];

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(result);
        };
        db.query(sql, values, processSQL);
    });

    app.get('/numberSharingGarden', function(req, res){
        let userId = (req.query.userId);

        let sql = "CALL numberSharingGarden(?)";
        let values = [userId];

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(result);
        };
        db.query(sql, values, processSQL);
    });

    app.get('/numberSharingPeople', function(req, res){
        let userId = (req.query.userId);

        let sql = "CALL numberSharingPeople(?)";
        let values = [userId];

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(result);
        };
        db.query(sql, values, processSQL);
    });

    app.get('/getCareGarden', function(req, res){
        let userId = (req.query.userId);

        let sql = "CALL getCareGarden(?)";
        let values = [userId];

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(result);
        };
        db.query(sql, values, processSQL);
    });

    app.get('/getShareUser', function(req, res){
        let gardenId = (req.query.gardenId);
        let userId = (req.query.userId);

        let sql = "CALL getShareUser(?, ?)";
        let values = [gardenId, userId];

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(result);
        };
        db.query(sql, values, processSQL);
    });

    app.get('/getSharingUser', function(req, res){
        let gardenId = (req.query.gardenId);
        let userId = (req.query.userId);

        let sql = "CALL getSharingUser(?, ?)";
        let values = [gardenId, userId];

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(result);
        };
        db.query(sql, values, processSQL);
    });

    app.get('/getUserNotInSharingList', function(req, res){
        let gardenId = (req.query.gardenId);
        let userId = (req.query.userId);

        let sql = "CALL getUserNotInSharingList(?, ?)";
        let values = [gardenId, userId];

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(result);
        };
        db.query(sql, values, processSQL);
    });

    app.get('/getSharingHistory', function(req, res){
        let gardenId = (req.query.gardenId);

        let sql = "select * from sharinghistory where gardenId = ? order by dateAction desc";
        let values = [gardenId];

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(result);
        };
        db.query(sql, values, processSQL);
    });

    app.get('/getGeneralInformationGarden', function(req, res){
        let gardenId = (req.query.gardenId);

        let sql = "CALL getGeneralInformationGarden(?)";
        let values = [gardenId];

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(result);
        };
        db.query(sql, values, processSQL);
    });

    app.post('/insertComment', function(req, res){
        let sql = "INSERT INTO sharinghistory (gardenId, userId, userFullName, comment, dateAction, rate)"
                + " VALUES (?, ?, ?, ?, ?, ?)";
        let values = [req.body.gardenId, req.body.userId, req.body.userFullName, req.body.comment, req.body.dateAction, req.body.rate];

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(1);
        }
        db.query(sql, values, processSQL);
    });

    app.post('/updateSharingGarden', function(req, res){
        let gardenId = req.query.gardenId;
        let objs = req.body;

        //1. delete everything in gardensharing
        let sql = "DELETE FROM gardensharing gs WHERE gs.gardenId = ?";
        let values = [gardenId];
        let processSQL = function(err, result){
            if (err) throw err;
        }
        db.query(sql, values, processSQL);

        //2. update data
        let objOwner = {};
        for (var i=0; i<objs.length; i++){
            if (objs[i].owner == 1){
                objOwner = objs[i];
                break;
            }
        }
        let index = objs.findIndex( u => u.userId === objOwner.userId );
        objs.splice(index, 1);
        let others = objs;

        //2.1 update for owner
        for (var i=0; i<others.length; i++){
            sql = "INSERT INTO gardensharing (gardenId, userId, shareWithId, owner) "
                + "VALUES (?, ?, ?, ?)";
            values = [gardenId, objOwner.userId, others[i].userId, 1];
            processSQL = function(err, result){
                if (err) throw err;
            }
            db.query(sql, values, processSQL);
        }

        //2.2 update for others
        for (var i=0; i<others.length; i++){
            let current = others[i];
            //update with owner first
            sql = "INSERT INTO gardensharing (gardenId, userId, shareWithId, owner) "
                + "VALUES (?, ?, ?, ?)";
            values = [gardenId, current.userId, objOwner.userId, 0];
            processSQL = function(err, result){
                if (err) throw err;
            }
            db.query(sql, values, processSQL);

            //update with others
            for(var j=0; j<others.length; j++){
                if (others[j].userId != current.userId){
                    sql = "INSERT INTO gardensharing (gardenId, userId, shareWithId, owner) "
                        + "VALUES (?, ?, ?, ?)";
                    values = [gardenId, current.userId, others[j].userId, 0];
                    processSQL = function(err, result){
                        if (err) throw err;
                    }
                    db.query(sql, values, processSQL);
                }
            }
        }
        res.json(1);
    });

    /*========= GET DATA FROM HISTORY ============*/
    app.get('/getHumidity', function(req, res){
        let gardenId = req.query.gardenId;

        let sql = 'CALL getHumidity(?)';

        let values = [gardenId];

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(result);
        };
        db.query(sql, values, processSQL);
    });

    app.get('/getSoilMoisture', function(req, res){
        let gardenId = req.query.gardenId;

        let sql = 'CALL getSoilMoisture(?)';

        let values = [gardenId];

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(result);
        };
        db.query(sql, values, processSQL);
    });

    app.get('/getWater', function(req, res){
        let gardenId = req.query.gardenId;

        let sql = 'CALL getWater(?)';

        let values = [gardenId];

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(result);
        };
        db.query(sql, values, processSQL);
    });

    //get avg soil moisture for all garden
    app.get('/getAvgSoilMoisture', function(req, res){
        let sql = "select round(avg(t.value), 1) as avgMoisture from"
                   + " (select * from soilmoisturehistory"
                   + " where dateAction in (select max(dateAction) from soilmoisturehistory group by gardenId)"
                   + " group by gardenId) as t;";

        let processSQL = function(err, result){
            if(err) throw err;
            res.json(result);
        };

        db.query(sql, processSQL);
    });

    app.get('/getAvgWater', function(req, res){
        let sql = "select round(avg(t.value), 1) as avgWater from"
                   + " (select * from waterhistory"
                   + " where dateAction in (select max(dateAction) from waterhistory group by gardenId)"
                   + " group by gardenId) as t";

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(result);
        };

        db.query(sql, processSQL);
    });

    app.get('/getHumidityCurrentYear', function(req, res){
        let gardenId = req.query.gardenId;

        let sql = 'CALL getHumidityCurrentYear(?)';

        let values = [gardenId];

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(result);
        };
        db.query(sql, values, processSQL);
    });

    app.get('/getSoilMoistureCurrentYear', function(req, res){
        let gardenId = req.query.gardenId;

        let sql = 'CALL getSoilMoistureCurrentYear(?)';

        let values = [gardenId];

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(result);
        };
        db.query(sql, values, processSQL);
    });

    app.get('/getWaterCurrentYear', function(req, res){
        let gardenId = req.query.gardenId;

        let sql = 'CALL getWaterCurrentYear(?)';

        let values = [gardenId];

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(result);
        };
        db.query(sql, values, processSQL);
    });

    app.get('/geTemperatureCurrentYear', function(req, res){
        let gardenId = req.query.gardenId;

        let sql = 'CALL geTemperatureCurrentYear(?)';

        let values = [gardenId];

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(result);
        };
        db.query(sql, values, processSQL);
    });

    /*======= DASHBOARD ========*/
    app.get('/getWaterHistoryByYear', function(req, res){
        let sql = "CALL getWaterHistoryByYear";

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(result);
        };

        db.query(sql, processSQL);
    });

    app.get('/getWaterHistoryByMonth', function(req, res){
        let sql = "CALL getWaterHistoryByMonth";

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(result);
        };

        db.query(sql, processSQL);
    });

    app.get('/getWaterHistoryByDay', function(req, res){
        let sql = "CALL getWaterHistoryByDay";

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(result);
        };

        db.query(sql, processSQL);
    });

    /*=== PLANTS ====*/
    app.get('/getAllPlants', function(req, res){
        let sql = "SELECT * FROM plants";

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(result);
        }

        db.query(sql, processSQL);
    });

    app.post('/insertPlant', function(req, res){
        //console.log(req.body);
        let sql = '';
        let values = [];

        if(req.body.id == 0){
            sql = "INSERT INTO plants (name, photo, maxHeight, standardSoilMoisture, description, userId)"
                        + " VALUES (?, ?, ?, ?, ?, ?)";
            values = [req.body.name, req.body.photo, req.body.maxHeight, req.body.standardSoilMoisture, req.body.description, req.body.userId];
        }
        else {
            sql = "UPDATE plants"
                + " SET name = ?, photo = ?, maxHeight = ?, standardSoilMoisture = ?, description = ?, userId = ?"
                + " WHERE id = ?";
            values = [req.body.name, req.body.photo, req.body.maxHeight, req.body.standardSoilMoisture, req.body.description, req.body.userId, req.body.id];
        }

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(1);
        }

        db.query(sql, values, processSQL);
    });

    app.get('/deletePlant', function(req, res){
        let plantId = req.query.plantId;
        let values = [plantId];

        let sql = "DELETE FROM plants WHERE id = ?";

        let processSQL = function(err, result){
            if (err) throw err;

            res.json({deleted: '1'});
        };
        db.query(sql, values, processSQL);
    });

    /*=== GARDENS ====*/
    app.get('/getAllGardens', function(req, res){
        let sql = "SELECT * FROM gardens";

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(result);
        }

        db.query(sql, processSQL);
    });

    app.get('/getGardensByUserId', function(req, res){
        let sql = "CALL getGardensByUserId(?)";
        let values = [req.query.userId];

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(result);
        }

        db.query(sql, values, processSQL);
    });

    app.post('/insertGarden', function(req, res){
        //console.log(req.body);
        let garden = { id: req.body.id,
                       name: req.body.name,
                       location: req.body.location,
                       description: req.body.description,
                       userId: req.body.userId};
        let listPlants = req.body.listPlants;

        //insert
        if (garden.id == 0){
            let sql = "INSERT INTO gardens (name, location, description, userId) VALUES (?, ?, ?, ?)";
            let values = [garden.name, garden.location, garden.description, garden.userId];

            let processSQL = function(err, result){
                if (err) throw err;

                //insert list plants
                if (result.insertId > 0){
                    for(var i=0; i<listPlants.length; i++){
                        if (listPlants[i].amount > 0){
                            let subSql = "INSERT INTO garden_plants (gardenId, plantId, amount, status)"
                                    + " VALUES (?, ?, ?, 1)";
                            let subValues = [result.insertId, listPlants[i].plantId, listPlants[i].amount];

                            let subProcessSQL = function(_err, _result){
                                if (_err) throw _err;
                            }
                            db.query(subSql, subValues, subProcessSQL);
                        }
                    }
                }

                res.json(result.insertId); //insert successful
            }
            db.query(sql, values, processSQL);
        }
        //update
        else {
            let sql = "UPDATE gardens SET name = ?, location = ?, description = ? WHERE id = ?";
            let values = [garden.name, garden.location, garden.description, garden.id];

            // only update garden information
            // plants will be update directly
            let processSQL = function(err, result){
                if (err) throw err;
                res.json(1);
            }
            db.query(sql, values, processSQL);
        }

    });

    app.post('/insertPlantToGarden', function(req, res){
        let data = req.body;
        //console.log(data);
        let sql = 'INSERT INTO garden_plants (gardenId, plantId, amount, status) VALUES(?, ?, ?, ?)';
        let values = [data.gardenId, data.id, data.amount, 1];

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(1);
        }
        db.query(sql, values, processSQL);
    });

    app.post('/updateAmount', function(req, res){
        let data = req.body;
        let sql = 'UPDATE garden_plants SET amount = ? WHERE gardenId = ? and plantId = ?';
        let values = [data.amount, data.gardenId, data.plantId];

        let processSQL = function(err, result){
            if(err) throw err;
            res.json(1);
        }
        db.query(sql, values, processSQL);
    });

    app.post('/deleteGardenPlant', function(req, res){
        let data = req.body;
        let sql = 'DELETE FROM garden_plants WHERE gardenId = ? and plantId = ?';
        let values = [data.gardenId, data.plantId];

        let processSQL = function(err, result){
            if(err) throw err;
            res.json(1);
        }
        db.query(sql, values, processSQL);
    });

    app.post('/updateListPlants', function(req, res){
        //console.log(req.body);
        let data = req.body;

        for(var i=0; i<data.length; i++){
            let sql = "INSERT INTO garden_plants (gardenId, plantId, amount)"
                    + " VALUES (?, ?, ?)";
            let values = [data[i].gardenId, data[i].plantId, data[i].amount];

            let processSQL = function(err, result){
                if (err) throw err;
                res.json(1);
            }
            db.query(sql, values, processSQL);
        }
    });

    app.get('/getPlantsByGardenId', function(req, res){
        let gardenId = req.query.gardenId;

        let sql = 'CALL getPlantsByGardenId (?)';
        let values = [gardenId];

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(result);
        }

        db.query(sql, values, processSQL);
    });

    app.get('/getSoilMoistureOfEachKindOfPlant', function(req, res){
        let gardenId = req.query.gardenId;

        let sql = 'CALL getSoilMoistureOfEachKindOfPlant (?)';
        let values = [gardenId];

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(result);
        }

        db.query(sql, values, processSQL);
    });

    app.get('/getMaxHeightOfEachKindOfPlant', function(req, res){
        let gardenId = req.query.gardenId;

        let sql = 'CALL getMaxHeightOfEachKindOfPlant (?)';
        let values = [gardenId];

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(result);
        }

        db.query(sql, values, processSQL);
    });

    app.get('/deleteGarden', function(req, res){
        let gardenId = req.query.gardenId;

        let sql = 'CALL deleteGarden (?)';
        let values = [gardenId];

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(1);
        }
        db.query(sql, values, processSQL);
    });

    //get all photo
    app.get('/getAllPhotos', function(req, res){
        let gardenId = req.query.gardenId;

        let sql = 'SELECT * FROM photohistory WHERE gardenId = ?';
        let values = [gardenId];

        let processSQL = function (err, result){
            if(err) throw error;
            res.json(result);
        }
        db.query(sql, values, processSQL);
    });

    app.get('/getPhotos', function(req, res){
        let gardenId = req.query.gardenId;
        let from_date = req.query.from_date;
        let to_date =  req.query.to_date;

        let sql = '';
        if (from_date == '' && to_date == '')
            sql = "SELECT * FROM photohistory WHERE gardenId = " + gardenId;
        else if (from_date != '' && to_date != '')
            sql = "SELECT * FROM photohistory WHERE gardenId = " + gardenId
                + " AND (dateAction BETWEEN '" + from_date + "' AND '"+ to_date + "')";
        else if (from_date == '')
            sql = "SELECT * FROM photohistory WHERE gardenId = " + gardenId + " AND "+ "dateAction <= '"+ to_date + "'";
        else if (to_date == '')
            sql = "SELECT * FROM photohistory WHERE gardenId = " + gardenId + " AND dateAction >= '" + from_date + "'";

        let processSQL = function (err, result){
            if (err) throw err;
            res.json(result);
        }
        db.query(sql, processSQL);
    });

    /*=== VARIABLE USE FOR CAMERA AND SENSOR ===*/
    //??? NEED TO FIND THE REAL PATH
    var real_python_path = 'C:/Users/Be Binh/AppData/Local/Programs/Python/Python38-32/python';

    /*=== CAMERA ===*/
    var python_process;
    var hostname = '';
    var emitVideo = '';
    app.get('/videoStreaming', function(req, res){
        hostname = req.query.hostname;
        emitVideo = 'toClient_video' +  hostname;
        let fileName = 'lap_video_server.py';
        let path = __dirname.split('\\').join('/') + '/python';

        /*let runningFile = hostname + fileName;

        fs.copyFile(path + '/' + fileName, path + '/' + runningFile, (err) => {
            if (err) throw err;
            console.log('copied');
        });*/

        //delete existed files in video folder
        let photo_path = __dirname.split('\\').join('/') + '/python/video/';
        let regex = new RegExp("^" + hostname + "video+");
        deleteDirFilesUsingPattern(regex, photo_path);

        //??? FIND python path
        let options = {
            mode: 'text',
            pythonPath: real_python_path,
            pythonOptions: ['-u'], // get print results in real-time
            scriptPath: path,
            args: [hostname]
        };

        python_process = PythonShell.run(fileName, options, function (err, results) {
            //if (err) throw err;
            if (err) {
                res.json(-1);
                return;
            }
            // results is an array consisting of messages collected during execution
            console.log('results: %j', results);

            res.json(results);
        });
    });

    app.get('/stop_python', function(req, res) {
        if (python_process != undefined && python_process != null){
            python_process.childProcess.kill('SIGINT');
            res.send('Stopped Streaming');
        }
    });

    /*=== READ DATA FROM SENSOR ===*/
    app.get('/getTemperature', function(req, res){
        hostname = req.query.hostname;
        emitVideo = 'toClient_video' +  hostname;
        let fileName = 'lap_proceed_getTemperature.py';
        let path = __dirname.split('\\').join('/') + '/python';

        let options = {
            mode: 'text',
            pythonPath: real_python_path,
            pythonOptions: ['-u'], // get print results in real-time
            scriptPath: path,
            args: [hostname]
        };

        python_process = PythonShell.run(fileName, options, function (err, results) {
            //if (err) throw err;
            if (err) {
                res.json(-1);
                return;
            }
            // results is an array consisting of messages collected during execution
            console.log('results: %j', results);

            res.json(results);
        });
    });


    /* connect socket io and listen to the image file from python script */
    io.on('connection', function(socket) {
        console.log('somebody connected: ' + socket.id);
        let listen_streaming = hostname + 'requestStreaming';
        console.log(listen_streaming);

        //client disconnect
        socket.on('disconnect', function(){
            console.log(socket.id + ' disconnected');
        });
        //console.log('emit: ' + emitVideo);
        socket.on(hostname + 'video', function(data){
            console.log('filename: ' + data);
            //emit to client
            //then client show each photo
            io.sockets.emit(emitVideo, data);
        });

        socket.on(listen_streaming, function(){
            console.log('start streaming here...');
        })
    });

    /*--- get current photo ---*/
    app.get('/currentPhoto', function(req, res){
        hostname = req.query.hostname;
        let photo_path = __dirname.split('\\').join('/') + '/python/currentPhoto/';

        //deleteDirFilesUsingPattern(/^foo+/, photo_path);
        let regex = new RegExp("^" + hostname + "foo+");
        deleteDirFilesUsingPattern(regex, photo_path);

        let fileName = 'lap_getCurrentPhoto.py';
        let pythonPath = __dirname.split('\\').join('/') + '/python/' + fileName;

        let path = __dirname.split('\\').join('/') + '/python';

        let options = {
            mode: 'text',
            pythonPath: real_python_path,
            pythonOptions: ['-u'], // get print results in real-time
            scriptPath: path,
            args: [hostname]
        };

        PythonShell.run(fileName, options, function (err, results) {
            //if (err) throw err;
            if (err) {
                res.json(-1);
                return;
            }
            // results is an array consisting of messages collected during execution
            console.log('results: %j', results);

            //let fs = require('fs');

            let newName = hostname + changeCurrentName();
            let oldPhoto = photo_path + 'foo.png';
            let newPhoto = photo_path + newName;
            fs.rename(oldPhoto, newPhoto, function (err) {
                if (err) throw err;
                //console.log('File Renamed.');
            });
            res.json(newName);
        });
    });

    /*=== SETTING ===*/
    app.get('/getSetting', function(req, res){
        let gardenId = req.query.gardenId;

        let sql = 'SELECT * FROM setting WHERE gardenId = ?';
        let values = [gardenId];

        let processSQL = function (err, result){
            if (err) throw err;
            res.json(result);
        }
        db.query(sql, values, processSQL);
    });

    app.post('/saveSetting', function(req, res){
        let obj = req.body;
        let sql = 'UPDATE setting SET timeCapturePhoto = ?, waterMethod = ?, numberDay = ?, timeWater = ?'
                + ' WHERE gardenId = ?';
        let values = [obj.timeCapturePhoto, obj.waterMethod, obj.numberDay, obj.timeWater, obj.gardenId];

        let processSQL = function (err, result){
            if (err) throw err;
            res.json(1);
        }
        db.query(sql, values, processSQL);
    });

    /*=== REMOVE FILE ===*/
    const fs = require('fs');
    const { resolve } = require('path');
    const deleteDirFilesUsingPattern = (pattern, dirPath) => {
        // get all file names in directory
        //console.log(pattern);
        fs.readdir(resolve(dirPath), (err, fileNames) => {
            if (err) throw err;

            // iterate through the found file names
            for (const name of fileNames) {
                //console.log(name);
                // if file name matches the pattern
                if (pattern.test(name)) {
                    fs.unlink(dirPath + name, (err) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                    });
                }
            }
        });
    }

    /*=== CHANGE NAME ===*/
    var changeCurrentName = function(){
        //new name
        let date_ob = new Date();
        // current year
        let year = date_ob.getFullYear();
        // current hours
        let hours = date_ob.getHours();
        // current minutes
        let minutes = date_ob.getMinutes();
        // current seconds
        let seconds = date_ob.getSeconds();

        return ('foo' + year + hours + minutes + seconds + '.png');
    };

};