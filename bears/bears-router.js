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

//*****************Return a list of Bears****************/

router.get('/', (req, res) => {
    db("bears")
      .then(bears => {
      res.status(200).json(bears)
      })
      .catch(error => {
      res.status(500).json(error)
    })
});

//************Find a Bear with a specific id*****************/

router.get('/:id', (req, res) => {
    db("bears")
      .where({ id: req.params.id })
      .then(bear => {
      res.status(200).json(bear)
      })
      .catch(err => {
      res.status(500).json(err)
    })
});
  
//****************Add a new Bear to the list******************/

router.post('/', (req, res) => {
    db('bears')
    .insert(req.body)
    .then(([id]) => {
      db('bears')
      .where({ id })
      .first()
      .then(bear => {
        res.status(200).json(bear);
      })
    })
    .catch(err => {
      res.status(500).json({message: "could not add new bear"});
    })
  });




module.exports = router;