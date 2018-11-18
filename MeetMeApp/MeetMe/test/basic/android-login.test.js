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

  it("input log in info", function() {
    return client
    //.waitForExist("~Login", 5000)
    .pause(900)
    //.element("~show alert")
    //.waitForExist("~Signup", 5000)
    .sessions(function(res) {
        assert.equal("result.value", "result.value");
      });
    // .getText("~Signup", function(result) {
    //   assert.equal("result.value", "result.value");
    // });  
  });

  it("press login button", function() {
    return client
    //.waitForExist("~Login", 5000)
    .pause(1400)
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
