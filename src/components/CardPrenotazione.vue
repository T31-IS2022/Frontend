<script setup>
const props = defineProps(['prenotazione']);
const prenotazione = props.prenotazione;
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

    </fieldset>
</template>