"use strict";

const express = require("express");
const server = express();
const cors = require("cors");
const axios = require("axios");
server.use(cors());
require('dotenv').config();
const pg = require("pg");
server.use(express.json());

const apiKEY = process.env.apiKEY;
const data = require("./Movie data/data.json");

let PORT = process.env.PORT || 3000;
const DB = process.env.database_url;

const moveInst = new pg.Client(DB);


server.get('/', firstMoveHandler);

server.get('/getmove', getMove);
server.post('/getmove', addMove);

server.get('/getMoveByID/:id', getMoveByID);
server.delete('/getmove/:id', deleteMove);
server.put('/getmove/:id', updateMove);

server.get('/favorite', favoriteHandler);
server.get('/trending', trendMove);
server.get('/search', searchMove);
server.get('/popular', popular);
server.get('/provider', provider);


server.get('*', defaultHandler);

server.use((req, res) => {
  res.status(500).json({
    status: 500,
    responseText: "Sorry, something went wrong"
  })
});

function firstMoveHandler(req, res) {
  let move1 = new Movie(data.title, data.poster_path, data.overview);
  res.json(move1);

};

function favoriteHandler(req, res) {
  let str = "Welcome to Favorite Page"
  res.status(200).send(str);

};

function trendMove(req, res) {
  const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKEY}&language=en-US`
  try {
    axios.get(url)
      .then(result => {
        let mapTrending = result.data.results.map(item => {
          let moveInfo = new Movie(item.id, item.title, item.release_date, item.poster_path, item.overview)
          return moveInfo
        })
        res.send(mapTrending)
      })
      .catch((error) => {
        res.status(500).send(error)
      })
  }
  catch (error) {
    errorHandler(error, req, res)
  }
};

function searchMove(req, res) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKEY}&language=en-US&query=no&page=3&year=2002`
  try {
    axios.get(url)
      .then(result => {
        let mapSearch = result.data.results.map(item => {
          let moveInfo = new Movie(item.id, item.title, item.release_date, item.poster_path, item.overview)
          return moveInfo
        })
        res.send(mapSearch)
      })
      .catch((error) => {
        res.status(500).send(error)
      })
  }
  catch (error) {
    errorHandler(error, req, res)
  }
};

function popular(req, res) {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKEY}&language=en-US&page=1`
  try {
    axios.get(url)
      .then(result => {
        let mapMovie = result.data.results.map(item => {
          let moveInfo = new Movie(item.id, item.title, item.release_date, item.poster_path, item.overview)
          return moveInfo
        })
        res.send(mapMovie)
      })
      .catch((error) => {
        res.status(500).send(error)
      })
  }
  catch (error) {
    errorHandler(error, req, res)
  }
};


function addMove(req, res) {
  const moveBody = req.body;
  const sql = `INSERT INTO move1 ( title ,  poster_path ,  overview , release_date , comment)
   VALUES ($1 , $2 , $3 ,$4 ,$5);`
  const values = [moveBody.title, moveBody.poster_path, moveBody.overview, moveBody.release_date, moveBody.comment];

  moveInst.query(sql, values)
    .then(data => {
      res.send("your move added successfully");
    }).catch((error) => {
      errorHandler(error, req, res)
    })
};

function provider(req, res) {
  const url = `https://api.themoviedb.org/3/watch/providers/regions?api_key=${apiKEY}&language=en-US
  `
  try {
    axios.get(url)
      .then(result => {
        let mapPeople = result.data.results.map(item => {
          let moveInfo = new Movie1(item.iso_3166_1, item.english_name, item.native_name)
          return moveInfo
        })
        res.send(mapPeople)
      })
      .catch((error) => {
        res.status(500).send(error)
      })
  }
  catch (error) {
    errorHandler(error, req, res)
  }
};

function getMove(req, res) {
  const sql = 'SELECT * FROM move1';
  moveInst.query(sql)
    .then(data => {
      res.send(data.rows)
    })
    .catch((error) => {
      errorHandler(error, req, res)
    })

};

function deleteMove(req, res) {
  const { id } = req.params;
  const sql = `DELETE FROM move1 WHERE id = ${id};`
  moveInst.query(sql)
    .then(data => {
     res.send("ok")
    })

   
    
    .catch(error => {
      errorHandler(error, req, res)
    })
}

function updateMove(req, res) {
  const { id } = req.params;

  const updatedMove = req.body;

  const sql = `UPDATE move1 SET title = $1 , poster_path = $2 , overview = $3 ,release_date=$4 ,comment=$5 WHERE id = ${id};`;

  const { title, poster_path, overview, release_date, comment } = req.body;

  const values = [title, poster_path, overview, release_date, comment];

  moveInst.query(sql, values)
  .then(data => {
    const sql = 'SELECT * FROM move1';
    moveInst.query(sql)
    .then(alldata =>{
      res.send(alldata.rows)
    })
  }).catch(error => {
    errorHandler(error, req, res)
  })

}

function getMoveByID(req, res) {
  const { id } = req.params;
  const sql = `SELECT * FROM move1 WHERE id =${id}`
  moveInst.query(sql)
    .then(data => {
      res.send(data)
    })
    .catch((error) => {
      errorHandler(error, req, res)
    })

};

function errorHandler(error, req, res) {
  const err = {
    status: 500,
    message: error
  }
  res.status(500).send(err);
};

function defaultHandler(req, res) {
  let str1 = "Page not found"
  res.status(404).send(str1);

};




function Movie(id, title, release_date, poster_path, overview) {
  this.id = id;
  this.title = title;
  this.release_date = release_date;
  this.poster_path = poster_path;
  this.overview = overview;
};

function Movie1(iso_3166_1, english_name, native_name) {
  this.iso_3166_1 = iso_3166_1;
  this.english_name = english_name
  this.native_name = native_name
};



moveInst.connect()
  .then(() => {
    server.listen(PORT, () => { });
  });



