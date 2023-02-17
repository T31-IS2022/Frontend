<script setup>
const emit = defineEmits(["errore", "info", "successo"]);
</script>

<template>
    <main>
        <img src="/public/logo.png" class="app-logo" />
        <br />
        <span class="welcome-text">Benvenuto!</span>
        <br />
        <p class="welcome-message">
            Questo è il nuovo sito dell'oratorio! Crea subito un account o accedi per sbolccare
            tutte le nuove funzionalità, come ad esempio vedere gli eventi o prenotare gli spazi e i
            servizi che l'oratorio rende disponibili alla comunità!
        </p>
        <br />
        <p class="welcome-message">Se vuoi venire a trovarci, consulta la mappa qui sotto:</p>
        <br />
        <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2768.1443060119955!2d11.148028916242508!3d46.068163700959296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478277a649689b99%3A0x49540ee3efd2930!2sSala%20conferenze%20Aula%20B107!5e0!3m2!1sen!2sit!4v1676656416854!5m2!1sen!2sit"
            width="600"
            height="300"
            style="border: 0"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            class="location-map"></iframe>
    </main>
</template>

<style>
.app-logo {
    border-top-right-radius: 20px;
    border-bottom-left-radius: 20px;

    width: 80%;
    display: block;
    margin: 0 auto;
}

.welcome-text {
    font-size: 50px;
    width: 100%;
    display: block;
    text-align: center;
}

.welcome-message {
    width: 80%;
    margin: 0 auto;
}

.location-map {
    display: block;
    margin: 0 auto;
}
</style>
