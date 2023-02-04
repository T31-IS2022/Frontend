<script setup>
import { ref } from 'vue';
import CardSpazio from '../components/CardSpazio.vue';

const spazi = ref([]);
const max = 10;
const pagina = ref(0);

const HOST = import.meta.env.VITE_BACKEND;

const getSpazi = ()=>{
    fetch(`${HOST}/spazio/?start=${pagina.value*max}&count=${max}`)
    .then(res=>res.json())
    .then(data=>{
        spazi.value = data;
    })
    .catch(error=>{
        console.log(error)
    });
}
getSpazi();

const avanti = ()=>{
    pagina.value++;
    getSpazi()
};
const indietro = ()=>{
    pagina.value--;
    getSpazi()
};

</script>


<template>
    <main>
        <h2>Sei nella pagina oratorio</h2>
        <!-- TODO aggiungere contenuti della home -->
        <div v-for="spazio in spazi" v-bind:key="spazio._id">
            <CardSpazio :spazio="spazio"></CardSpazio>
        </div>

        <!--bottoni di navigazione-->
        <div v-if="pagina>0 || spazi.length==max">
            <button id="indietro" v-if="pagina>0" @click="indietro">«{{ pagina }}</button>
            <p>{{ pagina+1 }}</p>
            <button id="avanti" v-if="spazi.length<=max" @click="avanti">{{ pagina+2 }}»</button>
        </div>
    </main>
</template>

<style>
    /* TODO aggiungere il CSS della home */
</style>