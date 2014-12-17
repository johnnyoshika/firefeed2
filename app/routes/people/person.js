import Ember from 'ember';

export default Ember.Route.extend({

    model: function(params) {
        return new Ember.RSVP.Promise(function (resolve, reject) {
            this.firebase.ref.child('people/' + params.person_id).on('value', function(snapshot) {
                resolve(snapshot.val());
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
