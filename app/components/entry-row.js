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
    let j = i % 10;
    let k = i % 100;
    if (j == 1 && k != 11) {
      return `${i}st`;
    }
    if (j == 2 && k != 12) {
      return `${i}nd`;
    }
    if (j == 3 && k != 13) {
      return `${i}rd`;
    }
    return `${i}th`;
  }
});
