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
  
/****************Update a bear in the list***************/

router.put('/:id', (req, res) => {
    db('bears')
     .where({ id: req.params.id })
     .update(req.body)
     .then(response => {
       if(response > 0) {
         db('bears')
         .where({ id: req.params.id })
         .first()
         .then(response => {
           res.status(200).json(response)
         })
       } else {
         res.status(404).json({ message: 'bear not found' })
       }
     })
     .catch(error => {
       res.status(500).json(error)
     })
});
   
//******************Delete a bear in the list******************/

router.delete('/:id', (req, res) => {
    const id =req.params.id
  db("bears")
    .where({ id })
    .del()
    .then(response => {
      if (response > 0) {
        res.status(204).end()
      } else {
        res.status(404).json({message:"That bear could not be found"})
      }
    })
    .catch(err => {
    res.status(500).json(err)
  })
});




module.exports = router;