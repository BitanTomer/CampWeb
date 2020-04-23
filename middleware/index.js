const Campground = require('../models/campground');
const Comment = require('../models/comment');
let middleWareObj= {};

middleWareObj.checkCampgroundOwnership = (req,res,next)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
        if(err || !foundCampground){
            console.log(err);
            req.flash('error', 'Sorry, that campground does not exist!');
            res.redirect('/campgrounds');
        } else if(foundCampground.author.id.equals(req.user._id)){
            req.campground = foundCampground;
            next();
        } else {
            req.flash('error', 'You don\'t have permission to do that!');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
}

middleWareObj.checkCommentOwnership = (req, res, next)=> {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err || !foundComment) {
            console.log(err);
            req.flash('error', 'Sorry, that comment does not exist!');
            res.redirect('/campgrounds');
        } else if (foundComment.author.id.equals(req.user._id)) {
            req.comment = foundComment;
            next();
        } else {
            req.flash('error', 'You don\'t have permission to do that!');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
};

middleWareObj.isLoggedIn =(req, res, next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You need to login first in order to do that!');
    res.redirect('/login');
};

module.exports = middleWareObj;

