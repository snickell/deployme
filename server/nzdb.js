var getConfig = require('./config').get;

var Sequelize = require('sequelize');
var colors = require('colors');

function FIXME_monkeyPatchSequelizeForMSSQL() {
  console.warn("NZDB(): monkeypatching ('sequelize/lib/sql-string').dateToString to work with MSSQL datetime columns (see: https://github.com/sequelize/sequelize/issues/3892)");
  var sqlString = require('sequelize/lib/sql-string');
  var dateToString = sqlString.dateToString;
  sqlString.dateToString = (d, tz, dialect) => dateToString(d, tz, 'mysql');  
}


var NZDB = function (sequelizeConfig) {
  var config = sequelizeConfig || getConfig("SEQUELIZE_CONFIG");
  
  console.log("NZDB(): db is " + JSON.stringify(config, null, '\t'));  
  
  config.options = config.options || {};
  
  if (config.options.dialect && config.options.dialect === 'mssql') {
    FIXME_monkeyPatchSequelizeForMSSQL();
  }

  config.options.logging = function(s) {
    console.log(s.green);
  }
  this.sql = new Sequelize(config.database, config.userName, config.password, config.options);

  // this.sql = new Sequelize('seth', 'seth', '', { host: 'localhost', dialect: 'postgres' });
  
  console.log("NZDB(): attempting to connect...");
  
  var self = this;
  function auth() {
      return self.sql.authenticate();
  }
  
  this.ready = auth()
  .catch(function (err) { 
    console.error("NZDB(): couldn't auth with db: ", err);
    console.warn("Trying to connect one more time....");
    return auth()
    .catch(function (err) {
      console.error("NZDB(): second try, couldn't auth with db: ", err);
      console.error("NZDB(): allowing connection to continue, but could NOT AUTHENTICATE WITH DB");
    });
  })
  .then(function () {
    console.error("NZDB(): done");
      return true;      
  });
}

NZDB.prototype.test = function () {
  return this.ready.then( () => this.sql.query("SELECT 5+12"));
}

module.exports = NZDB;
