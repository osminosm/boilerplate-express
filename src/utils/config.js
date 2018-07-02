import args from 'node-args';
import _ from 'lodash';
import fs from 'fs';

const defaultConfig = {
  serverConfig: {
    host: "localhost",
    port: 8080,
    useHttps: false
  },
  morganLogMode: 'dev',
  dbConfig: {
    host: "localhost",
    port: 27017,
    dbName: "brandt-db"
  },
  jwtSecret: '>jsw/?.%^UA:CuOIqr:!%&o9r:_Ic9-X',
  bcryptSaltWorkFactor: 10
};

let config = defaultConfig;
if (args.configFile) {
  if (fs.existsSync(args.configFile)) {
    try {
      const extConfig = JSON.parse(fs.readFileSync(args.configFile));
      config = _.merge(config, extConfig);
    } catch (e) {
      console.log("SERVER WARNING: could not parse external config file. Starting with defaults...");
    }
  } else {
    console.log("SERVER WARNING: could not find external config file. Starting with defaults...");
  }
}

module.exports = config;