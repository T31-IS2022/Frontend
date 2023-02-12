<script setup>
import { ref, onMounted, createVNode, render } from "vue";
import Popup from "../components/Popup.vue";

onMounted(() => {});

let messaggi = ref([]);

function fadeOut(event) {
    console.log(event.target.parentElement);

    const target = event.target.parentElement.parentElement;

    target.style.opacity = "0";
    // If you want to remove it from the page after the fadeout
    target.addEventListener("transitionend", () => target.remove());
}

const HOST = `http://localhost:3000`;
const API_USER_URL = HOST + `/utente`;

function errore(titolo, descrizione) {
    let messaggio = {
        popupType: "error",
        title: titolo,
        description: descrizione,
    };

    messaggi.value.push(messaggio);
}

function info(titolo, descrizione) {
    let messaggio = {
        popupType: "info",
        title: titolo,
        description: descrizione,
    };

    messaggi.value.push(messaggio);
}

function conferma(titolo, descrizione) {
    let messaggio = {
        popupType: "confirm",
        title: titolo,
        description: descrizione,
    };

    messaggi.value.push(messaggio);
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