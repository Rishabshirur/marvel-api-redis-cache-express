const express = require('express');
const router = express.Router();
const redis = require('redis');
const client = redis.createClient();
const axios = require('axios');
client.connect().then(() => {});

router.get('/characters/history', async (req, res) => {
  
  let history =  await client.LRANGE('recentchars', 0 , 19 );
  let arr=[];
  let temp;
  for (let i in history){
    
    temp = await client.hGet('characters', history[i]);
    temp= JSON.parse(temp);
    arr.push(temp);
  }
  return res.status(200).json(arr);

});

router.get('/characters/:id', async (req, res) => {
  //if the show is not in cache, then query the API for the show, render handlebars and
  //cache the HTML and add rendered html to cache
  let characterId = req.params.id;  
    console.log('Character not in cache');
    let character
    try{
      character = await axios.get(`https://gateway.marvel.com:443/v1/public/characters/${characterId}?ts=YOUR_TS&apikey=YOUR_PUBLIC_KEY&hash=YOUR_HASH`);
    }catch(e){
      return res.status(e.response.status).json({error: e.response.statusText})
    }
    
    if(character){
    try{
      await client.lPush('recentchars', characterId);
    }catch(e){
      return res.json({error: `${e}`});
    }

    try{
      await client.hSet('characters',characterId, JSON.stringify(character.data.data.results[0]));
     
    }catch(e){
      return res.json({error: `${e}`})
    }
   
    return res.status(200).json(character.data.data.results[0]);
    }
});




router.get('/comics/:id', async (req, res) => {
  let comicId = req.params.id;
  console.log('Comic not in cache');
  
  let comic;
  try{
    comic = await axios.get(`https://gateway.marvel.com:443/v1/public/comics/${comicId}?ts=YOUR_TS&apikey=YOUR_PUBLIC_KEY&hash=YOUR_HASH`);
  }catch(e){
    return res.status(e.response.status).json({error: e.response.statusText})
  }
  
  if(comic){
  await client.hSet('comics',comicId, JSON.stringify(comic.data.data.results[0]));
  return res.status(200).json(comic.data.data.results[0]);
  }
  
});


router.get('/stories/:id', async (req, res) => {
  let storyId = req.params.id;
  console.log('Story not in cache');

  let story;
  try{
    story = await axios.get(`https://gateway.marvel.com:443/v1/public/stories/${storyId}?ts=YOUR_TS&apikey=YOUR_PUBLIC_KEY&hash=YOUR_HASH`);
  }catch(e){
    return res.status(e.response.status).json({error: e.response.statusText});
  }

  console.log(story.data.data.results);
  if(story){
    await client.hSet('stories',storyId, JSON.stringify(story.data.data.results[0]));
    return res.status(200).json(story.data.data.results[0]);
  }
  
});


module.exports = router;
