import Ember from 'ember';
import DS from 'ember-data';
import Person from '../models/person';

export default Ember.Object.extend({

    authData: null,

    loggedInPerson: null,

    onAuthDataChange: function(newAuthData, previousAuthData) {
        
        var that = this;

        if (previousAuthData)
            this.ref.child('people/' + previousAuthData.uid).off('value', this.onLoggedInPersonChange);

        if (!newAuthData) {
            this.set('loggedInPerson', null);
            return;
        }

        this.set('loggedInPerson', Person.create({
            id: newAuthData.uid
        }));
        this.ref.child('people/' + newAuthData.uid).on('value', this.onLoggedInPersonChange);
    },
    
    init: function() {
        this._super();

        this.onLoggedInPersonChange = function(snapshot) {
            this.get('loggedInPerson').setProperties(
                snapshot.val()
            );
        }.bind(this);

        this.ref = new window.Firebase("https://firefeed2.firebaseio.com/");
        this.ref.onAuth(function(authData){
            var previousAuthData = this.get('authData');
            this.set('authData', authData);
            this.onAuthDataChange(authData, previousAuthData);
        }.bind(this));
    }

});
