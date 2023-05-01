const express = require("express");

const server= express();

const data = require("./Movie data/data.json");

const PORT = 3000;


function Movie(title,poster_path,overview) {
  this.title = title;
  this.poster_path = poster_path;
  this.overview = overview;
};


server.get('/',(req,res)=>{
    let move1= new Movie(data.title,data.poster_path,data.overview);
    res.status(200).send(move1);
      
});

server.get('/favorite',(req,res)=>{
  let str="Welcome to Favorite Page"
  res.status(200).send(str);
    
});

server.get('/error',(req,res)=>{
  let str2={
    "status": 500,
"responseText": "Sorry, something went wrong"
  }
  res.status(500).send(str2);
    
})

server.get('*',(req,res)=>{
  let str1="Page not found"
  res.status(404).send(str1);
    
})



server.listen(PORT,()=>{});

