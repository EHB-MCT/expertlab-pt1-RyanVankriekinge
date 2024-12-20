import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import ProfilePage from '../pages/ProfilePage.vue';
import CreateLobbyPage from '../pages/CreateLobbyPage.vue';
import JoinLobbyPage from '../pages/JoinLobbyPage.vue';
import LoginPage from '../pages/LoginPage.vue';
import CreateAccountPage from '@/pages/CreateAccountPage.vue';
import CreateQuizPage from '@/pages/CreateQuizPage.vue';
import LobbyPage from '@/pages/LobbyPage.vue';
import QuizPage from '@/pages/QuizPage.vue';

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
      component: JoinLobbyPage,
      props: true
    },
    {
      path: '/create-lobby',
      name: 'create-lobby',
      component: CreateLobbyPage
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/create-account',
      name: 'create-account',
      component: CreateAccountPage
    },
    {
      path: '/create-quiz',
      name: 'create-quiz',
      component: CreateQuizPage
    },
    {
      path: '/lobby/:lobbyCode',
      name: 'lobby',
      component: LobbyPage,
      props: true
    },
    {
      path: '/quiz/:lobbyCode',
      name: 'quiz',
      component: QuizPage,
      props: true
    },
  ]
});

export default router;
