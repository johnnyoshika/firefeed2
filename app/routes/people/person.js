import Ember from 'ember';
import Person from '../../models/person';

export default Ember.Route.extend({

    model: function(params) {
        return new Ember.RSVP.Promise(function (resolve, reject) {
            this.firebase.ref.child('people/' + params.person_id).on('value', function(snapshot) {
                resolve(
                    Person.create(
                        snapshot.val()
                    )
                );
            }, function(errorObject){
                reject(errorObject);
            });
        }.bind(this));
    },

    actions: {
        follow: function() {

        }
    }

});
