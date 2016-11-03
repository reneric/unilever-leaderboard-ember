import Ember from 'ember';

export default Ember.Controller.extend({
  entries: Ember.computed.alias('model'),
  poll: Ember.observer('entries',
    function() {
      Ember.run.later(this, () => {
        console.log('reloaded');
        this.send('reloadLeaderboard');
      }, 10000);
    }
  ).on('init')
});
