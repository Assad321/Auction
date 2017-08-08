var express = require('express');
var cors = require('cors');
var multer = require('multer');
var bodyParser = require('body-parser');
var http = require('http');
var Sequelize = require('sequelize');
var fs = require('fs');

var Socket = require('./socket');
var Inventory = require('./models/inventory');

// variables
var app = express();
var server = http.Server(app);
var port = process.env.GAME_PORT || process.env.PORT || 3000;
var upload = multer();

// database
var db = new Sequelize('sqlite://db.sqlite', { logging: false });
var models = require('./models')(db, Sequelize);

// config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static('uploads'));

// routes
/*
URL : /files
Method : POST
Input : {
    files: Files,
    name: String
} 
Output : {
    msg: String
}
*/
app.post('/files', upload.any(), function (req, res) {
    if (req.files[0]) {
        var ext = req.files[0].originalname.split('.');
        ext = ext[ext.length - 1];
        var name = req.body.name ? req.body.name : req.files[0].originalname;
        fs.writeFile('./uploads/' + name, req.files[0].buffer, function (err) {
            if (err) {
                res.status(500).send({ msg: 'Error uploading file' });
            } else {
                models.Inventory.addItem(name);
                res.status(200).send({ msg: 'File uploaded.' });
            }
        });
    } else {
        res.status(422).send({ msg: 'Send files' });
    }
});


/*
URL : /getFile
Method : POST
Input : {
    name: String
} 
Output : {
    file
}
*/
app.post('/getFile', function (req, res) {
    console.log(req.body.name);
    fs.readdir('./uploads/', (err, files) => {
        var result = files.find(file => file.split('.')[0] == req.body.name);
        //result.toString();
        if (result) {
            res.sendFile(__dirname + '/uploads/' + result);
        } else {
            res.status(404).send({ msg: `No file found with that name ${req.body.name}` });
        }
    });
});



//// See if you can use this this is better
// app.post('/x', multer({ dest: './uploads/' }).single('file'), function (req, res) {
//     var api_request = {};
//     api_request.name = req.body.name;
//     //add other fields to api_request ...

//     var has_file = req.hasOwnProperty('file');

//     var io = require('socket.io-client');

//     var transaction_sent = false;
//     var socket = io.connect('http://localhost:3000');
//     socket.on('connect', function () {
//         console.log("socket connected to 3000");

//         if (transaction_sent === false) {
//             var ss = require('socket.io-stream');
//             var stream = ss.createStream();

//             ss(socket).emit('transaction new', stream, api_request);

//             if (has_file) {
//                 var fs = require('fs');
//                 var filename = req.file.destination + req.file.filename;

//                 console.log('sending with file: ', filename);

//                 fs.createReadStream(filename).pipe(stream);
//             }

//             if (!has_file) {
//                 console.log('sending without file.');
//             }
//             transaction_sent = true;

//             //get the response via socket
//             socket.on('transaction new sent', function (data) {
//                 console.log('response from 3000:', data);
//                 //there might be a better way to close socket. But this works.
//                 socket.close();
//                 console.log('Closed socket to 3000');

//             });

//         }


//     });


// });

server.listen(port, function () {
    new Socket({
        models: models,
        room: 'crossover',
        namespace: '/game'
    })
        .run(server);

    console.log(`Server is running on port ${port}`);
});
