const mongoose = require('mongoose');
const express = require('express');
const test = require('../kubitsa/bank');
const { Bed, validateBed } = require('../../models/bed');

const router = express.Router();

module.exports = router;