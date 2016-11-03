import ClockService from '../services/clock';
export default {
  name: 'clockServiceInitializer',
  initialize(container, application) {
    container.register('clock:service', ClockService);
    application.inject('controller:interval', 'clock', 'clock:service');
  }
};
