<script setup>
import CardServizio from './CardServizio.vue';

const props = defineProps(['spazio']);
const spazio = props.spazio;

const urlFoto = import.meta.env.VITE_BACKEND+spazio.URLfoto;

</script>

<template>
    <fieldset>
        <legend>{{ spazio.nome }}</legend>
        <table>
            <tr>
                <td>tipologia:</td>
                <td>{{ spazio.tipologia }}</td>
            </tr>
            <tr>
                <td>prezzo:</td>
                <td>{{spazio.prezzoIniziale}} + {{ spazio.prezzoOra }}/ora</td>
            </tr>
        </table>
        <p>{{ spazio.descrizione }}</p>
        <img :src="urlFoto" :alt="spazio.nome" width="100" height="100">

        <div v-if="spazio.servizi.length>0">
            <h3>servizi</h3>
            <li v-for="servizio in spazio.servizi">
                <CardServizio :servizio="servizio"></CardServizio>
            </li>
        </div>
    </fieldset>

</template>