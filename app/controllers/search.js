import Ember from 'ember';

export default Ember.Controller.extend({

    term: null,

    onTermChange: function() {

        this.get('model').clear();
        var term = this.get('term');

        if (term.length < 3)
            return;

        var nextChar =  String.fromCharCode(term.charCodeAt(2) + 1);
        var endKey = term.substr(0, 2) + nextChar;

        var firstNameQuery = this.firebase.ref.child('search/firstName').startAt(null, term).endAt(null, endKey);
        var lastNameQuery = this.firebase.ref.child('search/lastName').startAt(null, term).endAt(null, endKey);

        firstNameQuery.on('child_added', function(snapshot){
            this.populate(snapshot, {
                firstNamePosition: 0,
                lastNamePosition: 1
            });
        }.bind(this));

        lastNameQuery.on('child_added', function(snapshot){
            this.populate(snapshot, {
                firstNamePosition: 1,
                lastNamePosition: 0
            });
        }.bind(this));

    }.observes('term'),

    populate: function(snapshot, meta) {
        var found = this.get('model').find(function(person){
            return person.id === snapshot.val();
        });
        
        if (found) return;

        var parts = snapshot.key().split('|');
        var firstName = parts[meta.firstNamePosition];
        var lastName = parts[meta.lastNamePosition];

        this.get('model').pushObject({
            id: snapshot.val(),
            name: firstName.capitalize() + ' ' + lastName.capitalize()
        });
    }

});
