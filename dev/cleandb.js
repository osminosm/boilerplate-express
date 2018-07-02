import mongooseConnexion from '../src/utils/mongooseConnexion';

import { cleanUsers } from './dataUtility';

Promise.all([
  cleanUsers()
]).then(() => {
  mongooseConnexion.close();
  console.log("Closed DB connexion.");
});