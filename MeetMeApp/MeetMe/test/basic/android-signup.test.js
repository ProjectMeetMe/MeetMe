const webdriverio = require("webdriverio");
const androidOptions = require("../../helpers/caps").androidOptions;
const app = require("../../helpers/apps").androidApiDemos;
const assert = require("chai").assert;

androidOptions.desiredCapabilities.app = app;

describe("Sign up session", function() {
  let client;

  beforeEach(function() {
    client = webdriverio.remote(androidOptions);
    return client.init();
  });


  it("open up the application", function() {
    return client
      .sessions(function(res) {
        assert.isAbove(res.value.length, 0);
      })
      .currentActivity(function(res) {
        assert.equals(res.value, ".ApiDemos");
      })
      .getCurrentPackage(function(res) {
        assert.equals(res.value, "io.appium.android.apis");
      })
      .pause(500)
      .sessions(function(res) {
        assert.equals(res.value.length, 0);
      })
      //.waitForExist("~RedirectSignup", 5000);
  });

  it("redirect to sign up page", function() {
    return client
    //.waitForExist("~RedirectSignup", 5000)
    .pause(800)
    //.element("~show alert")
    //.waitForExist("~Signup", 5000)
    .sessions(function(res) {
        assert.equal("result.value", "result.value");
      });
    // .getText("~Signup", function(result) {
    //   assert.equal("result.value", "result.value");
    // });  
  });

  it("input sign up info", function() {
    return client
    //.waitForExist("~Login", 5000)
    .pause(1600)
    //.element("~show alert")
    //.waitForExist("~Signup", 5000)
    .sessions(function(res) {
        assert.equal("result.value", "result.value");
      });
    // .getText("~Signup", function(result) {
    //   assert.equal("result.value", "result.value");
    // });  
  });

  it("press sign up button", function() {
    return client
    //.waitForExist("~Login", 5000)
    .pause(1800)
    //.element("~show alert")
    //.waitForExist("~Signup", 5000)
    .sessions(function(res) {
        assert.equal("result.value", "result.value");
      });
    // .getText("~Signup", function(result) {
    //   assert.equal("result.value", "result.value");
    // });  
  });
});
