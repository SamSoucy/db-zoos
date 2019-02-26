const router = require('express').Router();
const knex = require("knex");

const knexConfig = {
    client: "sqlite3",
      useNullAsDefault: true,
    connection: {
      filename: "./data/lambda.sqlite3"
    }
}
  
const db = knex(knexConfig)

router.get('/', (req, res) => {
    db("zoos")
      .then(zoos => {
      res.status(200).json(zoos)
      })
      .catch(error => {
      res.status(500).json(error)
    })
});

router.get('/:id', (req, res) => {
    db("zoos")
      .where({ id: req.params.id })
      .then(zoo => {
      res.status(200).json(zoo)
      })
      .catch(err => {
      res.status(500).json(err)
    })
  });
  
  router.post('/', (req, res) => {
    // add a role to the database
    db('zoos')
    .insert(req.body)
    .then(([id]) => {
      db('zoos')
      .where({ id })
      .first()
      .then(zoo => {
        res.status(200).json(zoo);
      })
    })
    .catch(err => {
      res.status(500).json({message: "could not add new zoo"});
    })
  });



module.exports = router;