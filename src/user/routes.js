const express = require('express');

const routes = express.Router({
  mergeParams: true
});

routes.get('/', (req, res) => {
  res.status(200).json([
    {
      name: 'Dan',
      age: 25
    }
  ]);
});


module.exports = {
  routes
}