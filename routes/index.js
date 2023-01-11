var express = require('express');
var router = express.Router();

var db = require('../mySQLConnect.js');
// var Animatronic = require("../models/animatronic").Animatronic
// var User = require("./../models/user").User
var checkAuth = require("./../middleware/checkAuth")

/* GET home page  (Главая страница)/Счетчик. */
router.get('/', function (req, res, next) {
  db.query(`SELECT title, nick FROM animatronics`, (err, menu) => {
    req.session.greeting = "Hi!!!",
    res.cookie('greeting', 'Hi!!!').render('index', { 
      title: 'Express',
      menu: menu,
      counter:req.session.counter
    })
  });
});

/* Страница регистрации */
router.get('/logreg', function(req, res, next){
  res.render('logreg',{
    title: 'Вход', 
    error: null
  });
})

router.post('/logreg', function(req, res, next){
  var username = req.body.username;
  var password = req.body.password;

  db.query(`SELECT * FROM user WHERE user.username = '${req.body.username}'`, (err, users) => {
    if(err) return next(err)
    if(users.length > 0){
      var user = users[0];
      if(password == user.password){
          req.session.user = user.user_id
          res.redirect('/')
      } 
      else { res.render('logreg', {title: 'Вход', error:"Пароль не верный"})
      }
    } else {
      db.query(`INSERT INTO user (username, password) VALUES ('${username}', '${password}')`, function(err,user){
        if (err) return next(err)
        req.session.user = user.user_id
        res.redirect('/')
      })
    }
  })
});

/* logout */
router.post('/logout', function(req, res, next) {
  req.session.destroy()
  req.session.user = null
  res.redirect('/')
});

/* Страница Фредди 
router.get('/freddy', function(req, res, next) {
  res.render('fnaf', {
    title: "Фредди",
    picture: "images/Freddy.jpg",
    desc: "Аниматроник Фредди Фазбер представляет собой антропоморфного медведя грязного светло-коричневого с рыжеватым оттенком окраса. Его обшивка сделана из плюша, покрытого небольшими, но вполне заметными пятнами и царапинами. Подобно другим членам классического трио, Фредди обладает довольно плотным телосложением. Туловище Фредди по форме напоминает грушу. Аниматроник обладает внушительным круглым животом со светло-коричневым пятном посередине."
  });
});

/* Страница Бонни 
router.get('/bonnie', function(req, res, next) {
  res.render('fnaf', {
    title: "Бонни",
    picture: "images/Bonnie.jpg",
    desc: "Бонни имеет толстые конечности с плотно прилегающими накладками на плечах и коленях. У него большие цельные ладони. Как и у других Классических аниматроников, на руках Бонни всего по 4 пальца, а на ногах — 3. Туловище кролика напоминает по форме грушу с внушительным круглым животом светло-сиреневого цвета со светлым пятном."
  });
});

/* Страница Чики 
router.get('/chica', function(req, res, next) {
  res.render('fnaf', {
    title: "Чика",
    picture: "images/Chica.jpg",
    desc: "Чика является антропоморфным аниматроником-курицей жёлтого окраса. Корпус персонажа состоит из матовой тканевой обшивки, покрытой тёмными запятнанными участками. Чика имеет округлую голову, формой напоминающую яблоко. На её макушке установлен пучок из трëх небольших, составленных кольцом, каплевидных, расширенных к верху, фрагментов, имитирующие перья."
  });
});

/* Страница Фокси 
router.get('/foxy', function(req, res, next) {
  res.render('fnaf', {
    title: "Фокси",
    picture: "images/Foxy.png",
    desc: "Фокси представляет из себя антропоморфного лиса-пирата грязно-красного окраса. Он обладает стройным телосложением и средним ростом. Корпус Фокси сделан из потрёпанного плюша, в дырах которого виден эндоскелет. Фокси имеет тонкие конечности с плотно прилегающими накладками на плечах. У него суставчатые металлические ладони. Как и у других Классических аниматроников, на руках Фокси всего по 4 пальца, на голых ногах — только 2. Туловище лиса вытянутое, с животом светло-рыжего цвета."
  });
});
*/
module.exports = router;
