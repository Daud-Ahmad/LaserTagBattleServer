// const mongoose = require('mongoose');
// const config = require('config');

// const db = config.get('mongoURI');

// const connectDB = async () => {
//   try {
//     await mongoose.connect(db, {
//       useNewUrlParser: true,
//       useFindAndModify: false
//     });

//     console.log('MongoDB Connected...');
//   } catch (err) {
//     console.log('Error occured...');
//     console.error(err.message);
//     // Exit process with failure...
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

//local connection
const mongoose = require('mongoose');
const config = require('config');

// const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    // await mongoose.connect(db, {
    //   useNewUrlParser: true,
    //   useFindAndModify: false
    // });

    mongoose.connect('mongodb://localhost/LaserTagBattleee', {
      useNewUrlParser: true,
      useFindAndModify: false
    });
    mongoose.connection
      .once('open', function() {
        console.log('MongoDB Connected...');
      })
      .on('error', function(error) {
        console.log('Connection error');
      });
  } catch (err) {
    console.log('Error occured...');
    console.error(err.message);
    // Exit process with failure...
    process.exit(1);
  }
};

module.exports = connectDB;
