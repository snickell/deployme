var ncsBuilder = require('node-connection-string-builder');

function connectionStringToConfig(connectionString) {
  var config = {
    userName: undefined,
    password: undefined,
    database: undefined,
    options: {
      host: undefined,      
      dialect: 'mssql',
      pool: {
        max: 5,
        min: 0,
        idle: 20000
      },      
      dialectOptions: {
        debug: {
          packet: true,
          data: true,
          payload: true,
          token: false,
          log: true
        },
        encrypt: true // for Azure users
      }
    }
  };
    
  var builder=new ncsBuilder(connectionString);
  if (builder.dataSource) {
    var ds=builder.dataSource.split('\\', 2);
    config.options.host=ds[0] || config.options.host; 
    var instanceName=ds[1] || config.options.dialectOptions.instanceName;
    if (instanceName)
      config.options.dialectOptions.instanceName=instanceName;
  }
  config.userName=builder.userID || config.userName;
  config.password=builder.password || config.password;
  config.database=builder.initialCatalog || config.options.dialectOptions.database;
  config.options.dialectOptions.encrypt=builder.encrypt || config.options.dialectOptions.encrypt;

  return config;
}

module.exports = connectionStringToConfig;