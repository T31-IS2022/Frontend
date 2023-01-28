import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import OratorioView from "../views/OratorioView.vue";
import EventsView from "../views/EventsView.vue";
import BookingsView from "../views/BookingsView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
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
            name: "paginaprenotazioni",
            component: BookingsView,
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
