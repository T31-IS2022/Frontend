import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "../public/main.css";

//creazione dell'applicazione vue passandogli il container root
const app = createApp(App);

app.use(router);

//monto l'applicazione sull'elemento HTML con id="app"
app.mount("#app");
