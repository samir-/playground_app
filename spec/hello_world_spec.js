var request = require("request");
var helloWorld = require("../server.js")
var base_url = "http://localhost:3000/"

describe("Hello World Server", function() {
  describe("GET /hello", function() {
    it("returns status code 200", function(done) {
      request.get(base_url+'hello', function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it("returns Hello World", function(done) {
      request.get(base_url+'hello', function(error, response, body) {
        expect(body).toBe("Hello World");
        done();
      });
    });
  });
});
