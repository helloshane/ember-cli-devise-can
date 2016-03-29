import  setupSession from 'ember-cli-devise-can/initializers/setup-session';
import ENV from '../config/environment';
import Configuration from 'ember-cli-devise-can/configuration';

export function initialize(app) {
  const config = ENV['ember-cli-oauth2-client'] || {};

  Configuration.loadConfig(config);
  
  setupSession(app)
}

export default {
  name: 'setup-session',
  initialize: initialize
};

