<script setup>
import { ref, onMounted } from "vue";

onMounted(() => {});

const props = defineProps({
    messaggio: {
        popupType: String,
        title: String,
        description: String,
    },
});

const logoType =
    props.messaggio.popupType == "confirm"
        ? "fa-circle-check"
        : props.messaggio.popupType == "error"
        ? "fa-circle-exclamation"
        : "fa-circle-info";

function fadeOut(event) {
    console.log(event.target.parentElement);

    const target = event.target.parentElement.parentElement;

    target.style.opacity = "0";
    // If you want to remove it from the page after the fadeout
    target.addEventListener("transitionend", () => target.remove());
}
</script>

<template>
    <div class="message-popup acrylic rounded-corners" v-bind:class="messaggio.popupType">
        <!-- confirm, info, error -->
        <button type="button" class="button-remove" @click="fadeOut($event)">
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
            <tr>
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

.message-popup .button-remove {
    position: fixed;
    right: 20px;
    border: none;
    background: none;
}

.message-popup .button-remove i {
    color: black;
    cursor: pointer;
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
    padding: 20px 0px 0px 0px;
}
</style>