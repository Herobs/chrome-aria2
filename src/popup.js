import Vue from 'vue';
import VueMaterial from 'vue-material';
import Yaac from './yaac.vue';
import storage from './storage';

// load material components
Vue.use(VueMaterial);

storage.get('settings', settings => {
  new Vue({
    el: '#yaac',
    render: h => h(Yaac, {
      props: {
        settings: Object.assign({
          path: 'http://127.0.0.1:6800/jsonrpc',
          secret: ''
        }, settings)
      }
    })
  });
});
