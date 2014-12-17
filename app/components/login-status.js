import Ember from 'ember';

export default Ember.Component.extend({

    email: 'johnny@bcjobs.ca',
    password: '1Password',

    loggedInUser: function() {
        return this.get('firebase.loggedInUser');
    }.property('firebase.loggedInUser'),

    loginUser: function(options) {
        
        options = options || {};

        this.firebase.ref.authWithPassword({
          email: this.get('email'),
          password: this.get('password')
        }, function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
                return;
            }
            console.log("Authenticated successfully with payload:", authData);
            if (options.success)
                options.success(authData);
        }, {
            remember: this.get('rememberMe') ? 'default' : 'sessionOnly'
        });

    },

    actions: {
        signup: function() {

            this.firebase.ref.createUser({
              email: this.get('email'),
              password: this.get('password')
            }, function(error) {
                if (error) {
                    switch (error.code) {
                      case "EMAIL_TAKEN":
                        console.log("The new user account cannot be created because the email is already in use.");
                        break;
                      case "INVALID_EMAIL":
                        console.log("The specified email is not a valid email.");
                        break;
                      default:
                        console.log("Error creating user:", error);
                    }
                    return;
                }

                console.log("User account created successfully!");

                this.loginUser({
                    success: function(authData) {
                        var peopleRef = this.firebase.ref.child('people').child(authData.uid);
                        peopleRef.once('value', function(person) {
                            peopleRef.set({
                                firstName: this.get('firstName'),
                                lastName: this.get('lastName'),
                                presence: 'online'
                            });

                            // Populate search index
                            var firstNameKey = [this.get('firstName'), this.get('lastName'), authData.uid].join('|').toLowerCase();
                            var lastNameKey = [this.get('lastName'), this.get('firstName'), authData.uid].join('|').toLowerCase();
                            this.firebase.ref.child('search/firstName').child(firstNameKey).set(authData.uid);
                            this.firebase.ref.child('search/lastName').child(lastNameKey).set(authData.uid);

                        }.bind(this));                        
                    }.bind(this)
                });

            }.bind(this));
        },
        login: function() {
            this.loginUser();
        },
        logout: function() {
            var authData = this.firebase.ref.getAuth();
            var peopleRef = this.firebase.ref.child("people").child(authData.uid);
            peopleRef.child('presence').set('offline');
            this.firebase.ref.unauth();
        }
    }

});
