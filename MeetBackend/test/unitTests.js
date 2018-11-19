var assert = require("assert");

var chai = require("chai");
var should = chai.should();
var expect = chai.expect;

var moment = require("moment");

var groupController = require("../app/controllers/group.js");

describe("Unit Tests for Sort Events Function", function() {

    var event1 = {
        id: 1,
        eventName: "Test Event",
        description: "This is the description for my event",
        startTime: "2018-11-18T02:00:00.000Z",
        endTime: "2018-11-18T03:00:00.000Z",
        groupId: 1,
        createdAt: "2018-11-18T09:11:06.000Z",
        updatedAt: "2018-11-18T09:11:06.000Z"
    };

    var event2 = {
        id: 2,
        eventName: "Test Event 2",
        description: "This is the description for my event",
        startTime: "2018-11-18T03:00:00.000Z",
        endTime: "2018-11-18T04:00:00.000Z",
        groupId: 1,
        createdAt: "2018-11-18T09:11:06.000Z",
        updatedAt: "2018-11-18T09:11:06.000Z"
    };

    var event3 = {
        id: 3,
        eventName: "Test Event 3",
        description: "This is the description for my event",
        startTime: "2018-11-16T03:00:00.000Z",
        endTime: "2018-11-17T04:00:00.000Z",
        groupId: 1,
        createdAt: "2018-11-18T09:11:06.000Z",
        updatedAt: "2018-11-18T09:11:06.000Z"
    };

    var event4 = {
        id: 4,
        eventName: "Test Event 4",
        description: "This is the description for my event",
        startTime: "2019-01-17T08:00:00.000Z",
        endTime: "2019-02-17T11:00:00.000Z",
        groupId: 1,
        createdAt: "2018-11-18T09:11:06.000Z",
        updatedAt: "2018-11-18T09:11:06.000Z"
    };

    var event5 = {
        id: 5,
        eventName: "Test Event 5",
        description: "This is the description for my event",
        startTime: "2018-11-17T08:00:00.000Z",
        endTime: "2018-11-17T11:00:00.000Z",
        groupId: 1,
        createdAt: "2018-11-18T09:11:06.000Z",
        updatedAt: "2018-11-18T09:11:06.000Z"
    };

    var date1 = moment.utc(event1.startTime).format("YYYY-MM-DD"); //date of event 1 and 2
    var date2 = moment.utc(event3.startTime).format("YYYY-MM-DD"); //date of event 3
    var date3 = moment.utc(event4.startTime).format("YYYY-MM-DD"); //date of event 4
    var date4 = moment.utc(event5.startTime).format("YYYY-MM-DD"); //date of event 5

    it("0 events", function() {
        var events = [];
        sortedEvents = groupController.sortEvents(events);

        sortedEvents.should.have.property("categorizedEvents");
        Object.keys(sortedEvents.categorizedEvents).should.have.length(0);
    });

    it("1 event", function() {
        var events = [event1];
        sortedEvents = groupController.sortEvents(events);

        sortedEvents.should.have.property("categorizedEvents");
        sortedEvents.categorizedEvents.should.have.property(date1);
        sortedEvents.categorizedEvents[date1].should.have.length(1);
        sortedEvents.categorizedEvents[date1][0].id.should.be.eql(event1.id);
    });

    it("2 events with different start times", function() {
        var events = [event2, event1];
        sortedEvents = groupController.sortEvents(events);

        sortedEvents.should.have.property("categorizedEvents");
        sortedEvents.categorizedEvents.should.have.property(date1);
        sortedEvents.categorizedEvents[date1].should.have.length(2);
        sortedEvents.categorizedEvents[date1][0].id.should.be.eql(event1.id);
        sortedEvents.categorizedEvents[date1][1].id.should.be.eql(event2.id);
    });

    it("5 events with different start times", function() {
        var events = [event5, event3, event4, event2, event1];
        sortedEvents = groupController.sortEvents(events);

        sortedEvents.should.have.property("categorizedEvents");

        sortedEvents.categorizedEvents.should.have.property(date1);
        sortedEvents.categorizedEvents[date1].should.have.length(2);
        sortedEvents.categorizedEvents[date1][0].id.should.be.eql(event1.id);
        sortedEvents.categorizedEvents[date1][1].id.should.be.eql(event2.id);

        sortedEvents.categorizedEvents.should.have.property(date2);
        sortedEvents.categorizedEvents[date2].should.have.length(1);
        sortedEvents.categorizedEvents[date2][0].id.should.be.eql(event3.id);

        sortedEvents.categorizedEvents.should.have.property(date3);
        sortedEvents.categorizedEvents[date3].should.have.length(1);
        sortedEvents.categorizedEvents[date3][0].id.should.be.eql(event4.id);

        sortedEvents.categorizedEvents.should.have.property(date4);
        sortedEvents.categorizedEvents[date4].should.have.length(1);
        sortedEvents.categorizedEvents[date4][0].id.should.be.eql(event5.id);
    });

    it("2 events with same event", function() {
        var events = [event1, event1];
        sortedEvents = groupController.sortEvents(events);

        sortedEvents.should.have.property("categorizedEvents");
        sortedEvents.categorizedEvents.should.have.property(date1);
        sortedEvents.categorizedEvents[date1].should.have.length(2);
        sortedEvents.categorizedEvents[date1][0].id.should.be.eql(event1.id);
        sortedEvents.categorizedEvents[date1][1].id.should.be.eql(event1.id);
    });

    it("3 events with same event", function() {
        var events = [event2, event2, event2];
        sortedEvents = groupController.sortEvents(events);

        sortedEvents.should.have.property("categorizedEvents");
        sortedEvents.categorizedEvents.should.have.property(date1);
        sortedEvents.categorizedEvents[date1].should.have.length(3);
        sortedEvents.categorizedEvents[date1][0].id.should.be.eql(event2.id);
        sortedEvents.categorizedEvents[date1][1].id.should.be.eql(event2.id);
        sortedEvents.categorizedEvents[date1][2].id.should.be.eql(event2.id);
    });

    it("Not an array input", function() {
        var events = 4;

		expect(function(){
		    groupController.sortEvents(events);
		}).to.throw("Not an array");
    });

});

describe("Unit Tests for calculate availibilties function", function() {

	schedule0 = {
		Mon: [],
		Tues: [],
		Wed: [],
		Thurs: [],
		Fri: [],
		Sat: [],
		Sun: []
	};

	schedule1 = {
		Mon: [10,10.5,11,11.5],
		Tues: [],
		Wed: [],
		Thurs: [],
		Fri: [],
		Sat: [],
		Sun: []
	};

	schedule2 = {
		Mon: [],
		Tues: [9,9.5,11.5],
		Wed: [],
		Thurs: [],
		Fri: [],
		Sat: [],
		Sun: []
	};

	schedule3 = {
		Mon: [10],
		Tues: [9],
		Wed: [],
		Thurs: [],
		Fri: [],
		Sat: [11.5],
		Sun: []
	};

	schedule4 = {
		Mon: [],
		Tues: [],
		Wed: [],
		Thurs: [],
		Fri: [],
		Sat: [11.5],
		Sun: [12]
	};


	it("No schedules with threshold 1", function() {
		var schedules = [];
		var threshold = 1;
		optimalSchedule = groupController.calculateAvailabilities(schedules, threshold);
		optimalSchedule.Mon.should.have.length(0);
		optimalSchedule.Tues.should.have.length(0);
		optimalSchedule.Wed.should.have.length(0);
		optimalSchedule.Thurs.should.have.length(0);
		optimalSchedule.Fri.should.have.length(0);
		optimalSchedule.Sat.should.have.length(0);
		optimalSchedule.Sun.should.have.length(0);
	});

	it("1 schedule with threshold 1", function() {
        var schedules = [schedule1];
		var threshold = 1;
        optimalSchedule = groupController.calculateAvailabilities(schedules, threshold);
		optimalSchedule.Mon.should.have.length(4);
		optimalSchedule.Tues.should.have.length(0);
		optimalSchedule.Wed.should.have.length(0);
		optimalSchedule.Thurs.should.have.length(0);
		optimalSchedule.Fri.should.have.length(0);
		optimalSchedule.Sat.should.have.length(0);
		optimalSchedule.Sun.should.have.length(0);
    });

	it("1 empty schedule with threshold 1", function() {
		var schedules = [schedule0];
		var threshold = 1;
		optimalSchedule = groupController.calculateAvailabilities(schedules, threshold);
		optimalSchedule.Mon.should.have.length(0);
		optimalSchedule.Tues.should.have.length(0);
		optimalSchedule.Wed.should.have.length(0);
		optimalSchedule.Thurs.should.have.length(0);
		optimalSchedule.Fri.should.have.length(0);
		optimalSchedule.Sat.should.have.length(0);
		optimalSchedule.Sun.should.have.length(0);
	});

	it("1 empty schedule AND 1 regular schedule with threshold 1", function() {
		var schedules = [schedule0, schedule1];
		var threshold = 1;
		optimalSchedule = groupController.calculateAvailabilities(schedules, threshold);
		optimalSchedule.Mon.should.have.length(4);
		optimalSchedule.Tues.should.have.length(0);
		optimalSchedule.Wed.should.have.length(0);
		optimalSchedule.Thurs.should.have.length(0);
		optimalSchedule.Fri.should.have.length(0);
		optimalSchedule.Sat.should.have.length(0);
		optimalSchedule.Sun.should.have.length(0);
	});

	it("2 schedules, no overlap, with threshold 1", function() {
		var schedules = [schedule1, schedule2];
		var threshold = 1;
		optimalSchedule = groupController.calculateAvailabilities(schedules, threshold);
		optimalSchedule.Mon.should.have.length(4);
		optimalSchedule.Tues.should.have.length(3);
		optimalSchedule.Wed.should.have.length(0);
		optimalSchedule.Thurs.should.have.length(0);
		optimalSchedule.Fri.should.have.length(0);
		optimalSchedule.Sat.should.have.length(0);
		optimalSchedule.Sun.should.have.length(0);
	});

	it("4 schedules, some overlap, with threshold 2", function() {
		var schedules = [schedule1, schedule2, schedule3, schedule4];
		var threshold = 2;
		optimalSchedule = groupController.calculateAvailabilities(schedules, threshold);
		optimalSchedule.Mon.should.have.length(1);
		optimalSchedule.Tues.should.have.length(1);
		optimalSchedule.Wed.should.have.length(0);
		optimalSchedule.Thurs.should.have.length(0);
		optimalSchedule.Fri.should.have.length(0);
		optimalSchedule.Sat.should.have.length(1);
		optimalSchedule.Sun.should.have.length(0);
	});

	it("4 schedules, some overlap but not sufficient, with threshold 4", function() {
		var schedules = [schedule1, schedule2, schedule3, schedule4];
		var threshold = 4;
		optimalSchedule = groupController.calculateAvailabilities(schedules, threshold);
		optimalSchedule.Mon.should.have.length(0);
		optimalSchedule.Tues.should.have.length(0);
		optimalSchedule.Wed.should.have.length(0);
		optimalSchedule.Thurs.should.have.length(0);
		optimalSchedule.Fri.should.have.length(0);
		optimalSchedule.Sat.should.have.length(0);
		optimalSchedule.Sun.should.have.length(0);
	});

	it("5 schedules, threshold 0", function() {
		var schedules = [schedule0, schedule1, schedule2, schedule3, schedule4];
		var threshold = 0;
		optimalSchedule = groupController.calculateAvailabilities(schedules, threshold);
		optimalSchedule.Mon.should.have.length(4);
		optimalSchedule.Tues.should.have.length(3);
		optimalSchedule.Wed.should.have.length(0);
		optimalSchedule.Thurs.should.have.length(0);
		optimalSchedule.Fri.should.have.length(0);
		optimalSchedule.Sat.should.have.length(1);
		optimalSchedule.Sun.should.have.length(1);
	});



});
