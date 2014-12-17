export function initialize(container, application) {
    ['route', 'controller', 'component'].forEach(function(componentType) {
        application.inject(componentType, 'firebase', 'service:firebase');
    });
}

export default {
name: 'firebase',
    initialize: initialize
};
