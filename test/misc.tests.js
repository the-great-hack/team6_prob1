const expect = require('chai').expect;
const assert = require('chai').assert;
const request = require('supertest');

var root = require('./root');

describe('Misc. Tests', () => {

  it('Booking', function (done) {
    this.timeout(root.timeout);
    request(root.BASE_URL)
      .post("/api/bookings")
      .send({
        "sourceLong": 31.519521,
        "sourceLat": 74.320241,
        "destLong": 33.5,
        "destLat": 70.39,
        "userNumber": "+923087638398"
      })
      .expect(200)
      .end(function (err, res) {
        if (err) console.error(res.body);

        assert.equal(res.body.message, 'No driver found');

        done(err);
      });

  });

  

});