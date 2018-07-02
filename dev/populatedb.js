import mongooseConnexion from '../src/utils/mongooseConnexion';

import { createUser } from './dataUtility';


Promise.all([
  createUser('admin', 'admin', 'superuser'),
  createUser('johndoe', 'password123'),
]).then(() => {
  mongooseConnexion.close();
  console.log("Closed DB connexion.");
});
