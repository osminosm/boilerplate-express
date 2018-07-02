export const ERR_UNKNOWN =                     { code: "00000", status: 500, message: "Unknown Error" };

export const ERR_AUTH_WRONG_CREDENCIALS =      { code: "01001", status: 401, message: "Unauthorized: Wrong Credencials." };
export const ERR_AUTH_CREDENTIALS_BAD_SCHEME = { code: "01002", status: 401, message: "Unauthorized: Format is Authorization: Bearer [token]." };
export const ERR_AUTH_CREDENTIALS_BAD_FORMAT = { code: "01003", status: 401, message: "Unauthorized: Format is Authorization: Bearer [token]." };
export const ERR_AUTH_CREDENTIALS_REQUIRED =   { code: "01004", status: 401, message: "Unauthorized: No authorization token was found." };
export const ERR_AUTH_INVALID_TOKEN =          { code: "01005", status: 401, message: "Unauthorized: Invalid Token." };
export const ERR_AUTH_REVOKED_TOKEN =          { code: "01006", status: 401, message: "Unauthorized: The token has been revoked." };

export const checkAndTransformAuthError = (err) => {
  if (err.name && err.name === 'UnauthorizedError') {
    switch(err.code){
      case 'credentials_bad_scheme': return ERR_AUTH_CREDENTIALS_BAD_SCHEME;
      case 'credentials_bad_format': return ERR_AUTH_CREDENTIALS_BAD_FORMAT;
      case 'credentials_required': return ERR_AUTH_CREDENTIALS_REQUIRED;
      case 'invalid_token': {
        if(err.message) ERR_AUTH_INVALID_TOKEN.message = "Unauthorized: Invalid Token, "+err.message;
        return ERR_AUTH_INVALID_TOKEN;
      }
      case 'revoked_token': return ERR_AUTH_REVOKED_TOKEN;
    }
  }
  return err;
}