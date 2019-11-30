const express  = require('express');
const mongoose =  require('mongoose');
const bodyParser  =require('body-parser');
var morgan = require('morgan');

var miscAPI = require('./routes/api/misc.route');
const db = require('./config/keys').mongoURI;

const Sentry = require('@sentry/node');

Sentry.init({ dsn: 'https://9c419d13926e41d0a3b41ea989935800@sentry.io/1454931' });

const app = express();

app.use(Sentry.Handlers.requestHandler());

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );


app.use('/api',miscAPI);

app.get("*", (req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Not found'
});
  });

app.use(Sentry.Handlers.errorHandler());

// Middleware for error handling
app.use((error,req,res,next)=>{

    const errMessage = error.message||error.name;
    const errStatusCode = error.status||error.code;

    
    console.log("Code:"+errStatusCode||500 + "Message: "+errMessage);
    res.status(error.status||500).json({error:errMessage}).end();
    
})

mongoose.connect(db).then(()=>{
  console.log('Connected');
}).catch(()=>{
  console.log('Error while connecting to DB');
})

const port  = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log('Server is running');
})