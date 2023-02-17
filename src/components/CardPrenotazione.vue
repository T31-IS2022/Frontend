<script setup>
import { loggedUser } from "../states/loggedUser";
const emit = defineEmits(["deleted"]);

const props = defineProps(["prenotazione"]);
const prenotazione = props.prenotazione;

const VITE_BACKEND = import.meta.env.VITE_BACKEND;
const cancella = () => {
    const headers = new Headers();
    headers.append("x-access-token", loggedUser.token);
    fetch(`${VITE_BACKEND}/prenotazione/${prenotazione._id}`, {
        method: "DELETE",
        headers: headers,
    }).then((res) => {
        if (res.ok) emit("deleted");
    });
};
</script>

<template>
    <div class="rounded-corners card-prenotazione">
        <div class="linea-prezzo">
            <span>Importo dovuto: {{ prenotazione.importoPagamento }}€</span>
            <span>
                Status pagamento: {{ prenotazione.statusPagamento ? "Pagato" : "Non pagato" }}
            </span>
        </div>

        <h4>Questa prenotazione comprende le seguenti ricorrenze:</h4>
        <div class="container-ricorrenze">
            <div v-for="ricorrenza of prenotazione.ricorrenze" v-bind:key="ricorrenza._id">
                <div class="rounded-corners-small card-ricorrenza">
                    <span>Inizio: {{ ricorrenza.inizio }} - Fine: {{ ricorrenza.fine }}</span>
                    <br /><br />
                    <p>Spazi prenotati:</p>
                    <ul v-for="spazio of ricorrenza.spaziPrenotati" v-bind:key="spazio._id">
                        <li>{{ spazio.nome }}</li>
                    </ul>
                    <div v-if="ricorrenza.serviziPrenotati.length > 0">
                        <br />
                        <p>Servizi prenotati</p>
                        <ul
                            v-for="servizio of ricorrenza.serviziPrenotati"
                            v-bind:key="servizio._id">
                            <li>{{ servizio.nome }}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-cancella">
            <button
                type="button"
                class="form-button red animated rounded-corners-small"
                @click="cancella">
                <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
                <span>Cancella prenotazione</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
.card-prenotazione {
    background: rgba(255, 255, 255, 0.5);
    margin: 10px 30px 30px 30px;
}

.card-prenotazione ul {
    list-style-position: inside;
}

.linea-prezzo {
    margin: 0px 0px 20px 0px;
}

.linea-prezzo > span:first-child {
    margin-right: 40px;
}

.card-ricorrenza {
    background: rgba(255, 255, 255, 0.5);
    margin: 10px 30px 30px 30px;
    padding: 20px;
}

.container-ricorrenze {
    max-height: 300px;
    overflow-y: auto;
    margin: 10px 0px 10px 0px;
}

.container-cancella {
    display: flex;
    justify-content: end;
}
</style>