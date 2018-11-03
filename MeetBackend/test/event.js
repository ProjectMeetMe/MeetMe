process.env.NODE_ENV = "test";

var db = require("../app/models/sequelize.js");
var moment = require("moment");

var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../app.js");
var should = chai.should();

chai.use(chaiHttp);

var userToken; //Used for authentication, obtained in "before" function
var groupId;
var eventId;

describe("Event Related Tests", function() {

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
	            userToken = res.body.token;
	            done();
	        });
	});
	before(function(done) { //create group
		this.timeout(5000)
		chai.request(server)
			.post("/group/createGroup")
			.set("Authorization", "Bearer " + userToken)
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
	})
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
			.set("Authorization", "Bearer " + userToken)
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

    //Test POST /event/addEvent
    describe("POST /event/addEvent", function() {
        var eventForm = {
            eventName: "Test Event 2",
            description: "This is the description for my event",
            startTime: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            endTime: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
        };

        it("Successful event add to group", function(done) {
            chai.request(server)
                .post("/event/addEvent?groupId=" + groupId)
                .set("Authorization", "Bearer " + userToken)
                .send(eventForm)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
					res.body.should.have.property("message");
					res.body.message.should.be.eql("Successful event add")
                    done();
                });
        });

		it("Check that event was successfully added", function(done) {
			chai.request(server)
				.get("/group/getEvents?groupId=" + groupId)
				.set("Authorization", "Bearer " + userToken)
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.be.a("object");
					res.body.should.have.property("events");
					eventsKey = moment.utc(Date.now()).format("YYYY-MM-DD");
					res.body.events.categorizedEvents[eventsKey].should.have.length(2);
					done();
				});
		});

    });

	//Test PUT /event/editEvent
	describe("PUT /event/editEvent", function() {
		var eventEditForm = {
			eventName: "Test Event Edit",
			description: "This is the new description for my event",
			startTime: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
			endTime: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
		};

		it("Successful event update", function(done) {
			chai.request(server)
				.put("/event/editEvent?eventId=" + eventId)
				.set("Authorization", "Bearer " + userToken)
				.send(eventEditForm)
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.be.a("object");
					res.body.should.have.property("message");
					res.body.message.should.be.eql("Successful event update")
					done();
				});
		});

		it("Check that event was successfully updated", function(done) {
			chai.request(server)
				.get("/group/getEvents?groupId=" + groupId)
				.set("Authorization", "Bearer " + userToken)
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.be.a("object");
					res.body.should.have.property("events");
					eventsKey = moment.utc(Date.now()).format("YYYY-MM-DD");
					res.body.events.categorizedEvents[eventsKey][0].description.should.be.eql(eventEditForm.description);
					done();
				});
		});

		it("Unsuccessful event update due to invalid user token", function(done) {
			chai.request(server)
				.put("/event/editEvent?eventId=" + eventId)
				.set("Authorization", "Bearer " + "12345")
				.send(eventEditForm)
				.end(function(err, res) {
					res.should.have.status(401); //code for unauthorized
					done();
				});
		});

	});

	//Test PUT /event/editEvent
	describe("DELETE /event/deleteEvent", function() {

		it("Successful event deletion", function(done) {
			chai.request(server)
				.delete("/event/deleteEvent?eventId=" + eventId)
				.set("Authorization", "Bearer " + userToken)
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.be.a("object");
					res.body.should.have.property("message");
					res.body.message.should.be.eql("Successful event deletion")
					done();
				});
		});

		it("Check that event database was successfully updated", function(done) {
			chai.request(server)
				.get("/group/getEvents?groupId=" + groupId)
				.set("Authorization", "Bearer " + userToken)
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.be.a("object");
					res.body.should.have.property("events");
					eventsKey = moment.utc(Date.now()).format("YYYY-MM-DD");
					res.body.events.categorizedEvents[eventsKey].should.have.length(1);
					done();
				});
		});


		it("Unsuccessful event deletion due to invalid user token", function(done) {
			chai.request(server)
				.delete("/event/deleteEvent?eventId=" + eventId)
				.set("Authorization", "Bearer " + "12345")
				.end(function(err, res) {
					res.should.have.status(401); //code for unauthorized
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
