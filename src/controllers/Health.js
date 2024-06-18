'use strict';

const mongoose = require('mongoose');
const NodeHog = require('nodehog');

const utils = require('../utils/writer.js');

module.exports.healthCheckGET = (req, res, next, xAPIKEY) => {
  utils.writeJson(res, serverStatus());
};

const serverStatus = () => {
  return {
      state: 'up',
      dbState: mongoose.STATES[mongoose.connection.readyState]
  }
};

module.exports.stressGET = (req, res, next, elemento, tempoStress, tempoFolga, ciclos) => {
  new NodeHog(elemento, tempoStress, tempoFolga, ciclos).start();
  res.send("OK");

}
