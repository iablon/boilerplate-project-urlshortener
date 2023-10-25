require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const dns = require('dns');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
let ShortUrl = require('./ShortUrl');
const { log } = require('console');



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
  let parsableUrl = new URL(req.body['url']);
  console.log(parsableUrl);
  console.log(req.body.url.replace(/\/*$/, ''));
  if(!(parsableUrl.hostname === '') && !(parsableUrl.hostname === undefined))
    if (parsableUrl.protocol == 'https:')
    dns.lookup(parsableUrl.hostname,(err,addr)=>{
      if (err){
        res.json({error: 'invalid url'});
        return console.log(err);
      }
      else {
        ShortUrl.countDocuments({}, { hint: "_id_" })
          .then((count)=>{
            InsertURL(req.body['url'],count++).then((result)=>{
              if (result==1){
                res.json({error: 'something wrong with database'});
              }else{
                console.log({original_url: parsableUrl.hostname,short_url: count-1});
                res.json({original_url: req.body['url'],short_url: count-1})
              }
            })
          })
          .catch((err)=>{
            res.json({error: 'something wrong with database'});
            console.log(err);
          })
      }
    })
    else
      res.json({error: 'invalid url'})
  else
    res.json({error: 'invalid url'});
})

app.get('/api/shorturl/:id',function(req,res){
  ShortUrl.findOne({shortId: req.params.id},'url')
    .then(url=>{res.redirect(url['url'])})
    .catch(err=>{console.log(err);});
  //res.redirect()
})
async function InsertURL(url,count){
  try {
    await new ShortUrl({
      url: url,
      shortId: count
    }).save()
    console.log('success');
    return 0;
  } catch (error) {
    console.log(error);
    return 1;
  }
}


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
