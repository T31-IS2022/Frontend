import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import OratorioView from "../views/OratorioView.vue";
import EventsView from "../views/EventsView.vue";
import BookingsView from "../views/BookingsView.vue";

import ProfileView from "../views/ProfileView.vue";
import SignupView from "../views/SignupView.vue";

const router = createRouter({
    history: createWebHistory('/Frontend'),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
        },
        {
            path: "/oratorio",
            name: "paginaOratorio",
            component: OratorioView,
        },
        {
            path: "/eventi",
            name: "paginaEventi",
            component: EventsView,
        },
        {
            path: "/prenotazioni",
            name: "paginaPrenotazioni",
            component: BookingsView,
        },
        {
            path: "/registrazione",
            name: "paginaRegistrazione",
            component: SignupView,
        },
        {
            path: "/profilo",
            name: "paginaProfilo",
            component: ProfileView,
        },
        /*
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
    */
    ],
});

export default router;
