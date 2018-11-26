var db = require("../app/models/sequelize.js");
var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../app.js");
var should = chai.should();

chai.use(chaiHttp);

var userToken; //Used for authentication, obtained in "before" function
var userToken2;
var userToken3;

describe("User Account Related Tests", function() {

    this.timeout(5000); //sets allowance time to 5 seconds to receive responses

    // Empty the user test database before running this test suite, and create a test account
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
    before(function(done) { //user1
        this.timeout(5000);
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
    before(function(done) {
        this.timeout(5000);
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
	before(function(done) { //user 2
		this.timeout(5000);
		var userSignup = {
			email: "Test2@test.com",
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
	before(function(done) {
		this.timeout(5000);
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
				done();
			});
	});
	before(function(done) {//user 3
		this.timeout(5000);
		var userSignup = {
			email: "Test3@test.com",
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
	before(function(done) {
		this.timeout(5000);
		var userLogin = {
			email: "Test3@test.com",
			password: "TestPass",
		}
		chai.request(server)
			.post("/auth/signin")
			.send(userLogin)
			.end(function(err, res) {
				res.should.have.status(200);
				res.body.should.be.a("object");
				userToken3 = res.body.token;
				done();
			});
	});

    //Tests for GET /user/profile
    describe("GET /user/profile", function() {
        //console.log("USER TEST:")
        it("Successful retrieval to user profile info", function(done) {
            chai.request(server)
                .get("/user/profile")
                .set("Authorization", "Bearer " + userToken)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("user");
                    done();
                });
        });

        it("Unsuccessful retrieval of user profile info due to invalid auth userToken", function(done) {
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
                .set("Authorization", "Bearer " + userToken)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("groups");
                    res.body.should.have.property("message");
                    res.body.message.should.eql("Successful group retrieval");
                    done();
                });
        });

        it("Unsuccessful retrieval of user profile info due to invalid auth userToken", function(done) {
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
                Mon: [0, 1.5, 2],
                Tue: [],
                Wed: [15.5, 16],
                Thu: [],
                Fri: [23.5],
                Sat: [],
                Sun: []
            }
        };

        it("Successful edit schedule", function(done) {
            chai.request(server)
                .put("/user/editSchedule")
                .set("Authorization", "Bearer " + userToken)
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
                .set("Authorization", "Bearer " + userToken)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.user.should.have.property("schedule");
                    res.body.user.schedule.Mon.should.eql(scheduleForm.schedule.Mon);
					res.body.user.schedule.Tue.should.eql(scheduleForm.schedule.Tue);
					res.body.user.schedule.Wed.should.eql(scheduleForm.schedule.Wed);
					res.body.user.schedule.Thu.should.eql(scheduleForm.schedule.Thu);
					res.body.user.schedule.Fri.should.eql(scheduleForm.schedule.Fri);
					res.body.user.schedule.Sun.should.eql(scheduleForm.schedule.Sun);
					res.body.user.schedule.Sat.should.eql(scheduleForm.schedule.Sat);
                    done();
                });
        });

        it("Unsuccessful update of user schedule due to invalid userToken", function(done) {
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

	//Test login + logout
	describe("POST /user/logout", function() {

		it("Successful logout", function(done) {
			chai.request(server)
				.post("/user/logout")
				.set("Authorization", "Bearer " + userToken2)
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.be.a("object");
					res.body.should.have.property("message");
					res.body.message.should.eql("Successful logout");
					done();
				});
		});

		//Unsuccessful access to profile due to prior logout
		it("Unsuccessful profile access", function(done) {
			chai.request(server)
                .get("/user/profile")
                .set("Authorization", "Bearer " + userToken2)
                .end(function(err, res) {
                    res.should.have.status(401);
                    done();
                });
		});
	});

	//Test successful change password
	describe("POST /user/changePassword", function() {

		var changePasswordForm = {
			oldPass: "TestPass",
			newPass: "NewPass",
			confirmPass: "NewPass"
		}

		it("Successful pass change", function(done) {
			chai.request(server)
				.post("/user/changePassword")
				.set("Authorization", "Bearer " + userToken3)
				.send(changePasswordForm)
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.be.a("object");
					res.body.should.have.property("message");
					res.body.message.should.eql("Successful password update");
					res.body.should.have.property("token");
					done();
				});
		});

		it("Login fail due to password change", function(done) {
			var userLogin = {
				email: "Test3@test.com",
				password: "TestPass", //old pass
			}
			chai.request(server)
				.post("/auth/signin")
				.send(userLogin)
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.body.should.have.property("message");
					res.body.message.should.eql("Error: Incorrect password");
					done();
				});
		});

	});

	//Unsuccesful change password calls
	describe("POST /user/changePassword", function() {

		var changePasswordForm1 = {
			oldPass: "WrongPass",
			newPass: "NewPass",
			confirmPass: "NewPass"
		}
		it("Unsuccessful pass change due to incorrect old pass", function(done) {
			chai.request(server)
				.post("/user/changePassword")
				.set("Authorization", "Bearer " + userToken)
				.send(changePasswordForm1)
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.body.should.have.property("message");
					res.body.message.should.eql("Error: Old password is incorrect");
					done();
				});
		});

		var changePasswordForm2 = {
			oldPass: "",
			newPass: "NewPass",
			confirmPass: "NewPass"
		}
		it("Unsuccessful pass change due to no old pass", function(done) {
			chai.request(server)
				.post("/user/changePassword")
				.set("Authorization", "Bearer " + userToken)
				.send(changePasswordForm2)
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.body.should.have.property("message");
					res.body.message.should.eql("Error: Old password is required");
					done();
				});
		});

		var changePasswordForm3 = {
			oldPass: "TestPass",
			newPass: "NewPass1",
			confirmPass: "NewPass2"
		}
		it("Unsuccessful pass change due to non matching new passwords", function(done) {
			chai.request(server)
				.post("/user/changePassword")
				.set("Authorization", "Bearer " + userToken)
				.send(changePasswordForm3)
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.body.should.have.property("message");
					res.body.message.should.eql("Error: New passwords do not match");
					done();
				});
		});

	});


    // Empty the user test database after running this test suite, and create a test account
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
