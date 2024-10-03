import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import ProfilePage from '../pages/ProfilePage.vue';
import HostLobbyPage from '../pages/HostLobbyPage.vue';
import JoinLobbyPage from '../pages/JoinLobbyPage.vue';

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilePage
    },
    {
      path: '/join-lobby',
      name: 'join-lobby',
      component: JoinLobbyPage
    },
    {
      path: '/host-lobby',
      name: 'host-lobby',
      component: HostLobbyPage
    },
  ]
});

export default router;
