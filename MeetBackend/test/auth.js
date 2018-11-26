var db = require("../app/models/sequelize.js");

var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../app.js");
var should = chai.should();

chai.use(chaiHttp);

describe("Account Signup and Login Tests", function() {

    this.timeout(5000); //sets allowance time to 5 seconds to receive responses

    // Empty the user test database before running this test suite
    before(function(done) {
        db.user.destroy({
            where: {}
        }).then(function() {
            done();
        })
    });
    before(function(done) {
        db.group.destroy({
            where: {}
        }).then(function() {
            done();
        })
    });

    //Tests for POST /auth/signup
    describe("POST /auth/signup", function() {

        it("Test a successful signup request", function(done) {
            var userSignup = {
                email: "Tester@test.com",
                password: "TestPass",
                firstname: "Jim",
                lastname: "Bob"
            }
            chai.request(server)
                .post("/auth/signup")
                .send(userSignup)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("message");
                    res.body.message.should.be.eql("Successful signup");
                    done();
                });
        });

        it("Test an unsuccessful signup request due to email used before", function(done) {
            var userSignup = {
                email: "Tester@test.com",
                password: "12345789",
                firstname: "Steve",
                lastname: "Rogers"
            }
            chai.request(server)
                .post("/auth/signup")
                .send(userSignup)
                .end(function(err, res) {
                    res.should.have.status(400);
                    res.body.should.be.a("object");
                    res.body.should.have.property("message");
                    res.body.message.should.be.eql("Error: That email is already taken");
                    done();
                });
        });

        it("Test an unsuccessful signup request due to invalid email format", function(done) {
            var userSignup = {
                email: "Jim123",
                password: "123fdsffdaf",
                firstname: "Jim",
                lastname: "Jo"
            }
            chai.request(server)
                .post("/auth/signup")
                .send(userSignup)
                .end(function(err, res) {
                    res.should.have.status(400);
                    res.body.should.be.a("object");
                    res.body.message.should.be.eql("Error: Invalid email format");
                    done();
                });
        });

    });


    //Tests for POST /auth/signin
    describe("POST /auth/signin", function() {

        it("Test a successful login request", function(done) {
            var userLogin = {
                email: "Tester@test.com",
                password: "TestPass",
            }
            chai.request(server)
                .post("/auth/signin")
                .send(userLogin)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("message");
                    res.body.message.should.be.eql("Successful login");
                    res.body.should.have.property("user");
                    res.body.should.have.property("token");
                    //tests.token = res.body.token;
                    done();
                });
        });


        it("Test an unsuccessful login request due to incorrect email", function(done) {
            var userLogin = {
                email: "Tester1@test.com",
                password: "12345",
            }
            chai.request(server)
                .post("/auth/signin")
                .send(userLogin)
                .end(function(err, res) {
                    res.should.have.status(400);
                    res.body.should.be.a("object");
                    res.body.should.have.property("message");
                    res.body.message.should.be.eql("Error: Email does not exist");
                    done();
                });
        });
    });


	//Tests for POST /auth/forgotPassword
    describe("POST /auth/forgotPassword", function() {

        it("Unsuccessful forgot password due to email not existing", function(done) {
            var email = {
                email: "Tester12345@test.com"
            }
            chai.request(server)
                .post("/auth/forgotPassword")
                .send(email)
                .end(function(err, res) {
                    res.should.have.status(400);
                    res.body.should.be.a("object");
                    res.body.should.have.property("message");
                    res.body.message.should.be.eql("Error: email does not belong to any account");
                    done();
                });
        });

    });

	// Empty the user test database after running this test suite
    after(function(done) {
        db.user.destroy({
            where: {}
        }).then(function() {
            done();
        })
    });
    after(function(done) {
        db.group.destroy({
            where: {}
        }).then(function() {
            done();
        })
    });

});
