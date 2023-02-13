<script setup>
import { ref, onMounted } from "vue";

onMounted(() => {
    const showTime = 6000;

    setTimeout(function () {
        props.messaggio.hidden = true;
    }, showTime);
});

let props = defineProps({
    messaggio: {
        popupType: String,
        title: String,
        description: String,
        hidden: Boolean,
    },
});

const logoType =
    props.messaggio.popupType == "confirm"
        ? "fa-circle-check"
        : props.messaggio.popupType == "error"
        ? "fa-circle-exclamation"
        : "fa-circle-info";

function hidePopup(event) {
    props.messaggio.hidden = true;

    let target = event.target.parentElement.parentElement;

    target.addEventListener("transitionend", () => target.remove());
}
</script>

<template>
    <div
        class="message-popup acrylic rounded-corners"
        v-bind:class="[messaggio.popupType, messaggio.hidden ? 'fading' : '']">
        <!-- confirm, info, error -->
        <button type="button" class="button-remove" @click="hidePopup($event)">
            <i class="fa-solid fa-xmark fa-lg" aria-hidden="true"></i>
        </button>
        <table>
            <tr>
                <td class="logo">
                    <i class="fa-solid fa-3x" v-bind:class="logoType" aria-hidden="true"></i>
                    <!-- fa-circle-check, fa-circle-info, fa-circle-exclamation -->
                </td>
                <td>
                    <span class="title">{{ messaggio.title }}</span>
                </td>
            </tr>
            <tr v-if="messaggio.description">
                <td colspan="2">
                    <span class="description">
                        {{ messaggio.description }}
                    </span>
                </td>
            </tr>
        </table>
    </div>
</template>


<style scoped>
.message-popup {
    margin: 0px 20px 20px 0px;

    transition: opacity 0.7s ease;
}

.message-popup.fading {
    opacity: 0;
}

.message-popup .button-remove {
    position: fixed;
    right: 20px;
    border: none;
    background: none;
}

.message-popup .button-remove i {
    color: black;
    cursor: pointer;

    padding: 10px;
}

.message-popup span.title {
    font-weight: bold;
    font-size: 20px;
    text-transform: uppercase;

    display: inline-block;
    padding: 0px 20px;
}

.message-popup .logo {
    width: 10%;
}

.message-popup.error .logo i,
.message-popup.error span.title {
    color: rgb(255, 0, 0);
}

.message-popup.info .logo i,
.message-popup.info span.title {
    color: rgb(30, 144, 255);
}

.message-popup.confirm .logo i,
.message-popup.confirm span.title {
    color: rgb(53, 154, 1);
}

.message-popup span.description {
    display: inline-block;
    margin: 20px 0px 0px 0px;

    max-height: 15vh;
    overflow: auto;
}
</style>