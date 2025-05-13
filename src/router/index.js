import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from "../views/LoginPage.vue";
import AboutPage from "../views/AboutPage.vue"; // Importar la vista About
import CompraPage from "../views/CompraPage.vue";
import VentaPage from "../views/VentaPage.vue";
import HistorialPage from "../views/HistorialPage.vue";


const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginPage // Ruta principal será el LoginPage
  },
  {
    path: '/about',
    name: 'about',
    component: AboutPage // Ruta para la página About
  },
  { 
    path: '/comprar',
    name: 'comprar', 
    component: CompraPage
  },
  { path: '/vender', 
    name: 'vender', 
    component: VentaPage 
  },
  { path: '/historial', 
    name: 'historial', 
    component: HistorialPage
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;