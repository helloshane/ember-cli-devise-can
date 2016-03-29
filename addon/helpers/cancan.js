import Ember from 'ember';

export default Ember.Helper.extend({
  session: Ember.inject.service(),

  compute(params, hash) {
    let handler = this.get('session');
    return handler.cancancan(...params);
  }
});
