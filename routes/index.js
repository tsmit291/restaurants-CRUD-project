var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

function restaurantinfo(){
  return knex('restaurantinfo');
};

/* GET home page. and redirect to /restaurants */
router.get('/', function(req, res, next){
  res.redirect('/restaurants');
});

router.get('/restaurants/', function(req, res, next) {
  var allRows;
  var tabley = knex.select().table('restaurantinfo').then(function (rows){
    allRows = rows;
    res.render('restaurants/index', { obj: allRows });
  });
});

/*When I click a restaurant name I am taken to that restaurants show page*/
router.get('/restaurants/:id', function (req, res, next){
  restaurantinfo().where('id', req.params.id).first().then(function(result){
    var reviewTable = knex.select().table('reviews').then(function(rows){
      allRows = rows;
      res.render('restaurants/show', {restaurantNew: result, obj: allRows});
    });
    //<-- maybe try passing it here with restaurantNew. Like pass both variables
  });
});

/* Add a new restaurant */
router.get('/restaurants/new', function(req, res, next){
  var allRows;
  var tabley = knex.select().table('restaurantinfo').then(function (rows){
    allRows = rows;
    res.render('restaurants/new', { obj: allRows});
  });
});

/* new restaurant post- redirects to home page */
router.post('/restaurants/', function(req, res, next){
  var restaurantNew = {
    name: req.body.name,
    city: req.body.city,
    state: req.body.state,
    cuisine: req.body.cuisine,
    rating: req.body.rating,
    bio: req.body.textdescription,
    image: req.body.imageUrl
  };
  restaurantinfo().insert(restaurantNew).then(function(result){
    res.redirect('/restaurants');
  });
});

/* edit on one specific restaurant */
router.get('/restaurants/:id/edit', function (req, res, next){
  restaurantinfo().where('id', req.params.id).first()
  .then(function(result){
    res.render('restaurants/edit', {restaurantNew: result});
  });
});

router.post('/restaurants/:id', function (req, res, next) {
  restaurantinfo().where('id', req.params.id).update(req.body)
  .then(function(result){
    res.redirect('/restaurants');
  });
});

/* delete one specific restaurant */
router.post('/restaurants/:id/delete', function (req, res, next){
  restaurantinfo().where('id', req.params.id).del()
  .then(function (result){
    res.redirect('/restaurants');
  });
});

/* Gets the restaurants on the admin homepage, remember everything after this will be admin/new or admin/edit or admin/delete */
router.get('restaurants/admin', function(req, res, next) {
  var allRows;
  var tableyEmployees =
  knex.select().table('restaurantinfo').then(function (rows){
    allRows = rows;
    res.render('restaurants/admin', {obj: allRows });
  });
});

 /*Gets the employee first name and last name under each restaurant */
 router.get('restaurants/:id/edit', function(req, res, next){
   my_id = req.params.id;
  Restaurants().where({id: my_id}).then(function(payload){
   Employees().where({restaurant_id: my_id}).then(function(payload2){
    res.render('restaurants/edit', {payload: payload[0], payload})
  });
});
});







module.exports = router;
