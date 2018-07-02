import guard from 'express-jwt-permissions';

const getDefaultPermissions = (req) => {
  const resource = req.baseUrl.split('/')[1];
  const mode = req.method.toLowerCase() === 'get' ? 'read' : 'write';
  return [['superuser'], [`${resource}:${mode}`]];
}

const autoguard = () => {
  return (req, res, next) => {
    const permissions = getDefaultPermissions(req);
    return guard().check(permissions)(req, res, next);
  }
}

export default autoguard; 