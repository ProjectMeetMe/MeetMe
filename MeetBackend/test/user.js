process.env.NODE_ENV = "test";

var db = require("../app/models/sequelize.js");

var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../app.js");
var should = chai.should();

chai.use(chaiHttp);

describe("User Account Tests", function() {

    this.timeout(5000); //sets allowance time to 5 seconds to receive responses

    //Empty the user test database before running this test suite
    before(function(done) {
        db.user.destroy({
            where: {}
        }).then(function() {
            done();
        })
    });

    //Tests for POST /auth/signup
    describe("POST /auth/signup", function() {

        describe("Successful signup", function() {
            it("tests a successful signup request", (done) => {
                var userSignup = {
                    email: "Tester@test.com",
                    password: "TestPass",
                    firstname: "Jim",
                    lastname: "Bob"
                }
                chai.request(server)
                    .post("/auth/signup")
                    .send(userSignup) //send data
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a("object");
                        res.body.should.have.property("message");
                        done();
                    });
            });
        });

        describe("Unuccessful signup", function() {
            it("tests an unsuccessful signup request due to email used before", (done) => {
                var userSignup = {
                    email: "Tester@test.com",
                    password: "12345",
                    firstname: "Steve",
                    lastname: "Rogers"
                }
                chai.request(server)
                    .post("/auth/signup")
                    .send(userSignup) //send data
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a("object");
                        res.body.should.have.property("message");
                        done();
                    });
            });
        });
    });
});
