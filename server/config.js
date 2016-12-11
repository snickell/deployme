var CONFIG_KEYS = {
    BASE_URL: { default: '/elicitation' },
    STANDALONE: { default: false, json: true },
    STANDALONE_ADMIN_PASSWORD: { default: "may all your elicitations be true"},
    SEQUELIZE_CONFIG: { json: true },
    AUTH_URL: { default: "/authenticate-access-to-elicitation/" }
}

var mssqlConstringToSequelizeConfig = require('./mssql-constring-to-sequelize-config');

var ENV_PREFIX="ELICITATION_";

function getConfig (key) {
    var value=undefined;
    
    var keyProps = CONFIG_KEYS[key];
    if (keyProps) {
        var envVal = process.env[ENV_PREFIX + key];
        value = (keyProps.json && envVal ? JSON.parse(envVal) : envVal) || keyProps.default;
    } else {
        throw "config.get(): " + key + " is not a valid config key";
    }
        
    if (key === "SEQUELIZE_CONFIG" && process.env['SQLAZURECONNSTR_DefaultConnection']) {
        value = value || mssqlConstringToSequelizeConfig(process.env['SQLAZURECONNSTR_DefaultConnection']);
    }
    
    return value
}

function isDefault(key) {
  return getConfig(key) === CONFIG_KEYS[key].default;
}

function haventSetAdminPassword() {
  return isDefault("STANDALONE_ADMIN_PASSWORD");
}

module.exports.get = getConfig;
module.exports.isDefault = isDefault;
module.exports.haventSetAdminPassword = haventSetAdminPassword;