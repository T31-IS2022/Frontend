<script setup>
import { ref, onMounted } from "vue";

onMounted(() => {
    let popup = document.getElementById("popup-login");

    document.body.appendChild(popup);
});

function fadeOut(event) {
    console.log(event.target.parentElement);

    const target = event.target.parentElement.parentElement;

    target.style.opacity = "0";
    // If you want to remove it from the page after the fadeout
    target.addEventListener("transitionend", () => target.remove());
}

const HOST = `http://localhost:3000`;
const API_USER_URL = HOST + `/utente`;
</script>

<template>
    <div id="messages-container">
        <div class="message-popup error acrylic rounded-corners">
            <button type="button" class="button-remove" @click="fadeOut($event)">
                <i class="fa-solid fa-xmark fa-lg" aria-hidden="true"></i>
            </button>
            <table>
                <tr>
                    <td class="logo">
                        <i class="fa-solid fa-circle-exclamation fa-3x" aria-hidden="true"></i>
                    </td>
                    <td>
                        <span class="title">Errore</span>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <span class="description">
                            Qui va il messaggio di errore lorem ipsum dolor sit amet bla bsdfa fa
                            aff a faasf as aae f g qegerg eg egeg eg eg eg eg sadada
                        </span>
                    </td>
                </tr>
            </table>
        </div>
        <div class="message-popup info acrylic rounded-corners">
            <button type="button" class="button-remove" @click="fadeOut($event)">
                <i class="fa-solid fa-xmark fa-lg" aria-hidden="true"></i>
            </button>
            <table>
                <tr>
                    <td class="logo">
                        <i class="fa-solid fa-circle-info fa-3x" aria-hidden="true"></i>
                    </td>
                    <td>
                        <span class="title">Info</span>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <span class="description">
                            Qui va il messaggio di errore lorem ipsum dolor sit amet bla bsdfa fa
                            aff a faasf as aae f g qegerg eg egeg eg eg eg eg sadada
                        </span>
                    </td>
                </tr>
            </table>
        </div>
        <div class="message-popup confirm acrylic rounded-corners">
            <button type="button" class="button-remove" @click="fadeOut($event)">
                <i class="fa-solid fa-xmark fa-lg" aria-hidden="true"></i>
            </button>
            <table>
                <tr>
                    <td class="logo">
                        <i class="fa-solid fa-circle-check fa-3x" aria-hidden="true"></i>
                    </td>
                    <td>
                        <span class="title">Confermato</span>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <span class="description">
                            Qui va il messaggio di errore lorem ipsum dolor sit amet bla bsdfa fa
                            aff a faasf as aae f g qegerg eg egeg eg eg eg eg sadada
                        </span>
                    </td>
                </tr>
            </table>
        </div>
        <div class="message-popup confirm acrylic rounded-corners">
            <button type="button" class="button-remove" @click="fadeOut($event)">
                <i class="fa-solid fa-xmark fa-lg" aria-hidden="true"></i>
            </button>
            <table>
                <tr>
                    <td class="logo">
                        <i class="fa-solid fa-circle-check fa-3x" aria-hidden="true"></i>
                    </td>
                    <td>
                        <span class="title">Confermato</span>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <span class="description">
                            Qui va il messaggio di errore lorem ipsum dolor sit amet bla bsdfa fa
                            aff a faasf as aae f g qegerg eg egeg eg eg eg eg sadada
                        </span>
                    </td>
                </tr>
            </table>
        </div>
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