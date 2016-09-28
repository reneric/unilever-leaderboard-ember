import Ember from 'ember';

export default Ember.Controller.extend({
  entries: Ember.computed.alias('model')
});
