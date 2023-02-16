<script setup>
import { loggedUser } from '../states/loggedUser';
const emit = defineEmits(['deleted'])

const props = defineProps(['prenotazione']);
const prenotazione = props.prenotazione;

const VITE_BACKEND = import.meta.env.VITE_BACKEND;
const cancella=()=>{
    const headers = new Headers()
    headers.append('x-access-token',loggedUser.token)
    fetch(`${VITE_BACKEND}/prenotazione/${prenotazione._id}`,{
        method: "DELETE",
        headers: headers
    })
    .then(res=>{
        if (res.ok)
            emit("deleted")
    })
}
</script>

<template>
    <fieldset>
        <legend>{{ prenotazione._id }}</legend>
        <p>Importo dovuto: €{{ prenotazione.importoPagamento }}</p>
        <p>Status pagamento: {{ prenotazione.statusPagamento?'Pagato':'Non Pagato' }}</p>

        <h3>Ricorrenze</h3>
        <div v-for="ricorrenza of prenotazione.ricorrenze">
            <fieldset>
                <legend>{{ ricorrenza.inizio }} - {{ ricorrenza.fine }}</legend>
                <h4>Spazi</h4>
                <ul v-for="spazio of ricorrenza.spaziPrenotati">
                    <li>{{ spazio.nome }}</li>
                </ul>
                <h4>Servizi</h4>
                <ul v-for="servizio of ricorrenza.serviziPrenotati">
                    <li>{{ servizio.nome }}</li>
                </ul>
            </fieldset>
        </div>
        
        <button @click="cancella">DELETE</button>

    </fieldset>
</template>