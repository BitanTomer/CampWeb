const express= require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const middleware = require('../middleware');

//  <------comments routes ------>
//  <------    comments new   ------>

router.get('/new', middleware.isLoggedIn, (req, res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render('comments/new', {campground:campground});
        }
    });
});

//  <------    comments create   ------>
router.post('/new', middleware.isLoggedIn , (req, res)=>{
    //find campground and add a new post.
    Campground.findById(req.params.id, (err, campground)=>{
        if(err){
            console.log(err);
            res.redirect('/campgrounds')
        }
        else{
            Comment.create(req.body.comment, (err,comment)=>{
                if(err){
                    console.log(err);
                    req.flash('error', 'Something went wrong');
                }
                else {
                    comment.author.id = req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('success', 'successfully added comment');
                    res.redirect('/campgrounds/'+campground._id)
                }
            })
        }
    });


});

//  <------    comments edit   ------>
router.get('/:comment_id/edit',middleware.isLoggedIn, middleware.checkCommentOwnership , (req,res)=> {
    Comment.findById(req.params.comment_id, (err, comment) => {
        if (err) {
            res.redirect('back');
        } else {
            res.render('comments/edit', {comment:comment, campground_id: req.params.id});
        }
    });
});

//  <------    comments update   ------>
router.put('/:comment_id', middleware.checkCommentOwnership , (req,res)=> {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedcomment) => {
        if (err) {
            res.redirect('back');
        } else {
            res.redirect('/campgrounds/'+req.params.id);
        }
    });
});

//  <------DESTROY Comment  ------>
router.delete('/:comment_id', middleware.isLoggedIn,  middleware.checkCommentOwnership , (req, res) => {
    Comment.findByIdAndDelete(req.params.comment_id, (err)=>{
        if(err){
            res.redirect('back')
        }
        else{
            req.flash('success', 'successful, comment deleted!');
            res.redirect('/campgrounds/'+req.params.id)
        }
    })

});

module.exports = router;
