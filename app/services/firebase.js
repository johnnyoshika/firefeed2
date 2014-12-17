import Ember from 'ember';
import DS from 'ember-data';
import Person from '../models/person';

export default Ember.Object.extend({

    authData: null,

    loggedInUser: function() {
        if (!this.get('authData'))
            return null;

        var person = Person.create();
        this.ref.child('people/' + this.get('authData.uid')).on('value', function(snapshot) {
            console.log('firebase server on "value" called');
            person.setProperties(
                snapshot.val()
            )
        }, function(errorObject){
        });

        return person;
    }.property('authData'),

    init: function() {
        this._super();
        this.ref = new window.Firebase("https://firefeed2.firebaseio.com/");
        this.ref.onAuth(function(authData){
            this.set('authData', authData);
        }.bind(this));
    }

});
