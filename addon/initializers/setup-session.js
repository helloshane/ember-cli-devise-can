import  Session from '../services/session';

export default function setupSession(app) {
  app.register('session:main', Session);
  app.inject('route', 'session', 'session:main');
  app.inject('controller', 'session', 'session:main');
  app.inject('component', 'session', 'session:main');
  app.inject('helper:cancan', 'session', 'session:main');
}
