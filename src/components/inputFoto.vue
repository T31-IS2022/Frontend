<script setup>
import { reactive } from "vue";

let active = reactive({
    status: true,
});

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
    img.onload = () => {
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
    };
    img.setAttribute("src", url);
};

//modifica il file nel campo di input e poi chiama cambio per disegnare l'immagine nella canvas
function setPhoto(url) {
    getImgURL(url, (imgBlob) => {
        // Load img blob to input
        // WIP: UTF8 character error
        let fileName = "profilePicture.png";
        let file = new File(
            [imgBlob],
            fileName,
            { type: "image/png", lastModified: new Date().getTime() },
            "utf-8"
        );
        let container = new DataTransfer();
        container.items.add(file);
        document.querySelector("#fileInput").files = container.files;

        cambio();
    });
}
// xmlHTTP return blob respond
function getImgURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        callback(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
}

function resetPhoto() {
    document.getElementById("fileInput").value = "";
    document
        .getElementById("img")
        .setAttribute("src", document.getElementById("defaultPic").getAttribute("src"));
    document
        .getElementById("canvas")
        .getContext("2d")
        .drawImage(document.getElementById("defaultPic"), 0, 0);
}
async function getFile() {
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

defineExpose({
    setPhoto,
    resetPhoto,
    getFile,
    enable,
    disable,
});
</script>

<template>
    <img
        src="@/assets/profile-default.png"
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