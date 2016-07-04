const { getFromSpawn, getFromActions } = require('../lib/helper-data');
const Scenario = require('../models/ScenariosModel');
const Promise = require('bluebird');

/* EXTRA CREDIT IDEAS
  // Get database where scenario ID and id is greater than the greatest id
    // Get data from DB where timestamp > the last global Variable
      // And where id scenario equals the one we want
    // set lastpull to the latest timestamp of the data received
    // respond with data from database
*/

const getResultsDataHandler = (socket) =>
  (req) => {
    // console.log('Received request in results controller get data!', req);
    const scenarioID = req.currentScenarioID;

    Promise.all([getFromActions(scenarioID), getFromSpawn(scenarioID)])
      .spread((resultsActions, resultsSpawn) => {
        const combinedData = {
          spawn: resultsSpawn,
          action: resultsActions,
        };
        socket.emit('receiveResultsData', combinedData);
      })
      .catch(err => console.log(err));
  };

// STILL WIP
const completedData = (data) => {
  console.log('Got data from completed data', data);
  const calculated = data.calculated;
  // WIP NEED TO FIX THIS
  Scenario.where('id', data.scenarioID)
    .fetch()
    .then(scenario => {
      scenario.save({
        averageElapsedTime: calculated.averageElapsedTime,
        numberActions: calculated.numberActions,
        numberErrors: calculated.numberErrors,
      }, { patch: true }
    )
    .catch(err => console.log(err));
    });
};

module.exports = { getResultsDataHandler, completedData };
