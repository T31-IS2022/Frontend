<script setup>
import { ref } from 'vue';
import CardSpazio from '../components/CardSpazio.vue';

const spazi = ref([]);

const HOST = import.meta.env.VITE_BACKEND;
fetch(`${HOST}/spazio/`)
.then(res=>res.json())
.then(data=>{
    spazi.value = data;
})
.catch(error=>{
    console.log(error)
})

</script>


<template>
    <main>
        <h2>Sei nella pagina oratorio</h2>
        <!-- TODO aggiungere contenuti della home -->
        <div v-for="spazio in spazi">
            <CardSpazio :spazio="spazio"></CardSpazio>
        </div>

</main>
</template>

<style>
    /* TODO aggiungere il CSS della home */
</style>