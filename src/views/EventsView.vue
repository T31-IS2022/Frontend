<script setup>
import { onMounted } from 'vue';

const emit = defineEmits(["errore", "info", "successo"]);
onMounted(()=>{
    emit("info", "Attenzione", "La sezione eventi non è stata ancora implementata.")
})
</script>

<template>
    <main>
        <h2>Prossimi eventi</h2>
        <br>
        <p>Pagina in manutenzione</p>
        <!-- TODO aggiungere contenuti della home -->
    </main>
</template>

<style>
/* TODO aggiungere il CSS della home */
</style>
