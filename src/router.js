import Vue from 'vue';
// import firebase from 'firebase';
import firebase from 'firebase/app';
import 'firebase/auth';
import Router from 'vue-router';
import Listing from './components/Listings';
import Signup from './components/Signup';
import Signin from './components/Signin';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Listing',
      component: Listing,
      meta: { requiresAuth: true },
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
      redirect: '/signin', // '/signin'にリダイレクト
    },
  ],
});

// router.beforeEach((to, from, next) => {
//   const requiresAuth = to.matched.some(record => record.meta.requireAuth);
//   if (requiresAuth) {
//     // このルートはログインされているかどうか認証が必要です。
//     // もしされていないならば、ログインページにリダイレクトします。
//     firebase.auth().onAuthStateChanged(function (user) {
//       if (user) {
//         next();
//       } else {
//         next({
//           path: '/signin',
//           query: { redirect: to.fullPath },
//         });
//       }
//     });
//   } else {
//     next();
//   }
// });

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const currentUser = firebase.auth().currentUser;
  if (requiresAuth) {
    // このルートはログインされているかどうか認証が必要です。
    // もしされていないならば、ログインページにリダイレクトします。
    if (!currentUser) {
      next({
        path: '/signin',
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
