var express = require('express');
var router = express.Router();

/* GET home page. */
router
      .route('/')
      .get((req,res) => {
        res.send('Welcome to Sybrin Employee Management system')
      })


module.exports = router;
