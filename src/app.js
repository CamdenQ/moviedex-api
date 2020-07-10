require('dotenv').config();
const express = require('express'),
  morgan = require('morgan'),
  cors = require('cors'),
  helmet = require('helmet'),
  { NODE_ENV } = require('./config');

const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

const MOVIES = require('./movies-data.json');
// prettier-ignore
app
  .use(morgan(morganOption))
  .use(helmet())
  .use(cors())
  .use(express.json())
  .use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' });
    }
    // move to the next middleware
    next();
  })
  .use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
      response = { error: { message: 'server error'}}
    } else {
      console.error(error)
      response = { message: error.message, error}
    }
    res.status(500).json(response)
  })

app.route('/movie').get((req, res) => {
  let response = MOVIES;

  // filter our movies by genre if genre query param is present
  if (req.query.genre) {
    response = response.filter((movie) =>
      // case insensitive searching
      movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    );
  }

  // filter our movies by country if country query param is present
  if (req.query.country) {
    response = response.filter((movie) =>
      // case insensitive searching
      movie.country.toLowerCase().includes(req.query.country.toLowerCase())
    );
  }

  // filter our movies by avg_vote if avg_vote query param is present
  if (req.query.avg_vote) {
    response = response.filter((movie) => {
      movie.avg_vote >= req.query.avg_vote;
    });
  }

  res.json(response);
});

module.exports = app;
