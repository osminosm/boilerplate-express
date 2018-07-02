import 'babel-polyfill';
import chai from 'chai';
import chaiHttp from 'chai-http';
var mongoose = require('mongoose');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

import jwt from 'jsonwebtoken';

import config from '../../src/utils/config';
config.serverConfig.port = 20180;

const should = chai.should();

chai.use(chaiHttp);

const goodCredencials = { username: 'gooduser', password: 'pwasweird1234' };
const badCredencials = { username: 'baduser', password: 'paswworddd!!a' };

let app = null;
const UserModel = require('../../src/models/User');

describe('ROUTE /auth', () => {

  before((done) => {
    mockgoose.prepareStorage().then(async () => {
      app = require('../../src/app');
      const modelUser = new UserModel(goodCredencials);
      await modelUser.save();
      done();
    });
  });

  describe('POST /auth/token { username, password }', () => {

    it('should respond with 200 and valid token to valid credencials', (done) => {
      chai.request(app)
        .post('/auth/token')
        .send(goodCredencials)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('access_token');

          const decodedToken = jwt.decode(res.body.access_token);
          decodedToken.should.have.property('userType', 'account');
          decodedToken.should.have.property('data');
          decodedToken.should.have.property('permissions');
          decodedToken.data.should.have.property('username', goodCredencials.username);

          done();
        });
    });

    it('should respond with 401 to invalid credencials', (done) => {
      chai.request(app)
        .post('/auth/token')
        .send(badCredencials)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error');
          res.body.error.should.have.property('code', "01001");
          res.body.error.should.have.property('status', 401);
          res.body.error.should.have.property('message');

          done();
        });
    });
  });

  after(async () => {
    return Promise.all([
      UserModel.deleteOne({ username: goodCredencials.username })
    ]);
  });

});
