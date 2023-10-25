require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const dns = require('dns');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
let ShortUrl = require('./ShortUrl');

//provaInserimento();
async function provaInserimento(){
  try {
    await new ShortUrl({
      url: "https://hass.ss.pro"
    }).save()
    console.log('success');
  } catch (error) {
    console.log(error);
  }
}

// Basic Configuration
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI).catch((err)=>{console.log(err);})

app.use(cors());

app.use(bodyParser.urlencoded({extended: true}))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl',function(req,res){
  
  dns.lookup(req.body['url'].slice(8),(err,addr)=>{
    if (err){
      res.json({error: 'invalid url'});
      return console.log(err);
    }
    else res.json({original_url: req.body['url'],short_url: 1})
  })
  
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
