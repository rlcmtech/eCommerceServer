const express = require('express');
const router = express.Router();

router.post('/products', (req, res) => {
    res.send("This is add the product route")
});

module.exports = router