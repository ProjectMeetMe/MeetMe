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

describe("Group Related Tests", function() {

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
				userId2= res.body.user.id;
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
	})

	/* ACTUAL TESTS */

    //Test PUT /group/editGroup
    describe("PUT /group/editGroup", function() {
		var groupEditForm = {
			groupName: "New name!"
		}

        it("Successful event add to group", function(done) {
            chai.request(server)
                .put("/group/editGroup?groupId=" + groupId)
                .set("Authorization", "Bearer " + userToken1)
                .send(groupEditForm)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
					res.body.should.have.property("message");
					res.body.message.should.be.eql("Successful group edit")
                    done();
                });
        });

		it("Check that group name was updated in db", function(done) {
			chai.request(server)
				.get("/group/getGroupInfo?groupId=" + groupId)
				.set("Authorization", "Bearer " + userToken1)
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.be.a("object");
				 	res.body.groupInfo.should.have.property("groupName");
					res.body.groupInfo.groupName.should.be.eql(groupEditForm.groupName);
					done();
				});
		});

		it("Unsuccessful event add to group due to invalid permissions", function(done) {
			chai.request(server)
				.put("/group/editGroup?groupId=" + groupId)
				.set("Authorization", "Bearer " + userToken2)
				.send(groupEditForm)
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.body.should.have.property("message");
					res.body.message.should.be.eql("Error: Invalid group permissions")
					done();
				});
		});

		it("Unsuccessful event add to group due to non-existant group", function(done) {
			chai.request(server)
				.put("/group/editGroup?groupId=-1")
				.set("Authorization", "Bearer " + userToken2)
				.send(groupEditForm)
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.body.should.have.property("message");
					res.body.message.should.be.eql("Error: Invalid group id")
					done();
				});
		});

		it("Unsuccessful event add to group due to invalid token", function(done) {
			chai.request(server)
				.post("/group/leaveGroup?groupId=" + groupId)
				.set("Authorization", "Bearer 00000")
				.send(groupEditForm)
				.end(function(err, res) {
					res.should.have.status(401);
					done();
				});
		});

    });


	//Test POST /group/joinGroup and /group/leaveGroup (from user 2)
	describe("POST /group/joingroup and POST /group/leavegroup", function() {

		it("Successful group join", function(done) {
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

		it("Check that user groups was successfully updated", function(done) {
			chai.request(server)
				.get("/user/getGroups")
				.set("Authorization", "Bearer " + userToken2)
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.be.a("object");
					res.body.should.have.property("groups");
					res.body.should.have.property("message");
					res.body.message.should.eql("Successful group retrieval");
					res.body.groups[0].id.should.eql(groupId);
					done();
				});
		});

		it("Successful group leave", function(done) {
			chai.request(server)
				.post("/group/leaveGroup?groupId=" + groupId)
				.set("Authorization", "Bearer " + userToken2)
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.be.a("object");
					res.body.should.have.property("message");
					res.body.message.should.be.eql("Successful group leave");
					done();
				});
		});

		it("Check that user groups was successfully updated", function(done) {
			chai.request(server)
				.get("/user/getGroups")
				.set("Authorization", "Bearer " + userToken2)
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.be.a("object");
					res.body.should.have.property("groups");
					res.body.should.have.property("message");
					res.body.message.should.eql("Successful group retrieval");
					res.body.groups.length.should.eql(0);
					done();
				});
		});

		it("Unsuccessful group leave due to leader attempting to leave", function(done) {
			chai.request(server)
				.post("/group/leaveGroup?groupId=" + groupId)
				.set("Authorization", "Bearer " + userToken1)
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.body.should.have.property("message");
					res.body.message.should.be.eql("Error: Leader of group cannot leave");
					done();
				});
		});

		it("Unsuccessful group leave because user is not in group", function(done) {
			chai.request(server)
				.post("/group/leaveGroup?groupId=" + groupId)
				.set("Authorization", "Bearer " + userToken2)
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.body.should.have.property("message");
					res.body.message.should.be.eql("Error: User is not a member of this group");
					done();
				});
		});

		it("Unsuccessful group leave due to non-existant group", function(done) {
			chai.request(server)
				.post("/group/leaveGroup?groupId=-1")
				.set("Authorization", "Bearer " + userToken2)
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.body.should.have.property("message");
					res.body.message.should.be.eql("Error: Invalid group id");
					done();
				});
		});

		it("Unsuccessful group leave add due to invalid token", function(done) {
			chai.request(server)
				.post("/group/leaveGroup?groupId=" + groupId)
				.set("Authorization", "Bearer 00000")
				.end(function(err, res) {
					res.should.have.status(401);
					done();
				});
		});

	});


	//Test POST /group/joinGroup and /group/removeMember (from user 2)
	describe("POST /group/joingroup and PUT /group/removeMember", function() {

		it("Successful group join", function(done) {
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

		it("Check that user groups was successfully updated", function(done) {
			chai.request(server)
				.get("/user/getGroups")
				.set("Authorization", "Bearer " + userToken2)
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.be.a("object");
					res.body.should.have.property("groups");
					res.body.should.have.property("message");
					res.body.message.should.eql("Successful group retrieval");
					res.body.groups[0].id.should.eql(groupId);
					done();
				});
		});

		it("Successful member removal", function(done) {
			chai.request(server)
				.put("/group/removeMember?groupId=" + groupId)
				.set("Authorization", "Bearer " + userToken1)
				.send({userId: userId2})
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.be.a("object");
					res.body.should.have.property("message");
					res.body.message.should.eql("Successful member remove");
					done();
				});
		});

		it("Check that user groups was successfully updated", function(done) {
			chai.request(server)
				.get("/user/getGroups")
				.set("Authorization", "Bearer " + userToken2)
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.be.a("object");
					res.body.should.have.property("groups");
					res.body.should.have.property("message");
					res.body.message.should.eql("Successful group retrieval");
					res.body.groups.length.should.eql(0);
					done();
				});
		});

		it("Unsuccessful member removal due to insufficient permissions", function(done) {
			chai.request(server)
				.put("/group/removeMember?groupId=" + groupId)
				.set("Authorization", "Bearer " + userToken2)
				.send({userId: userId1})
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.body.should.have.property("message");
					res.body.message.should.be.eql("Error: Invalid group permissions")
					done();
				});
		});

		it("Unsuccessful member removal due to attempt to remove self", function(done) {
			chai.request(server)
				.put("/group/removeMember?groupId=" + groupId)
				.set("Authorization", "Bearer " + userToken1)
				.send({userId: userId1})
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.body.should.have.property("message");
					res.body.message.should.be.eql("Error: User cannot remove self")
					done();
				});
		});

		it("Unsuccessful member removal due to attempt to remove nonexistant member", function(done) {
			chai.request(server)
				.put("/group/removeMember?groupId=" + groupId)
				.set("Authorization", "Bearer " + userToken1)
				.send({userId: userId2})
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.body.should.have.property("message");
					res.body.message.should.be.eql("Error: User does not exist in group")
					done();
				});
		});

		it("Unsuccessful member removal due to non-existant group", function(done) {
			chai.request(server)
				.put("/group/removeMember?groupId=-1")
				.set("Authorization", "Bearer " + userToken1)
				.send({userId: userId2})
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.body.should.have.property("message");
					res.body.message.should.be.eql("Error: Invalid group id")
					done();
				});
		});

		it("Unsuccessful member removal add due to invalid token", function(done) {
			chai.request(server)
				.put("/group/removeMember?groupId=" + groupId)
				.set("Authorization", "Bearer 00000")
				.send({userId: userId2})
				.end(function(err, res) {
					res.should.have.status(401);
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
