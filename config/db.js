const mongoose = require('mongoose');

// map global promises
mongoose.Promise = global.Promise;
// mongoose connect
mongoose.connect('mongodb://root:root123@ds237848.mlab.com:37848/loginapp').then(() => console.log('MongoDB Connected.')).catch(err => console.log(err));