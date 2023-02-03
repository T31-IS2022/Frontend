<script setup>
const props = defineProps(['servizio']);
const servizio = props.servizio;

const urlFoto = import.meta.env.VITE_BACKEND+servizio.URLfoto;

</script>

<template>
    <fieldset>
        <legend>{{ servizio.nome }}</legend>
        <table>
            <tr>
                <td>tipologia:</td>
                <td>{{ servizio.tipologia }}</td>
            </tr>
            <tr>
                <td>prezzo:</td>
                <td>{{servizio.prezzoIniziale}} + {{ servizio.prezzoOra }}/ora</td>
            </tr>
        </table>
        <p>{{ servizio.descrizione }}</p>
        <img :src="urlFoto" :alt="servizio.nome" width="100" height="100">
    </fieldset>
</template>