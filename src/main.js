// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import Moment from 'vue-moment';


import App from './App';
import router from './router';

Vue.use(VueMaterial);
Vue.use(Moment);


Vue.config.productionTip = false;

const config = {
  apiKey: 'AIzaSyAxo67bG9aw5pHzjF8KKzAO9pYIpIt1Lgs',
  authDomain: 'soundnotepj.firebaseapp.com',
  databaseURL: 'https://soundnotepj.firebaseio.com',
  projectId: 'soundnotepj',
  storageBucket: 'soundnotepj.appspot.com',
  messagingSenderId: '420307008472',
};
firebase.initializeApp(config);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
