import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from "../views/LoginPage.vue";
import AboutPage from "../views/AboutPage.vue"; // Importar la vista About

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginPage // Ruta principal será el LoginPage
  },
  {
    path: '/about',
    name: 'about',
    component: AboutPage // Ruta para la página About
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;