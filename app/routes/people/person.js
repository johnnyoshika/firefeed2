import Ember from 'ember';
import Person from '../../models/person';

export default Ember.Route.extend({

    model: function(params) {
        return new Ember.RSVP.Promise(function (resolve, reject) {
            this.firebase.ref.child('people/' + params.person_id).on('value', function(snapshot) {
                var person = Person.create(snapshot.val());
                person.set('id', params.person_id);

                resolve(person);
            }, function(errorObject){
                reject(errorObject);
            });
        }.bind(this));
    },

    actions: {
        follow: function() {

            var loggedInPerson = this.firebase.get('loggedInPerson');
            var followPerson = this.modelFor(this.routeName);

            var loggedInUserRef = this.firebase.ref
                .child('users')
                .child(loggedInPerson.get('id'));

            var followUserRef = this.firebase.ref
                .child('users')
                .child(followPerson.get('id'));
            
            loggedInUserRef
                .child('following')
                .child(followPerson.get('id'))
                .set(true, function(error) {
                    if (error)
                        throw new Error('Cannot follow');

                    
                    followUserRef.child('followers')
                        .child(loggedInPerson.get('id'))
                        .set(true);

                    var loggedInUserFeedRef = loggedInUserRef.child('feed');
                    followUserRef
                        .child('sparks')
                        .once('value', function(sparkSnapshot){
                            sparkSnapshot.forEach(function(spark){
                                loggedInUserFeedRef
                                    .child(spark.key())
                                    .set(true);
                            });
                        });

                }.bind(this));
        }
    }

});
