const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const gapps = require('./gapps');
const app = express();

app.use(morgan('common')); // let's see what 'common' format looks like
app.use(cors());

app.get('/apps', (req, res) => {
    const { genres, sort } = req.query;
    if(genres) {
        if(!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genres)) {
            return res
                .status(400)
                .send(`genre must be one of: Action, Puzzle, Strategy, Casual, Arcade, Card, instead got ${genres}`);
        }
        let results = gapps
            .filter(app =>
               app
                   .Genres
                   .toLowerCase()
                   .includes(genres.toLowerCase())
            );
        if (sort) {
          if(!['app', 'rating'].includes(sort)) {
              return res
                  .status(400)
                  .send(`sort must be one of: app, rating, instead got ${sort}`);
          }
          if (sort === 'rating') {
              results.sort((a, b) => (b.Rating - a.Rating));
          };
          if (sort === 'app') {
              results.sort((a, b) => {
                  const nameA = a.App.toUpperCase();
                  const nameB = b.App.toUpperCase();
                  if (nameA < nameB) {
                      return -1;
                  }
                  if (nameA > nameB) {
                      return 1;
                  }
                  return 0;
              })
          };
        };
        res
            .status(200)
            .json(results);
    };
    res
        .status(200)
        .json(gapps);
});

module.exports = app;