const fs = require('fs');
const mongoose = require('mongoose');
const tourModel = require('../starter/models/tourModel');
const dotenv = require('dotenv');
const app = require('./index');
dotenv.config({ path: './config.env' });
const port = process.env.PORT || 8000;
const DB = process.env.DATABASE;
const file = JSON.parse(
  fs.readFileSync('./dev-data/data/tours-simple.json', 'utf-8', () => {
    console.log('file was red');
  })
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log(`connected to database:`);
  })
  .catch((err) => {
    console.log(`failed to connect to databse reason=>${err}`);
  });

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

const importData = async () => {
  try {
    await tourModel.create(file);
    console.log('all docs saved!!!!!');
  } catch (e) {
    console.log(e);
  }
};
importData();
