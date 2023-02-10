<script setup>
import { ref } from 'vue';
import CardSpazio from '../components/CardSpazio.vue';

const spazi = ref([]);
const fetchSize = 10;

const HOST = import.meta.env.VITE_BACKEND;

const checkFondoPagina = ()=>{
    const corpo = document.getElementById('page-scroll');
    return corpo.scrollHeight-corpo.scrollTop-corpo.clientHeight<150;
}

let fetching = false;
const getSpazi = ()=>{
    fetching = true;
    fetch(`${HOST}/spazio/?start=${spazi.value.length}&count=${fetchSize}`)
    .then(res=>res.json())
    .then(data=>{
        spazi.value.push(...data);
        fetching = false;    
        if (data.length>0 && checkFondoPagina())
            getSpazi();
    })
    .catch(error=>{
        console.log(error)
    });
}
getSpazi();

let fondo = false;
document.getElementById('page-scroll').addEventListener('scroll',e=>{
    let newFondo = checkFondoPagina();
    if (!fondo && newFondo)
        if (!fetching)
            getSpazi();

    fondo = newFondo;
});

</script>

<template>
    <main>
        <h2>Sei nella pagina oratorio</h2>
        <!-- TODO aggiungere contenuti della home -->
        <div v-for="spazio in spazi" v-bind:key="spazio._id">
            <CardSpazio :spazio="spazio"></CardSpazio>
        </div>
    </main>
</template>

<style>
    /* TODO aggiungere il CSS della home */
</style>