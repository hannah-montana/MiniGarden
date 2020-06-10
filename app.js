//init server
let express = require('express');
let app = express();

let CryptoJS = require('node-cryptojs-aes').CryptoJS;

//body parser
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/*=== UPLOAD FILE ===*/
//handle file upload in express app
let multer = require('multer');
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './components/img/plants/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = new Date().toDateString();
        cb(null, datetimestamp + '.' + file.originalname);
        //cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});
var upload = multer({ //multer settings
    storage: storage
}).single('file');

/** API path that will upload the files */
app.post('/upload', function(req, res) {
    upload(req,res,function(err){
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
        res.json({error_code:0,err_desc:null});
    })
});
/*=== END UPLOAD FILE ===*/

//use for realtime
let http = require('http');
let server = http.Server(app);
let io = require('socket.io')(server);

server.listen(3010);

var publicDir = require('path').join(__dirname, '/components');
app.use(express.static(publicDir));

//database configuration
let mysql = require('mysql');
let db = mysql.createConnection(
{
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'admin',
    database: 'minigarden'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected');
});

//load route
let routes = require('./components/routes.js');
routes(app, db, CryptoJS);


