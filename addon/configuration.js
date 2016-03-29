import Ember from 'ember';

const { getWithDefault, isBlank } = Ember;

export default {

  authenticationUrl:                   '/auth',
  getCurrentUserUrl:                  '/auth/user',
  routeAfterAuthentication:       'index',
  routeIfAlreadyAuthenticated:  'index', 

  loadConfig(settings){
    let that = this, pros = Object.keys(that);
    if( isBlank(pros)  || isBlank(settings) ) return;
    pros.forEach( (pro) => {
      if( typeof this[pro] === "function" ) return;
      that[pro] = getWithDefault(settings, pro, that[pro])
      console.info(`[ember-cli-devise-can:configuration] property: ${pro} value: ${that[pro]}`)
    }) 
  },

}
