const express = require('express');
const app = express();
const configRoutes = require('./routes');

const redis = require('redis');
const client = redis.createClient();
await client.connect().then(() => {});


app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use('/api/characters/:id', async (req, res, next) => {
  //lets check to see if we have the show detail page for this show in cache
  if (
    req.originalUrl !== '/api/characters/history' 
  ){
    let exists = await client.hExists('characters', req.params.id);
    if (exists) {
      //if we do have it in cache, send the raw html from cache
      console.log('Character in Cache');
      let showCharacter = await client.hGet('characters', req.params.id);
      showCharacter= JSON.parse(showCharacter);
      await client.LPUSH('recentchars', req.params.id);
      console.log('Sending character from Redis....');
      return res.status(200).json(showCharacter);
    } else {
      next();
    }
  }else{
    next();
  }
});

app.use('/api/comics/:id', async (req, res, next) => {
  //lets check to see if we have the show detail page for this show in cache
  if (
    req.originalUrl !== '/api/characters/history' 
  ){
    let exists = await client.hExists('comics', req.params.id);
    if (exists) {
      //if we do have it in cache, send the raw html from cache
      console.log('Comic in Cache');
      let showComic = await client.hGet('comics', req.params.id);
      showComic= JSON.parse(showComic);
      console.log('Sending Comic from Redis....');
      return res.status(200).json(showComic);

    } else {
      next();
    }
  }else{
    next();
  }
});

app.use('/api/stories/:id', async (req, res, next) => {
  //lets check to see if we have the show detail page for this show in cache
  
  if (
    req.originalUrl !== '/api/characters/history' 
  ){
    let exists = await client.hExists('stories', req.params.id);
    if (exists) {
      //if we do have it in cache, send the raw html from cache
      console.log('Story in Cache');
      let showStory = await client.hGet('stories', req.params.id);
      showStory= JSON.parse(showStory);
      console.log('Sending story from Redis....');
      return res.status(200).json(showStory);
    } else {
      next();
    }
  }else{
    next();
  }

  
  
});






configRoutes(app);
app.listen(3000, async () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
