import Vue from 'vue';
import Router from 'vue-router';
import Listing from './components/Listings';
import Signup from './components/Signup';
import Signin from './components/Signin';

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
      path: '/signup',
      name: 'Signup',
      component: Signup,
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin,
    },
    {
      path: '/*', // 無効なpathにアクセスが来たら
      redirect: '/', // '/'にリダイレクト
    },
  ],
});
