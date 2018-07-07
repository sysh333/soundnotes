import Vue from 'vue';
import Router from 'vue-router';
import Admin from './components/Admin';
import Listing from './components/Listings';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Listing',
      component: Listing,
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin,
    },
    {
      path: '/*', // 無効なpathにアクセスが来たら
      redirect: '/', // '/'にリダイレクト
    },
  ],
});
