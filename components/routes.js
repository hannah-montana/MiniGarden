module.exports = (app, db, CryptoJS) => {
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

    app.get('/ui-bootstrap-tpls-2.5.0.js', function(req, res) {
        // send the angular app
        res.setHeader('Content-Type', 'application/javascript');
        res.sendFile( __dirname + '/js' + '/ui-bootstrap-tpls-2.5.0.js');
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

    /*========= SENSOR ============*/
    app.get('/getHumidity', function(req, res){
        let sql = "select value from humidityhistory where dateAction = (select max(dateAction) from humidityhistory)";

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(result);
        };
        db.query(sql, processSQL);
    });

    app.get('/getAvgSoilMoisture', function(req, res){
        let sql = "select round(avg(t.value), 1) as avgMoisture from"
                   + " (select * from soilmoisturehistory"
                   + " where dateAction in (select max(dateAction) from soilmoisturehistory group by plantId)"
                   + " group by plantId) as t;";

        let processSQL = function(err, result){
            if(err) throw err;
            res.json(result);
        };

        db.query(sql, processSQL);
    });

    app.get('/getAvgWater', function(req, res){
        let sql = "select round(avg(t.value), 1) as avgWater from"
                   + " (select * from waterhistory"
                   + " where dateAction in (select max(dateAction) from waterhistory group by plantId)"
                   + " group by plantId) as t";

        let processSQL = function(err, result){
            if (err) throw err;
            res.json(result);
        };

        db.query(sql, processSQL);
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
                + " WHERE id = ?"
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

    app.post('/insertGarden', function(req, res){
        let garden = { name: req.body.name,
                       location: req.body.location,
                       description: req.body.description,
                       userId: req.body.userId};
        let listPlants = req.body.listPlants;

        let sql = "INSERT INTO gardens (name, location, description, userId) VALUES (?, ?, ?, ?)";
        let values = [garden.name, garden.location, garden.description, garden.userId];

        let processSQL = function(err, result){
            if (err) throw err;

            //insert list plants
            if (result.insertId > 0){
                for(var i=0; i<listPlants.length; i++){
                    let subSql = "INSERT INTO garden_plants (gardenId, plantId, amount)"
                            + " VALUES (?, ?, ?)";
                    let subValues = [result.insertId, listPlants[i].plantId, listPlants[i].amount];

                    let subProcessSQL = function(_err, _result){
                        if (_err) throw _err;
                    }
                    db.query(subSql, subValues, subProcessSQL);
                }
            }

            res.json(result.insertId); //insert successful
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

};