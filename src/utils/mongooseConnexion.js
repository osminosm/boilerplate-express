import mongoose from 'mongoose';
import { dbConfig } from './config';

const uriFromConfig = (config) => {
  const { hosts, host, port, dbName, username, password } = config;
  const portStr = port ? `:${port}` : '';
  const userStr = username ? username + (!password ? '@' : password + '@') : '';
  const formatHost = (host) => (host.indexOf('@') > -1 ? `${host}${portStr}` : `${userStr}${host}${portStr}`);
  const hostsStr = host ? formatHost(host) : hosts.map(formatHost).join(',');
  return `mongodb://${hostsStr}/${dbName}`;
}

const dbUri = uriFromConfig(dbConfig);
mongoose.connect(dbUri)
  .then(
    () => { console.log(`Connected to db : ${dbUri}`); },
    err => { console.log(`Error connecting to db : ${dbUri}`, err); }
  );

module.exports = mongoose.connection;