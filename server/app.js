const express = require('express');
const app = express();

const path = require('path');

const connectDB = require('./config/db');
connectDB();

const deviceRoutes = require('./routes/devices');
app.use('/api/devices', deviceRoutes);

app.use(express.json());

app.use('/', express.static(path.join(__dirname, '..')));

module.exports = app;