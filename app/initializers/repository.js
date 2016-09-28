import Repository from '../repository/index';

export default {
  name: 'repository',
  initialize(application) {
    application.register('repository:main', Repository, {singleton: true});
    application.inject('controller', 'repo', 'repository:main');
    application.inject('route', 'repo', 'repository:main');
    application.inject('component', 'repo', 'repository:main');
  }
};
