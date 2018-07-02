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

describe('ROUTE /users', () => {
  let UserModel;
  let userWithNoPermissions;
  let userWithPermissions;

  before((done) => {
    mockgoose.prepareStorage().then(function () {
      app = require('../../src/app');
      UserModel = require('../../src/models/User');
      userWithNoPermissions = new UserModel({ username: 'usernoperms', password: 'pass1234' });
      userWithPermissions = new UserModel({ username: 'userwithperms', password: 'pass1234', permissions: 'users:read users:write' });
      done();
    });
  });

  describe('GET /users', () => {

    it('should deny unauthenticated request', (done) => {
      chai.request(app)
        .get('/users')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should autoguard', (done) => {
      const { access_token } = userWithNoPermissions.generateToken();
      chai.request(app)
        .get('/users')
        .set('Authorization', `Bearer ${access_token}`)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });

    it('should list users correctly', async () => {
      const { access_token } = userWithPermissions.generateToken();
      await userWithPermissions.save();
      await userWithNoPermissions.save();
      return new Promise((resolve, reject) => {
        chai.request(app)
          .get('/users')
          .set('Authorization', `Bearer ${access_token}`)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.an('array').that.has.length(2);
            res.body[0].should.have.property('username').that.is.a('string');
            res.body[0].should.have.property('permissions').that.is.a('string');
            res.body[0].should.not.have.property('password');
            res.body[0].should.not.have.property('_id');
            resolve();
          });
      });
    });

    it('should return 204 on empty result', async () => {
      const { access_token } = userWithPermissions.generateToken();
      await mockgoose.helper.reset();
      return new Promise((resolve, reject) => {
        chai.request(app)
          .get('/users')
          .set('Authorization', `Bearer ${access_token}`)
          .end((err, res) => {
            res.should.have.status(204);
            resolve();
          });
      });
    });
    it('should provide an optional { count, page } pagination');
    it('should provide an optional { search } parameter');
  })

  describe('POST /users', () => {
    it('should deny unauthenticated request', (done) => {
      chai.request(app)
        .post('/users')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should autoguard', (done) => {
      const { access_token } = userWithNoPermissions.generateToken();
      chai.request(app)
        .post('/users')
        .set('Authorization', `Bearer ${access_token}`)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });

    it('should add user to db', (done) => {
      const { access_token } = userWithPermissions.generateToken();
      chai.request(app)
        .post('/users')
        .set('Authorization', `Bearer ${access_token}`)
        .send({
          username: 'testuser1',
          password: '12345',
          permissions: 'resource0:read resource0:write resource1:read'
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an('object');
          res.body.should.have.property('_id');
          res.body.should.have.property('username', 'testuser1');
          res.body.should.have.property('permissions', 'resource0:read resource0:write resource1:read');
          done();
        });
    });

    it('should not create duplicate usernames');
  });

  describe('PUT /users/:username', () => {

    it('should deny unauthenticated request', (done) => {
      chai.request(app)
        .put('/users/anyusername')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should autoguard', (done) => {
      const { access_token } = userWithNoPermissions.generateToken();
      chai.request(app)
        .put('/users/anyusername')
        .set('Authorization', `Bearer ${access_token}`)
        .send({ somedata: 'ddddd' })
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });

    it('should edit user successfully', async () => {
      const { access_token } = userWithPermissions.generateToken();
      await (new UserModel({ username: 'editableuser', password: 'pass12345' })).save();
      return new Promise((resolve, reject) => {
        chai.request(app)
          .put('/users/editableuser')
          .set('Authorization', `Bearer ${access_token}`)
          .send({
            permissions: 'resource0:read'
          })
          .end((err, res) => {
            res.should.have.status(200);
            UserModel.findOne({ username: 'editableuser' }).then((user) => {
              user.permissions.should.equal('resource0:read');
              resolve();
            });
          });
      });
    });

    it('should ignore (username or password) editing', async () => {
      const { access_token } = userWithPermissions.generateToken();
      await (new UserModel({ username: 'editableuser', password: 'pass12345' })).save();
      return new Promise((resolve, reject) => {
        chai.request(app)
          .put('/users/editableuser')
          .set('Authorization', `Bearer ${access_token}`)
          .send({
            username: 'editeduser',
            password: 'editedpass'
          })
          .end((err, res) => {
            res.should.have.status(200);
            UserModel.findOne({ username: 'editableuser' }).then((user) => {
              user.username.should.equal('editableuser');
              user.username.should.not.equal('editedpass');
              resolve();
            });
          });
      });
    });
  });

  describe('DELETE /users { username, confirmUsername }', () => {

    it('should deny unauthenticated request', (done) => {
      chai.request(app)
        .delete('/users')
        .send({ username: 'anyusername', confirmUsername: 'anyusername' })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should autoguard', (done) => {
      const { access_token } = userWithNoPermissions.generateToken();
      chai.request(app)
        .delete('/users')
        .set('Authorization', `Bearer ${access_token}`)
        .send({ username: 'anyusername', confirmUsername: 'anyusername' })
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });

    it('should delete user successfully', async () => {
      const { access_token } = userWithPermissions.generateToken();
      await (new UserModel({ username: 'johndoe', password: 'pass12345' })).save();
      return new Promise((resolve, reject) => {
        chai.request(app)
          .delete('/users')
          .set('Authorization', `Bearer ${access_token}`)
          .send({
            username: 'johndoe',
            confirmUsername: 'johndoe'
          })
          .end((err, res) => {
            res.should.have.status(200);
            UserModel.findOne({ username: 'johndoe' }).then((user) => {
              (user === null).should.equal(true);
              resolve();
            });
          });
      });
    });
  });

  afterEach(() => {
    return mockgoose.helper.reset();
  });

});
