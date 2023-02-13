<script setup>
import { ref, onMounted, createVNode, render } from "vue";
import Popup from "./Popup.vue";

onMounted(() => {});

let messaggi = ref([]);

const HOST = `http://localhost:3000`;
const API_USER_URL = HOST + `/utente`;

function errore(titolo, descrizione) {
    let messaggio = {
        popupType: "error",
        title: titolo || "Errore",
        description: descrizione,
    };

    messaggi.value.push(messaggio);

    //dopo un bel po di tempo rimuovo il messaggio dall'array (per evitare buildup di elementi ormai nascosti)
    setTimeout(function () {
        var index = messaggi.value.indexOf(messaggio);
        if (index !== -1) {
            messaggi.value.splice(index, 1);
        }
    }, 10000);
}

function info(titolo, descrizione) {
    let messaggio = {
        popupType: "info",
        title: titolo || "Info",
        description: descrizione,
    };

    messaggi.value.push(messaggio);

    //dopo un bel po di tempo rimuovo il messaggio dall'array (per evitare buildup di elementi ormai nascosti)
    setTimeout(function () {
        var index = messaggi.value.indexOf(messaggio);
        if (index !== -1) {
            messaggi.value.splice(index, 1);
        }
    }, 10000);
}

function conferma(titolo, descrizione) {
    let messaggio = {
        popupType: "confirm",
        title: titolo || "Conferma",
        description: descrizione,
    };

    messaggi.value.push(messaggio);

    //dopo un bel po di tempo rimuovo il messaggio dall'array (per evitare buildup di elementi ormai nascosti)
    setTimeout(function () {
        var index = messaggi.value.indexOf(messaggio);
        if (index !== -1) {
            messaggi.value.splice(index, 1);
        }
    }, 10000);
}

defineExpose({
    errore,
    info,
    conferma,
});
</script>

<template>
    <div id="messages-container">
        <Popup v-for="messaggio in messaggi" v-bind:key="messaggio" :messaggio="messaggio" />
    </div>
</template>


<style scoped>
#messages-container {
    position: absolute;
    bottom: 0;
    right: 0;

    width: 25%;
    max-height: 50%;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
}

#messages-wrapper {
    position: fixed;
    bottom: 0;
    right: 0;

    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

/* classe per aggiungere un fade sui messaggi in alto parzialmente visibili
NB: attivando questa classe si disattiva l'effetto traslucido dei popup */
.masked-overflow {
    /* mask fade distance, for use in mask calculations */
    --mask-height: 32px;

    overflow-y: hidden;

    /* Need to make sure container has top space,
  otherwise content at the top is always faded out */
    padding-top: var(--mask-height);

    /* Apply the mask image */
    -webkit-mask-image: linear-gradient(
        to bottom,
        transparent,
        black var(--mask-height),
        black calc(100% - var(--mask-height))
    );

    mask-image: linear-gradient(
        to bottom,
        transparent,
        black var(--mask-height),
        black calc(100% - var(--mask-height))
    );

    /* Position the content gradient in the top left, and the 
  scroll gradient in the top right */
    mask-position: 0 0;

    /* We don't repeat our mask images */
    mask-repeat: no-repeat;
}
</style>