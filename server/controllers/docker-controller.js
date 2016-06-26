// if (process.env.NODE_ENV === 'development') {
const dockerConnection = require('../config/docker-config');
// }

const util = require('../lib/utils');

const status = {
  masterCount: 0,
  workerCount: 0,
};

const createMaster = (req, res) => {
  status.masterCount++;
  const masterName = 'master'.concat(status.masterCount);
  return util.createContainer(dockerConnection, 'node-sender', masterName);
};

const createWorker = (req, res) => {
  status.workerCount++;
  const workerName = 'worker'.concat(status.workerCount);
  util.createContainer(dockerConnection, 'node-sender', workerName, req, res);
};

module.exports = { createMaster, createWorker };
