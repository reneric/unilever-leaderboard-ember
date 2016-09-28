import Client from '../api/client';

export default {
  name: 'api',
  initialize(application) {
    application.register(
      'api:main', new Client(),
      {instantiate: false, singleton: true}
    );
    application.inject('controller', 'api', 'api:main');
    application.inject('route', 'api', 'api:main');
    application.inject('repository', 'api', 'api:main');
  }
};
