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

  formattedScore: Ember.computed('score',
    function() {
      let score = Number(this.get('score'))/1000;
      let str = `${score}`;
      let time = str.slice(0, -1);
      let ms = time.substr(-2, 2);
      let s = Number(time.slice(0, -2));
      let minutes = Math.floor(s / 60);
      let seconds = s - minutes * 60;
      if (seconds.toString().length == 1) {
        seconds = `0${seconds}`;
      }
      if (minutes.toString().length == 1) {
        minutes = `0${minutes}`;
      }
      return `${minutes}:${seconds}:${ms}`;
    }
  ),

  _place_suffix(i) {
    const s = ['th','st','nd','rd'];
    let v = i % 100;
    return i + (s[(v - 20) % 10] || s[v] || s[0]);
  }
});
