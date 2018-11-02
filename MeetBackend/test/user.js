process.env.NODE_ENV = "test";

var db = require("../app/models/sequelize.js");

var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../app.js");
var should = chai.should();

chai.use(chaiHttp);

describe("User Account Related Tests", function() {

    var token; //holder for authentication token

    this.timeout(5000); //sets allowance time to 5 seconds to receive responses

    //Empty the user test database before and after running this test suite
    before(function(done) {
        db.user.destroy({
            where: {}
        }).then(function() {
            done();
        })
    });
    after(function(done) {
        db.user.destroy({
            where: {}
        }).then(function() {
            done();
        })
    });

    describe("POST /auth/signup", function() {
        it("Create a fresh account", function(done) {
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
    });

    describe("POST /auth/signin", function() {
        it("Log into fresh account and receive authorization token", function(done) {
            var userLogin = {
                email: "Tester@test.com",
                password: "TestPass"
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
                    token = res.body.token;
                    done();
                });
        });
    });


    //Tests for GET /user/profile
    describe("GET /user/profile", function() {

        it("Successful retrieval to user profile info", function(done) {
            chai.request(server)
                .get("/user/profile")
                .set("Authorization", "Bearer " + token)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("id");
                    res.body.should.have.property("firstname");
                    res.body.should.have.property("lastname");
                    res.body.should.have.property("schedule");
                    res.body.should.have.property("email");
                    done();
                });
        });

        it("Unsuccessful retrieval of user profile info due to invalid auth token", function(done) {
            chai.request(server)
                .get("/user/profile")
                .set("Authorization", "Bearer " + "12345")
                .end(function(err, res) {
                    res.should.have.status(401); //code for unauthorized
                    done();
                });
        });
    });


    //Tests for GET /user/getGroups
    describe("GET /user/getGroups", function() {

        it("Successful retrieval to user group info", function(done) {
            chai.request(server)
                .get("/user/getGroups")
                .set("Authorization", "Bearer " + token)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("groups");
                    res.body.should.have.property("message");
                    res.body.message.should.eql("Successful group retrieval");
                    done();
                });
        });

        it("Unsuccessful retrieval of user profile info due to invalid auth token", function(done) {
            chai.request(server)
                .get("/user/getGroups")
                .set("Authorization", "Bearer " + "12345")
                .end(function(err, res) {
                    res.should.have.status(401); //code for unauthorized
                    done();
                });
        });
    });


    //Tests for POST /user/editSchedule
    describe("POST /user/editSchedule", function() {

        var scheduleForm = {
            schedule: {
                Monday: [0, 1.5, 2],
                Tuesday: [],
                Wednesday: [15.5, 16],
                Thursday: [],
                Friday: [23.5],
                Saturday: [],
                Sunday: []
            }
        }

        it("Successful edit schedule", function(done) {
            chai.request(server)
                .put("/user/editSchedule")
                .set("Authorization", "Bearer " + token)
                .send(scheduleForm)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("message");
                    res.body.message.should.eql("Successful schedule update");
                    done();
                });
        });

        it("Check that successful edit schedule has updated the DB", function(done) {
            chai.request(server)
                .get("/user/profile")
                .set("Authorization", "Bearer " + token)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("schedule");
                    res.body.schedule.Monday.should.eql(scheduleForm.schedule.Monday);
					res.body.schedule.Tuesday.should.eql(scheduleForm.schedule.Tuesday);
					res.body.schedule.Wednesday.should.eql(scheduleForm.schedule.Wednesday);
					res.body.schedule.Thursday.should.eql(scheduleForm.schedule.Thursday);
					res.body.schedule.Friday.should.eql(scheduleForm.schedule.Friday);
					res.body.schedule.Saturday.should.eql(scheduleForm.schedule.Saturday);
					res.body.schedule.Sunday.should.eql(scheduleForm.schedule.Sunday);
                    done();
                });
        });

        it("Unsuccessful update of user schedule due to invalid token", function(done) {
            chai.request(server)
                .put("/user/editSchedule")
                .set("Authorization", "Bearer " + "12345")
				.send(scheduleForm)
                .end(function(err, res) {
                    res.should.have.status(401); //code for unauthorized
                    done();
                });
        });
    });



});
