import Ember from 'ember';

export default Ember.Object.extend({

    init: function() {
        this.ref = new window.Firebase("https://firefeed2.firebaseio.com/");
    }

});
