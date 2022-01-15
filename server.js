// use npm run start:dev not npm start:dev !!!!!!
const mongoose = require('mongoose');
const dotenv = require('dotenv');
process.on('uncaughtException', (err) => {
  console.log(err);
  console.log('server will be shut down due to uncaught exception');
  process.exit(1);
});
const app = require('./index');
dotenv.config({ path: './config.env' });
const port = process.env.PORT || 3000;
const DB = process.env.DATABASE;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log(`connected to database:`);
  })
  .catch((err) => {
    console.log(`failed to connect to databse reason=>${err}`);
  });

const server = app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
process.on('unhandledRejection', (err) => {
  console.log(err);
  console.log('server will be shut down due to unhandled exception');
  server.close(() => {
    process.exit(1);
  });
});
console.log(process.env.NODE_ENV);
