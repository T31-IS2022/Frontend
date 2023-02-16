<script setup>
import { ref } from "vue";
import CardPrenotazione from "../components/CardPrenotazione.vue";
import FormPrenotazione from "../components/FormPrenotazione.vue";
import { loggedUser } from "../states/loggedUser";

const emit = defineEmits(["errore", "info", "successo"]);

const prenotazioni = ref([]);

const HOST = import.meta.env.VITE_BACKEND;

const tokenHeader = new Headers();
tokenHeader.append("x-access-token", loggedUser.token);
fetch(`${HOST}/prenotazione/byUtente?id=${loggedUser.id}`,{
    headers: tokenHeader
})
.then((res) => res.json())
.then((data) => {
    prenotazioni.value.push(...data);
})
.catch((error) => {
    emit("errore", "Errore", "Impossibile recuperare le prenotazioni dell'utente.");
});
</script>

<template>
    <main>
        <h2>Sei nella pagina prenotazioni</h2>
        <h3>Le tue prenotazioni</h3>
        <div v-for="prenotazione of prenotazioni" v-bind:key="prenotazione._id">
            <CardPrenotazione :prenotazione="prenotazione"></CardPrenotazione>
        </div>

        <h1>Effettua Una Prenotazione</h1>
        <FormPrenotazione></FormPrenotazione>
    </main>
</template>

<style>
/* TODO aggiungere il CSS della home */
</style>
