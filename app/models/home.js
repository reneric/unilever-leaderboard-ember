import Ember from 'ember';

export default Ember.Object.extend({
  poll: Ember.observer('didLoad', function() {
    console.log('message');
    Ember.run.later( function() {
      this.reload();
      this.poll();
    }, 1000);
  })
});
