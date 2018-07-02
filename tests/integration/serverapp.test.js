import 'babel-polyfill';
import chai from 'chai';
import chaiHttp from 'chai-http';
var mongoose = require('mongoose');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

import config from '../../src/utils/config';
config.serverConfig.port = 20180;

let app = null;

const should = chai.should();

chai.use(chaiHttp);

describe('Server app general integration', () => {

  before((done) => {
    mockgoose.prepareStorage().then(function () {
      app = require('../../src/app');
      done();
    });
  });


  describe('Server responds', () => {
    it('GET / should respond with a 401', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

});
