const express          = require('express'),
      app              = express(),
      port             =3000,
      bodyParser       = require('body-parser'),
      mongoose         = require('mongoose'),
      flash            = require('connect-flash'),
      passport         = require('passport'),
      LocalStrategy    = require('passport-local'),
      methodOverride =require('method-override'),
      passporLocalMongoose = require('passport-local-mongoose');
      Campground       = require('./models/campground'),
      seedDB           = require('./seeds');
      Comment          = require('./models/comment'),
      User             = require('./models/user.js');

const commentRoutes = require('./routes/comments'),
      campgroundsRoutes = require('./routes/campgrounds'),
      indexRoutes = require('./routes/index');

//--------connect to db------
//local connection
//mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true});
//mongoDB Atlas
mongoose.connect('mongodb+srv://tomerbit:TbP@sss@cluster0-mapt3.mongodb.net/test?retryWrites=true&w=majority\n',
    {useNewUrlParser: true,
        useCreateIndex: true
    }).then(()=>{
        console.log("connected to db")
}).catch(err =>{
    console.log('Error:', err.message);
});

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname+ '/public'));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB(); // Seed the database

//  <----- Passport Configuration ------>
app.use(require('express-session')({
    secret: 'tomer yelpcamp project secret',
    resave: false,
    saveUninitialized:false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next)=>{
    res.locals.currentUser= req.user;
    res.locals.error= req.flash('error');
    res.locals.success= req.flash('success');
    next();
});

//  <----- Requiring Routes ------>
app.use(indexRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(port, () => console.log(`app listening at http://localhost:${port}`));

//pics https://depositphoctos.com/stock-photos/campground.html