<script setup>
import { ref, reactive } from "vue";
import CardPrenotazione from "../components/CardPrenotazione.vue";
import FormPrenotazione from "../components/FormPrenotazione.vue";
import { loggedUser } from "../states/loggedUser";

const emit = defineEmits(["errore", "info", "successo"]);

const prenotazioni = ref([]);

let bookingStatus = reactive({
    status: false,
});

const HOST = import.meta.env.VITE_BACKEND;

getPrenotazioni();

function getPrenotazioni() {
    const tokenHeader = new Headers();
    tokenHeader.append("x-access-token", loggedUser.token);
    fetch(`${HOST}/prenotazione/byUtente?id=${loggedUser.id}`, {
        headers: tokenHeader,
    })
        .then((res) => res.json())
        .then((data) => {
            prenotazioni.value.push(...data);
        })
        .catch((error) => {
            emit("errore", "Errore", "Impossibile recuperare le prenotazioni dell'utente.");
        });
}

const cancella = (i) => {
    prenotazioni.value.splice(i, 1);
    emit("successo", "Prenotazione Cancellata", "");
};

function nuovaPrenotazione() {
    bookingStatus.status = true;
}

function listaPrenotazioni() {
    prenotazioni.value = [];
    getPrenotazioni();
    bookingStatus.status = false;
}
</script>

<template>
    <main>
        <h2>Prenotazioni</h2>
        <div v-if="!loggedUser.id">
            <span>
                Desideri prenotare uno spazio del nostro oratorio? Crea subito un account o accedi!
            </span>
        </div>
        <div v-if="loggedUser.id">
            <div v-if="!bookingStatus.status">
                <div id="button-new-booking">
                    <button
                        type="button"
                        class="form-button add-button rounded-corners-small"
                        @click="nuovaPrenotazione">
                        <span>Nuova prenotazione</span>
                    </button>
                </div>
                <h3>Le tue prenotazioni</h3>

                <div v-for="(prenotazione, i) in prenotazioni" v-bind:key="prenotazione._id">
                    <CardPrenotazione
                        @deleted="cancella(i)"
                        :prenotazione="prenotazione"></CardPrenotazione>
                </div>
            </div>
            <div v-if="bookingStatus.status">
                <br />
                <h3>Effettua Una Prenotazione</h3>
                <br />
                <FormPrenotazione @toListaPrenotazioni="listaPrenotazioni"></FormPrenotazione>
            </div>
        </div>
    </main>
</template>

<style>
#button-new-booking {
    margin: 30px;
}
#button-new-booking button {
    width: 100%;
    height: 80px;
}
</style>
