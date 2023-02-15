<script setup>
import { reactive } from "vue";

const HOST = import.meta.env.VITE_BACKEND;

let active = reactive({
    status: true,
});

const props = defineProps({
    defaultPhotoURL: String
});
const defaultPhotoURL = props.defaultPhotoURL?`${HOST}${props.defaultPhotoURL}`:`../../profile-default.png`;

//simula un click sul campo nascosto per caricare la foto
function selectPhoto() {
    if (active.status) {
        if (dragging) return;
        const fileInput = document.getElementById("fileInput");
        fileInput.click();
    }
}

let x, y;
let oldx, oldy, premuto;
let listener;
let ratio = 1;
let dragging = false;

let wantsToDelete = false;

const imageLoaded = () => {
    const defaultImage = document.getElementById("defaultPic");
    const canvas = document.getElementById("canvas");
    canvas.setAttribute("width", defaultImage.width);
    canvas.setAttribute("height", defaultImage.height);
    canvas.getContext("2d").drawImage(defaultImage, 0, 0);
};

const pressione = (e) => {
    premuto = true;
    oldx = e.x || e.changedTouches[0].clientX;
    oldy = e.y || e.changedTouches[0].clientY;
};

["mouseup", "touchend"].forEach((eventName) => {
    document.addEventListener(eventName, (e) => {
        premuto = false;
        dragging = false;
    });
});

const cambio = () => {
    var context = canvas.getContext("2d");
    const input = document.getElementById("fileInput");
    const file = input.files[0];
    if (!file) {
        resetPhoto();
        return;
    }
    const url = URL.createObjectURL(file);
    const img = document.getElementById("img");
    img.addEventListener('load', () => {
        if (img.width < img.height) ratio = canvas.height / img.width;
        else ratio = canvas.height / img.height;

        const newWidth = img.width * ratio;
        const newHeight = img.height * ratio;

        const minWidth = canvas.width - newWidth;
        const minHeight = canvas.height - newHeight;

        x = minWidth / 2;
        y = minHeight / 2;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, x, y, newWidth, newHeight);

        if (listener)
            ["mousemove", "touchmove"].forEach((eventName) => {
                canvas.removeEventListener(eventName, listener);
            });
        listener = (e) => {
            e.preventDefault();
            if (!premuto) return;
            dragging = true;

            const ex = e.x || e.changedTouches[0].clientX;
            const ey = e.y || e.changedTouches[0].clientY;

            const deltax = ex - oldx;
            const deltay = ey - oldy;

            x = Math.min(0, Math.max(minWidth, x + deltax));
            y = Math.min(0, Math.max(minHeight, y + deltay));

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, x, y, newWidth, newHeight);

            oldx = ex;
            oldy = ey;
        };

        ["mousemove", "touchmove"].forEach((eventName) => {
            canvas.addEventListener(eventName, listener);
        });
    },{once:true});
    img.setAttribute("src", url);
    wantsToDelete = false;
};

function resetPhoto() {
    document.getElementById("fileInput").value = "";
    document
        .getElementById("img")
        .setAttribute("src", defaultPhotoURL);
    document
        .getElementById("canvas")
        .getContext("2d")
        .drawImage(document.getElementById("defaultPic"), 0, 0);
}
async function getFile() {
    if (wantsToDelete) return new File([''], "defaultPicture.png");
    if (!document.getElementById("fileInput").files[0]) return;

    // prende l'immagine originale e la ritaglia in base a come e stata posizionata nel canvas dall'utente
    // questo viene fatto passando per un altro canvas hidden
    const canvas = document.getElementById("canvas2");
    const img = document.getElementById("img");

    canvas.setAttribute("width", Math.min(img.width, img.height));
    canvas.setAttribute("height", Math.min(img.width, img.height));

    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, x / ratio, y / ratio);

    let risolvi;
    let file;
    const promise = new Promise((ris) => {
        risolvi = ris;
    });
    canvas.toBlob((blob) => {
        file = new File([blob], "profilePicture.png");
        risolvi();
    });
    await promise;
    return file;
}

function enable() {
    active.status = true;
}

function disable() {
    active.status = false;
}

function deletePhoto(){
    wantsToDelete = true;
    const img = document.getElementById("img");
    document.getElementById('fileInput').value="";
    img.addEventListener('load',()=>{
        const canvas = document.getElementById("canvas");
        canvas.setAttribute("width", img.width);
        canvas.setAttribute("height", img.height);
        canvas.getContext("2d").drawImage(img, 0, 0);
    }, {once: true});
    img.setAttribute('src', '../../profile-default.png')
}

defineExpose({
    deletePhoto,
    resetPhoto,
    getFile,
    enable,
    disable,
});
</script>

<template>
    <img
        :src= defaultPhotoURL
        id="defaultPic"
        class="profile-picture"
        @load="imageLoaded"
        hidden />
    <canvas id="canvas2" hidden></canvas>
    <img id="img" hidden />

    <canvas
        id="canvas"
        class="profile-picture"
        v-bind:class="active.status ? '' : 'disabled'"
        @mouseup="selectPhoto()"
        @mousedown="pressione"
        @touchstart="pressione"></canvas>

    <input
        type="file"
        id="fileInput"
        class="file-input"
        accept="image/png, image/jpeg"
        name="foto"
        @change="cambio" />
</template>

<style scoped>
.profile-picture {
    width: 250px;
    height: 250px;
    border-radius: 250px;

    transition: opacity 0.5s ease;
}

.profile-picture:not(.disabled):hover {
    cursor: pointer;
    opacity: 0.6;
}

.file-input {
    display: none;
}
</style>