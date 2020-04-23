const express= require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

//  <----- root routes ------>
router.get('/',(req , res) =>{
    res.render('landings');
});

//========================================
//  <------    AUTH route   ------>'
//========================================
//  <------    Register route   ------>

router.get('/register', (req, res)=>{
    res.render('register');
});

router.post('/register' , (req, res)=> {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash('error', err.message);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, () => {
            req.flash('success', 'Welcome to YelpCamp '+user.username);
            res.redirect('/campgrounds');
        });
    });
});

//  <------    Login route   ------>
router.get('/login' ,(req, res)=>{
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
        successRedirect:'/campgrounds',
        failureRedirect: '/login'}),
    (req,res)=>{});

//  <------    Logout route   ------>
router.get('/logout' , (req,res)=>{
    req.logout();
    req.flash('success', 'Logout successfully!')
    res.redirect('/campgrounds')
});


module.exports = router;

