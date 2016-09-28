import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  entry: null,
  index: 0,
  score: Ember.computed.alias('entry.score'),
  name: Ember.computed.alias('entry.name'),

  place: Ember.computed('index',
    function() {
      let index = Number(this.get('index'));
      let place = index + 1;
      return this._place_suffix(place);
    }
  ),

  _place_suffix(i) {
    const s = ['th','st','nd','rd'];
    let v = i % 100;
    return i + (s[(v - 20) % 10] || s[v] || s[0]);
  }
});
