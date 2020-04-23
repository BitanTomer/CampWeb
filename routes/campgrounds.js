const express= require('express');
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware');

//  <------INDEX - show all campground ------>
router.get('/', (req,res)=>{
    Campground.find({}, (err, campgrounds)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render('campgrounds/index', {campgrounds: campgrounds});
        }
    })
});

//  <------NEW - form add new campground ------>
router.get('/new', middleware.isLoggedIn, (req,res)=>{
    res.render('campgrounds/new');
});

//  <------CREATE - post to db new campground ------>
router.post('/', middleware.isLoggedIn , (req,res) => {
//<-------post campground request to db------->
    const campName= req.body.campName;
    const campPrice= req.body.campPrice;
    const campImg= req.body.campImg;
    const campDesc=req.body.campDesc;
    const author={id: req.user._id, username:req.user.username};

    let newCampground= {name: campName,price:campPrice, img: campImg , description: campDesc, author:author};

    Campground.create(
        newCampground, (err)=>{
            if(err){
                console.log(err);
            }
            else {
                res.redirect('/campgrounds');
            }
        });
});

//  <------SHOW more info about campground ------>
router.get('/:id' , (req, res)=>{
    Campground.findById(req.params.id).populate('comments').exec((err, foundedCamp)=>{
        if(err || !foundedCamp){
            console.log(err);
            req.flash('error', 'Sorry, that campground does not exist!');
            return res.redirect('/campgrounds');
        }
        else {
            res.render('campgrounds/show', {camp: foundedCamp});
        }
    });
});

//  <------EDIT Campground  ------>
router.get('/:id/edit',middleware.isLoggedIn, middleware.checkCampgroundOwnership , (req,res)=>{
    Campground.findById(req.params.id , (err, foundCampground)=> {
        res.render('campgrounds/edit', {campground: foundCampground});
    });
});

//  <------UPDATE Campground  ------>
router.put('/:id', middleware.checkCampgroundOwnership ,(req, res)=>{
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err,updatedCampground)=>{
        if(err){
            res.redirect('/campgrounds');
        }
        else{
            res.redirect('/campgrounds/'+req.params.id);
        }
    })
});

//  <------DESTROY Campground  ------>
router.delete('/:id', middleware.isLoggedIn ,middleware.checkCampgroundOwnership , (req, res) => {
    Campground.findByIdAndDelete(req.params.id, (err)=>{
        if(err){
            res.redirect('/campgrounds')
        }
        else{
            res.redirect('/campgrounds')
        }
    })

});


module.exports = router;