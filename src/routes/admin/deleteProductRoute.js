const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth');
const Product = require('../../models/productModel');

router.delete('/:id', auth, async (req, res) => {

try {
const { id } = req.params;

// track via console log
console.log("User ID from req.user:", req.user);

const deleteProduct = await Product.findOneAndDelete({ _id: id });

if (!deleteProduct) {
    return res.status(404).json({ message: 'Product not found' })
}

return res.status(200).json({ message: 'Product successfully deleted.' })

} catch (error) {
    // when error
console.error('error deleting the product:', error );
res.status(500).json({ message: 'Internal Server Error', error: error.message })
}
});

module.exports = router;
