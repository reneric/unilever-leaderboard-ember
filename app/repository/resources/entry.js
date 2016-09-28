import Ember from 'ember';

export default Ember.Mixin.create({
  getEntries(query = {}) {
    return this._get(this.api.getEntries, query, {});
  }
});
