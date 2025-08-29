const express = require('express')
const cors = require('cors')
const path = require('path');
var jwt = require('jsonwebtoken'); //give a token with the message
const multer = require('multer') //multer is primarily use for upload files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

// const upload = multer({ dest: 'uploads/' })
const bodyParser = require('body-parser')
const app = express()
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(multer.urlencoded({ extended:true }));
// app.use(multer.json());

const port = 4000
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test')

const Users = mongoose.model('Users', {
  username: String,
  mobile: String,
  email: String,
  password: String,
  likedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Products' }]
});

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


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/search', (req, res) => {

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
})


app.post('/like-product', (req, res) => {
  let productId = req.body.productId;
  let userId = req.body.userId;

  // console.log(req.body);

  Users.updateOne({ _id: userId }, { $addToSet: { likedProducts: productId } })
    .then(() => {
      res.send({ message: 'liked success.' })
    })
    .catch(() => {
      res.send({ message: 'server err.' })
    })

})
app.post('/my-products', (req, res) => {

  const userId = req.body.userId;

  Products.find({ addedBy: userId })
    .then((result) => {
      res.send({ message: 'Success.', products: result })
    })
    .catch((err) => {
      console.log(err);
      res.send({ message: 'server err.' })
    })

})


app.post('/add-product', upload.fields([{ name: 'pimg' }, { name: 'pimg2' }]), (req, res) => {

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
})


app.get('/get-products', (req, res) => {
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
})

app.get('/get-product/:pId', (req, res) => {

  console.log(req.params);

  Products.findOne({ _id: req.params.pId })
    .then((result) => {
      res.send({ message: 'success', product: result })
    })
    .catch((err) => {
      res.send({ message: 'server err' })
    })
})

app.post('/liked-products', (req, res) => {
  Users.findOne({ _id: req.body.userId }).populate('likedProducts')
    .then((result) => {
      res.send({ message: 'success', products: result.likedProducts })
    })
    .catch((err) => {
      res.send({ message: 'server err' })
    })
})

// app.get('/like-product', (req, res) => {

//   Users.find().populate('likedProducts')
//     .then((result) => {
//       res.send({ message: 'success', products: result })
//     })
//     .catch((err) => {
//       res.send({ message: 'server hmgdmg err' })
//     })
// })


app.post('/signup', (req, res) => {
  // console.log(req.body);

  const username = req.body.username;
  const password = req.body.password;
  const mobile = req.body.mobile;
  const email = req.body.email;
  const user = new Users({ username: username, password: password, mobile: mobile, email: email });
  user.save()
    .then(() => {
      res.send({ message: 'saved success.' })
    })
    .catch(() => {
      res.send({ message: 'server err.' })
    })

})

app.get('/my-profile/:userId', (req, res) => {
  let uid = req.params.userId

  Users.findOne({ _id: uid })
    .then((result) => {
      res.send({
        message: 'Success.', user: {
          email: result.email,
          mobile: result.mobile,
          username: result.username,
        }
      })
    })
    .catch(() => {
      res.send({ message: 'server err.' })
    })
  // return;
})

// app.get('/my-profile/:userId', (req, res) => {
//   let uid = req.params.userId;

//   Users.findOne({ _id: uid })
//     .then((result) => {
//       if (!result) {
//         res.send({ message: 'user not found.' });
//         return;
//       }
//       res.send({
//         message: 'Success.', user: {
//           email: result.email,
//           mobile: result.mobile,
//           username: result.username,
//         }
//       });
//     })
//     .catch(() => {
//       res.send({ message: 'server err.' });
//     });
// });

app.get('/get-user/:uId', (req, res) => {

  const _userId = req.params.uId;
  Users.findOne({ _id: _userId })
    .then((result) => {
      res.send({
        message: 'success.', user: {
          username: result.username,
          mobile: result.mobile,
          email: result.email
        }
      })
    })
    .catch(() => {
      res.send({ message: 'server err.' })
    })
})

app.post('/login', (req, res) => {
  // console.log(req.body);

  const username = req.body.username;
  const password = req.body.password;
  // const user = new Users({ username: username , password: password });

  Users.findOne({ username: username })
    .then((result) => {
      // console.log(result, "user data")
      if (!result) {
        res.send({ message: 'user not found.' })
      } else {
        if (result.password == password) {
          const token = jwt.sign({
            data: result
          }, 'MyKey', { expiresIn: '1h' }); //here MyKey is the decode pass of my token
          res.send({ message: 'find success.', token: token, userId: result._id })
        }
        if (result.password != password) {
          res.send({ message: 'Wrong Password.' })
        }
      }

    })
    .catch(() => {
      res.send({ message: 'server err.' })
    })

})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
