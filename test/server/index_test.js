var request    = require('supertest-as-promised');
var routes     = require(__server + '/index.js');
var UsersAPI   = require(__server + '/apis/users-api');
var ArtistsAPI = require(__server + '/apis/artists-api');
var EventsAPI  = require(__server + '/apis/events-api');
var db         = require(__server + '/database/config');
var userModel  = require(__server + '/database/models/user');
var liveModel  = require(__server + '/database/models/live');
var underscore = require('underscore');

var app = TestHelper.createApp();
app.use('/apis/users', UsersAPI);
app.use('/apis/artists', ArtistsAPI);
app.use('/apis/events', EventsAPI);
app.use('/', routes);
app.testReady();

// Set up date for creating events
var date = new Date();

var User = function(fbid, name, image, email, twitter, artist) {
  var newUser = Object.create(Object.prototype);
  newUser = {
    "fbid" : fbid,
    "name" : name,
    "image" : image,
    "email" : email,
    "twitter" : twitter,
    "artist" : artist
  };
  return newUser;
};

var Venue = function(name, city, country, lat, longitude) {
  var newVenue = Object.create(Object.prototype);
  newVenue = {
    "name" : name,
    "city": city,
    "country" : country,
    "loc": {
      "pos": [longitude, lat],
    }
  };
  return newVenue;
};

var Event = function(id, title, datetime, description, venue) {
  var newEvent = Object.create(Object.prototype);
  newEvent = {
    "id" : id,
    "title" : title,
    "datetime" : datetime,
    "description" : description,
    "venue" : venue
  };
  return newEvent;
};

var Artist = function(user, events, paypal_link) {
  var newArtist = Object.create(User.prototype);
  if (!Array.isArray(events)) {
    events = [events];
  }
  newArtist = user;
  newArtist.artist_info = {
      "paypal_link" : paypal_link,
      upcoming_events : []
  };
  events.forEach(function(val) {
    newArtist.artist_info.upcoming_events.push(val);
  });
  return newArtist;
};

var date = new Date();

// Set up dummy data
var user1 = User("123", "scott", "http://www.google.com/imageurl", "sschwa12@gmail.com", "@scott", false);
var user2 = User("456", "someone", "http://www.google.com/imageurl", "sschwa12@gmail.com", "@scott", false);
var user3 = User("789", "a guy", "http://www.google.com/imageurl", "sschwa12@gmail.com", "@scott", true);
var user4 = User("34i576", "me", "http://www.google.com/imageurl", "sschwa12@gmail.com", "@scott", true);
var venue1 = Venue('Citi Field', 'Queens', 'USA', 1235, 12322);
var venue2 = Venue('Jones Beach', 'Wantagh', 'USA', 098244, 777655);
var event1 = Event(13579, 'Awesome fest 2k15', date, 'An awesome festival', venue1);
var event2 = Event(246810, 'Rock Fest 2k15', date, 'A Rockin festival', venue2);
var eventsArray = [event1, event2];
var artist1 = Artist(user3, eventsArray, 'http://linktopaypal');
var artist2 = Artist(user4, event2, 'http://google.com');

// var postUser = function(user, done) {
//   return request(app)
//   .post('/apis/users')
//     .send(user)
//     .expect(201, done)
// }

describe("The Server", function() {

  it("serves an example endpoint", function(done) {

    // Mocha will wait for returned promises to complete
    return request(app)
      .get('/api/tags-example')
      .expect(200)
      .then(function(response) {
        expect(response.body).to.include('node');
        done();
      })
      .catch(function(err) {
        done(err);
      });
  });

  describe("User API", function() {

    beforeEach(function (done) {
        userModel.remove({}, function(err, rmd) {} )
        .then(done());
        // .catch(function(err) { done(err) })
    });

    it('returns all users', function(done) {
      // userModel.remove({}, function(err, rmd) {})
      return request(app)
      .post('/apis/users')
        .send(user1)
        .expect(201)
        .then(function() {
          return request(app)
            .get('/apis/users')
            .expect(200);
          })
          .then(function(res, err) {
            // console.log(res.body)
            expect(res.body.length).to.equal(1);
            expect(res.body._id).to.equal(user1._id);
            done();
          })
        .catch(function(err) { done(err); });
    });

    it("posts to the /apis/users endpoint", function(done) {
      return request(app)
        .post('/apis/users')
        .send(user1)
        .expect(201, done);
    });

    it("creates a non-artist user and returns it", function(done) {
      return request(app)
        .post('/apis/users')
        .send(user1)
        .expect(201)
        .then(function(response) {
          var returnedUser = response.body;
          expect(returnedUser.fb_id).to.equal(user1.fb_id);
          done();
        })
        .catch(function(err) {
          // console.log(err);
          done(err);
        });
    });

    it("returns the user by specified ID", function(done) {
      return request(app)
        .post('/apis/users')
        .send(user1)
        .expect(201)
        .then(function(response) {
          var id = response.body.fbid;
          return request(app)
            .get('/apis/users/' + id)
            .expect(200)
            .then(function(response) {
              expect(response.body.fbid).to.equal(id);
              done();
            });
        })
        .catch(function(err) {
          done(err);
        });
    });

    // The following two tests assume the USERS enpoint doesn't return artists. This has been updated
    // to return both non-artists and artists.

    // it("doesn't return a single artist", function(done) {
    //   return request(app)
    //     .post('/apis/users')
    //     .send(artist1)
    //     .expect(201)
    //     .then(function(response) {
    //       var id = response.body.fbid
    //       return request(app)
    //         .get('/apis/users/' + id)
    //         .expect(200)
    //         .then(function(response) {
    //           expect(response.body).to.be.empty;
    //           done();
    //         })
    //     })
    //     .catch(function(err) {
    //       done(err);
    //     });
    // });

    // it("doesn't return any artists", function(done) {
    //   return request(app)
    //     .post('/apis/users')
    //     .send(artist1)
    //     .expect(201)
    //     .then(function(response) {
    //       var id = response.body.fbid
    //       return request(app)
    //         .get('/apis/users/' + id)
    //         .expect(200)
    //         .then(function(response) {
    //           expect(response.body).to.be.empty;
    //           done();
    //         })
    //     })
    //     .catch(function(err) {
    //       done(err);
    //     });
    // });

    it("should update the user which is entered", function(done) {
      return request(app)
        .post('/apis/users')
        .send(user1)
        .expect(201)
        .then(function(response) {
          var id = response.body.fbid;
          return request(app)
            .put('/apis/users/' + id)
            .send(user2)
            .expect(202)
            .then(function(response) {
              // expect(response.body.ok).to.equal(1);
              // expect(response.body.nModified).to.equal(1);
              done();
            });
        })
        .catch(function(err) {
          done(err);
        });
    });
  });

  describe('Artists API', function() {

    beforeEach(function (done) {
      userModel.remove({}, function(err, rmd) {} )
      .then(done());
      // .catch(function(err) { done(err) })
    });

    it("posts an artist to the database and returns it", function(done) {
      return request(app)
        .post('/apis/artists')
        .send(artist1)
        .expect(201)
        .then(function(response, err) {
          if (err) console.log(err);
          var returnedArtist = response.body;

          expect(returnedArtist._id).to.not.be.undefined;
          expect(returnedArtist.name).to.equal(artist1.name);
          expect(returnedArtist.image).to.equal(artist1.image);
          expect(returnedArtist.email).to.equal(artist1.email);
          expect(returnedArtist.twitter).to.equal(artist1.twitter);
          expect(returnedArtist.artist).to.equal(artist1.artist);
          expect(returnedArtist.artist_info).to.not.be.undefined;
          expect(returnedArtist.artist_info.upcoming_events.length).to.equal(2);
          // TODO CHECK VENUE ITEMS MORE IN DEPTH WITH SUB DOCUMENT METHODS
          // expect(returnedArtist.artist_info.upcoming_events[0].venue[0]).to.deep.equal(artist1.artist_info.upcoming_events[0].venue);
          // expect(returnedArtist.artist_info.upcoming_events[1].venue[0]).to.deep.equal(artist1.artist_info.upcoming_events[1].venue);
          done();
        })
        .catch(function(err) {
          // console.log(err);
          done(err);
        });
    });

    it("posts to the /apis/artists endpoint", function(done) {
      return request(app)
        .post('/apis/artists')
        .send(artist1)
        .expect(201, done);
    });

    it("gets all artists from the database", function(done) {
      return request(app)
        .post('/apis/artists')
        .send(artist1)
        .expect(201)
        .then(function(res) {
          return request(app)
            .post('/apis/artists')
            .send(artist2)
            .expect(201)
            .then(function(res) {
              return request(app)
                .get('/apis/artists')
                .expect(200);
            })
            .then(function(res) {
              expect(res.body.length).to.equal(2);
              expect(res.body[0].fbid).to.equal(artist1.fbid);
              expect(res.body[1].fbid).to.equal(artist2.fbid);
              done();
            });
        })
        .catch(function(err) {
          done(err);
        });
    });

    it("returns the artist by specified ID", function(done) {
      return request(app)
        .post('/apis/artists')
        .send(artist1)
        .expect(201)
        .then(function(response) {
          var id = response.body.fbid;
          return request(app)
            .get('/apis/artists/' + id)
            .expect(200)
            .then(function(response) {
              expect(response.body.fbid).to.equal(id);
              done();
            });
        })
        .catch(function(err) {
          done(err);
        });
    });

    it("doesn't return a single non-artist", function(done) {
      return request(app)
        .post('/apis/artists')
        .send(user1)
        .expect(201)
        .then(function(response) {
          var id = response.body.fbid;
          return request(app)
            .get('/apis/artists/' + id)
            .expect(200)
            .then(function(response) {
              expect(response.body).to.be.empty;;
              done();
            });
        })
        .catch(function(err) {
          done(err);
        });
    });

    it("doesn't return any non-artists", function(done) {
      return request(app)
        .post('/apis/artists')
        .send(user1)
        .expect(201)
        .then(function(response) {
          var id = response.body.fbid;
          return request(app)
            .get('/apis/artists/')
            .expect(200)
            .then(function(response) {
              expect(response.body).to.be.empty;
              done();
            });
        })
        .catch(function(err) {
          done(err);
        });
    });

    it("should update the user which is entered", function(done) {
      return request(app)
        .post('/apis/artists')
        .send(artist1)
        .expect(201)
        .then(function(response) {
          var id = response.body.fbid;
          return request(app)
            .put('/apis/artists/' + id)
            .send(artist2)
            .expect(202)
            .then(function(response) {
              // expect(response.body.ok).to.equal(1);
              // expect(response.body.nModified).to.equal(1);
              done();
            });
        })
        .catch(function(err) {
          done(err);
        });
    });

  });

  describe("Events API", function() {

    beforeEach(function (done) {
      liveModel.remove({}, function(err, rmd) {} )
      .then(done());
      // .catch(function(err) { done(err) })
    });

    it("makes a get request to the events api", function(done) {
      return request(app)
        .get('/apis/events')
        .expect(200)
        .then(function() {
          done();
        })
        .catch(function(err) {
          done(err);
        });
    })

    it("posts to the API and returns all live events", function(done) {
      return request(app)
      .post('/apis/events')
      .send(event1)
      .expect(201)
      .then(function(response) {
        return request(app)
        .post('/apis/events')
        .send(event2)
        .expect(201)
        .then(function(response) {
          return request(app)
          .get('/apis/events')
          .expect(200)
          .then(function(response) {
            expect(response.body).to.not.be.empty;
            expect(response.body[0].id).to.equal(event1.id);
            expect(response.body[1].id).to.equal(event2.id);
            done();
          });
        });
      })
      .catch(function(err) {
        done(err);
      });

    });

    it("adds an attendee to the event", function(done) {
      return request(app)
      .post('/apis/events/' + event1.id)
      .send(user1)
      .expect(201)
      .then(function(response) {
        return request(app)
        .get('/apis/events/' + event1.id)
        .expect(200)
        .then(function(response) {
          expect(response.body.attendees).to.not.be.empty;
          expect(response.body.attendees).to.be.instanceof(Array);
          expect(response.body.attendees).to.have.length(1);
          expect(response.body.attendees[0]).to.have.all.keys(Object.keys(user1));
          expect(response.body.attendees[0]).to.have.property('fbid', user1.fbid);
          done();
        })
      })
      .catch(function(err) {
        done(err);
      });
    });

    it("removes an event", function(done) {
      return request(app)
        .post('/apis/events/' + event1.id)
        .send(user1)
        .expect(201)
        .then(function(response, err) {
          return request(app)
          .del('/apis/events/' + event1.id)
          .expect(200)
          .then(function(response) {
            return request(app)
            .get('/apis/events/' + event1.id)
            .expect(200)
            .then(function(res) {
              expect(res.body).to.be.empty;
              done();
            });
          });
        })
        .catch(function(err) {
          done(err);
        });
    });

  });

});
