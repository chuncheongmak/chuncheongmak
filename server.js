var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var mongodbURL = 'mongodb://s1134189:mKHAoZPIxnQn0G6PLmTu72eprLP3ELW023PpCvSOukY-@ds054118.mongolab.com:54118/s1134189';
var mongoose = require('mongoose');
app.post('/',function(req,res) {
//console.log(req.body);
var restaurantSchema = require('./models/restaurant');
mongoose.connect(mongodbURL)
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
var rObj = {};
rObj.address = {};
rObj.address.building = req.body.building;
rObj.address.street = req.body.street;
rObj.address.zipcode = req.body.zipcode;
rObj.address.coord = [];
rObj.address.coord.push(req.body.lon);
rObj.address.coord.push(req.body.lat);
rObj.borough = req.body.borough;
rObj.cuisine = req.body.cuisine;
rObj.name = req.body.name;
rObj.restaurant_id = req.body.restaurant_id;
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
var r = new Restaurant(rObj);
//console.log(r);
r.save(function(err) {
if (err) {
res.status(500).json(err);
throw err
}
//console.log('Restaurant created!')
db.close();
res.status(200).json({message: 'insert done', id: r._id});
});
});
});
app.delete('/restaurant_id/:id',function(req,res) {
var restaurantSchema = require('./models/restaurant');
mongoose.connect(mongodbURL)
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
Restaurant.find({restaurant_id: req.params.id}).remove(function(err) {
if (err) {
res.status(500).json(err);
throw err
}
//console.log('Restaurant removed!')
db.close();
res.status(200).json({message: 'delete done', id: req.params.id});
});
});
});
app.get('/restaurant_id/:id', function(req,res) {
var restaurantSchema = require('./models/restaurant');
mongoose.connect(mongodbURL)
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
Restaurant.find({restaurant_id: req.params.id},function(err,results){
if (err) {
res.status(500).json(err);
throw err
}
if (results.length > 0) {
res.status(200).json(results);
}
else {
res.status(200).json({message: 'No matching document'});
}
db.close();
});
});
});
app.put('/restaurant_id/:id/grades', function(req,res) {
var restaurantSchema = require('./models/restaurant');
mongoose.connect(mongodbURL)
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
Restaurant.update({restaurant_id:req.params.id},{$push:
{grades:{date:req.body.date,
grade:req.body.grade,
score:req.body.score}
}},function(err){
if (err) {
console.log("Error: " + err.message);
res.write(err.message);
}
else {
db.close();
res.status(200).json({message: 'update done'});
res.end('Done',200);
}
});
});
});
app.put('/restaurant_id/:id/address', function(req,res) {
var restaurantSchema = require('./models/restaurant');
mongoose.connect(mongodbURL)
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
Restaurant.update({restaurant_id:req.params.id},{
$set:
{
address:{street:req.body.street,
zipcode:req.body.zipcode,
building:req.body.building,
coord:[req.body.lon,req.body.lat]
}
}},function(err){
if (err) {
console.log("Error: " + err.message);
res.write(err.message);
}
else {
db.close();
res.status(200).json({message: 'update done'});
res.end('Done',200);
}
});
});
});
app.post('/restaurant_id/name',function(req,res) {
//console.log(req.body);
var restaurantSchema = require('./models/restaurant');
mongoose.connect(mongodbURL)
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
var rObj = {};
rObj.name = req.body.name;
rObj.restaurant_id = req.body.restaurant_id;
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
var r = new Restaurant(rObj);
//console.log(r);
r.save(function(err) {
if (err) {
res.status(500).json(err);
throw err
}
//console.log('Restaurant created!')
db.close();
res.status(200).json({message: 'insert done', id: r._id});
});
});
});
app.listen(process.env.PORT || 8099);
