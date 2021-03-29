var mongoose = require('mongoose');


//Object holding all your connection strings
var connections = {};
exports.getDatabaseConnection = function (dbName) {

    if (connections[dbName]) {
        //database connection already exist. Return connection object
        return connections[dbName];
    } else {
        connections[dbName] = mongoose.createConnection('mongodb+srv://matrix_backend:AnbV0SAh697LS2iW@cluster0.zsmah.mongodb.net/' + dbName + '?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify :false});
        return connections[dbName];
    }
}
