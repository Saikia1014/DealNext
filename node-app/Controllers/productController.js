
const mongoose = require('mongoose');

let schema = new mongoose.Schema({
  pname: String,
  pdesc: String,
  price: String,
  category: String,
  pimg: String,
  pimg2: String,
  addedBy: mongoose.Schema.Types.ObjectId,
  pLoc: {
    type: {
      type: String,
      enum: ['Point'], // 'location' is an array of coordinates [longitude, latitude]
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      // index: '2dsphere' // Create a 2dsphere index for geospatial queries
    }
  }
})

schema.index({ pLoc: '2dsphere' }); // Create a 2dsphere index for geospatial queries
// schema.index({ pname: 'text', pdesc: 'text', price: 'text' }); // Create a text index for search queries

const Products = mongoose.model('Products', schema);

module.exports.search = (req, res) => {

  console.log(req.query)
  let latitude = Number(req.query.loc.split(',')[0]);
  let longitude = Number(req.query.loc.split(',')[1]);
  let search = req.query.search;

  Products.find({
    $or: [
      { pname: { $regex: search } },
      { pdesc: { $regex: search } },
      { price: { $regex: search } },
    ],
    pLoc: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude]
        },
        $maxDistance: 5 * 1000000 // 50000 km
      }
    }
  })
    .then((results) => {
      res.send({ message: 'success', products: results })
    })
    .catch((err) => {
      res.send({ message: 'server err' })
    })
}

module.exports.addProduct =  (req, res) => {

  console.log(req.files);
  console.log(req.body);

  const plati = Number(req.body.plati);
  const plongi = Number(req.body.plongi);
  // const plati = req.body.plati;
  // const plongi = req.body.plongi;
  const pname = req.body.pname;
  const pdesc = req.body.pdesc;
  const price = req.body.price;
  const category = req.body.category;
  // const pimg = req.files.pimg[0].path;
  // const pimg2 = req.files.pimg2[0].path;
  const addedBy = req.body.userId;
  const pimg = req.files.pimg && req.files.pimg[0] ? req.files.pimg[0].path : '';
  const pimg2 = req.files.pimg2 && req.files.pimg2[0] ? req.files.pimg2[0].path : '';

  const product = new Products({
    pname, pdesc, price, category, pimg, pimg2, addedBy, pLoc:
      { type: 'Point', coordinates: [plongi, plati] }
  });
  product.save()
    .then(() => {
      res.send({ message: 'saved success' })
    })
    .catch((err) => {
      res.send({ message: 'server err', error: err.message })
    })
}

module.exports.getProducts = (req, res) => {
  const catName = req.query.catName;

  let _f = {}

  if (catName) {
    _f = { category: catName }
  }

  Products.find(_f)
    .then((result) => {
      res.send({ message: 'success', products: result })
    })
    .catch((err) => {
      res.send({ message: 'server err' })
    })
}

module.exports.getProductsById = (req, res) => {

  console.log(req.params);

  Products.findOne({ _id: req.params.pId })
    .then((result) => {
      res.send({ message: 'success', product: result })
    })
    .catch((err) => {
      res.send({ message: 'server err' })
    })
}

module.exports.myProducts = (req, res) => {

  const userId = req.body.userId;

  Products.find({ addedBy: userId })
    .then((result) => {
      res.send({ message: 'Success.', products: result })
    })
    .catch((err) => {
      console.log(err);
      res.send({ message: 'server err.' })
    })

}

