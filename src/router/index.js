
import { createRouter, createWebHistory } from 'vue-router';
import middleware from './middleware';
import dashboard from '../views/dashboard.vue';
import login from '../views/login.vue';
import sessionExpired from '../views/sessionExpired.vue';
import twofa from '../views/2fa.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/',
        name: 'dashboard',
        component: dashboard,
        meta: { 
          auth: true 
        }
      },
      {
        path: '/login',
        name: 'login',
        component: login,
        meta: { 
          auth: false 
        }
      },
      {
        path: '/session-expired',
        name: 'sessionExpired',
        component: sessionExpired,
        meta: { 
          auth: false
        }
      },
      {
        path: '/2fa',
        name: '2fa',
        component: twofa,
        meta: { 
          auth: true
        }
      },
    ],
  });
  
router.beforeEach(middleware.beforeEach);
  
export default router;