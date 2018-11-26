var db = require("../app/models/sequelize.js");
var moment = require("moment");

var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../app.js");
var should = chai.should();

chai.use(chaiHttp);

var userToken1; //Used for authentication, obtained in "before" function
var userToken2; //2nd user account for testing
var userId1;
var userId2;
var groupId;

describe("Notification Related Tests", function() {

    this.timeout(5000); //sets allowance time to 5 seconds to receive responses

    // Empty the user test database before  running this test suite, and create a test account and group
    before(function(done) {
        db.event.destroy({
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
    before(function(done) {
        db.user.destroy({
            where: {}
        }).then(function() {
            done();
        })
    });
    before(function(done) { //signup
        this.timeout(5000)
        var userSignup = {
            email: "Test@test.com",
            password: "TestPass",
            firstname: "Alan",
            lastname: "Wayne"
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
    before(function(done) { //login
        this.timeout(5000)
        var userLogin = {
            email: "Test@test.com",
            password: "TestPass",
        }
        chai.request(server)
            .post("/auth/signin")
            .send(userLogin)
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a("object");
                userToken1 = res.body.token;
                userId1 = res.body.user.id;
                done();
            });
    });
    before(function(done) { //signup2
        this.timeout(5000)
        var userSignup = {
            email: "Test2@test.com",
            password: "TestPass",
            firstname: "John",
            lastname: "Donald"
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
    before(function(done) { //login2
        this.timeout(5000)
        var userLogin = {
            email: "Test2@test.com",
            password: "TestPass",
        }
        chai.request(server)
            .post("/auth/signin")
            .send(userLogin)
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a("object");
                userToken2 = res.body.token;
                userId2 = res.body.user.id;
                done();
            });
    });
    before(function(done) { //create group using user 1
        this.timeout(5000)
        chai.request(server)
            .post("/group/createGroup")
            .set("Authorization", "Bearer " + userToken1)
            .send({
                groupName: "TestGroup"
            })
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("groupInfo");
                groupId = res.body.groupInfo.id;
                done();
            });
    });
    before(function(done) { //User 2 joins group 1
		this.timeout(5000)
        chai.request(server)
            .post("/group/joinGroup?groupId=" + groupId)
            .set("Authorization", "Bearer " + userToken2)
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("message");
                res.body.message.should.be.eql("Successful group member join");
                done();
            });
    });
	before(function(done) { //create test event
		this.timeout(5000)
		var eventForm = {
			eventName: "Test Event",
			description: "This is the description for my event",
			startTime: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
			endTime: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
		};

		chai.request(server)
			.post("/event/addEvent?groupId=" + groupId)
			.set("Authorization", "Bearer " + userToken1)
			.send(eventForm)
			.end(function(err, res) {
				res.should.have.status(200);
				res.body.should.be.a("object");
				res.body.should.have.property("message");
				res.body.message.should.be.eql("Successful event add");
				eventId = res.body.newEventInfo.id;
				done();
			});
	})


    /* ACTUAL TESTS */

    //Test GET /notification/getNotifications
    describe("GET /notification/getNotifications", function() {

        it("Successful event add to group", function(done) {
            chai.request(server)
                .get("/notification/getNotifications")
                .set("Authorization", "Bearer " + userToken2)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("message");
                    res.body.message.should.be.eql("Successful notification retrieval");
					res.body.should.have.property("notifications");
					res.body.notifications.should.have.length(1);
                    done();
                });
        });

    });



    // Empty the user test database after running this test suite
    after(function(done) {
        db.event.destroy({
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
    after(function(done) {
        db.user.destroy({
            where: {}
        }).then(function() {
            done();
        })
    });

});
