import Ember from 'ember';
import Configuration from '../configuration';

const { inject } = Ember;
let { authenticationUrl, getCurrentUserUrl, routeAfterAuthentication, routeIfAlreadyAuthenticated } = Configuration;

export default Ember.Mixin.create({

  beforeModel(){
    let that = this, currentUrl = that.get("router.url");
    if( this.get("session.isAuthenticated") ){
      console.info(`[ember-cli-devise-can:mixin:authenticated-route] : had been authenticated`)
      that.transitionTo(currentUrl || routeIfAlreadyAuthenticated)
    }else{
      console.info(`[ember-cli-devise-can:mixin:authenticated-route] : had not been authenticated`)
      return this.get("session").authenticate(getCurrentUserUrl).then(
        (res) => {
          console.info(`[ember-cli-devise-can:mixin:authenticated-route] : authenticated success ${that}`)
          that.transitionTo( currentUrl || routeAfterAuthentication)
        },
        (error) => {
          console.info(`[ember-cli-devise-can:mixin:authenticated-route] : authenticated error`)
          window.location.href = authenticationUrl;
        }
      ) // end then 
    }
 },

});
