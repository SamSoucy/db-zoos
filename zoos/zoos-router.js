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

  router.put('/:id', (req, res) => {
   db('zoos')
    .where({ id: req.params.id })
    .update(req.body)
    .then(response => {
      if(response > 0) {
        db('zoos')
        .where({ id: req.params.id })
        .first()
        .then(response => {
          res.status(200).json(response)
        })
      } else {
        res.status(404).json({ message: 'Zoo not found' })
      }
    })
    .catch(error => {
      res.status(500).json(error)
    })
  });

router.delete('/:id', (req, res) => {
      const id =req.params.id
    db("zoos")
      .where({ id })
      .del()
      .then(response => {
        if (response > 0) {
          res.status(204).end()
        } else {
          res.status(404).json({message:"That zoo could not be found"})
        }
      })
      .catch(err => {
      res.status(500).json(err)
    })
  });


module.exports = router;