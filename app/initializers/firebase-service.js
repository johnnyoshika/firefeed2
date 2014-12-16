export function initialize(container, application) {
  application.inject('route', 'firebaseService', 'service:firebase');
}

export default {
  name: 'firebase-service',
  initialize: initialize
};
