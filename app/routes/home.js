import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return this.repo.getEntries({direction: 'asc'});
  },
  actions: {
    reloadLeaderboard() {
      this.refresh();
    }
  }
});
