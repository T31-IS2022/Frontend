<script setup>
import { ref, onMounted } from "vue";
import { loggedUser, setLoggedUser, clearLoggedUser } from "../states/loggedUser.js";
import { reactive } from "vue";

let x, y;
let oldx, oldy, premuto;
let listener;
let ratio = 1;
let dragging = false;

let cambio;

onMounted(() => {
    //TODO potrei controllare se l'utente non è loggato, e in tal caso mandarlo alla registrazione
    console.log("profilo mounted");

    const defaultImage = document.getElementById("defaultPic");
    defaultImage.onload = () => {
        const canvas = document.getElementById("canvas");
        canvas.setAttribute("width", defaultImage.width);
        canvas.setAttribute("height", defaultImage.height);
        canvas.getContext("2d").drawImage(defaultImage, 0, 0);
    };
    var context = canvas.getContext("2d");

    ["mousedown", "touchstart"].forEach((eventName) => {
        canvas.addEventListener(eventName, (e) => {
            premuto = true;
            oldx = e.x || e.changedTouches[0].clientX;
            oldy = e.y || e.changedTouches[0].clientY;
        });
    });

    ["mouseup", "touchend"].forEach((eventName) => {
        document.addEventListener(eventName, (e) => {
            premuto = false;
            dragging = false;
        });
    });

    cambio = () => {
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
});

let editingStatus = reactive({
    status: false,
});

const HOST = import.meta.env.VITE_BACKEND;
const API_USER_URL = HOST + `/utente`;

//variabili in che contengono il valore dei campi del form di modifica profilo
const nome = ref(loggedUser.nome);
const cognome = ref(loggedUser.cognome);
const email = ref(loggedUser.email);
const password = ref("");
const ripetiPassword = ref("");
const indirizzo = ref(loggedUser.indirizzo);
const telefono = ref(loggedUser.telefono);

function edit(status) {
    editingStatus.status = status;
}

function resetEditing() {
    editingStatus.status = false;

    //rimettere nei campi i valori originali
    nome.value = loggedUser.nome;
    cognome.value = loggedUser.cognome;
    email.value = loggedUser.email;
    password.value = "";
    ripetiPassword.value = "";
    indirizzo.value = loggedUser.indirizzo;
    telefono.value = loggedUser.telefono;

    resetPhoto();
}

function saveProfile() {
    if ((password.value || ripetiPassword.value) && password.value != ripetiPassword.value) {
        //TODO mostrare un errore
        console.err("Password diverse!");
    } else {
        //inserisco i valori come campi di un form
        const profileData = new FormData();
        profileData.append("nome", nome.value);
        profileData.append("cognome", cognome.value);
        profileData.append("email", email.value);
        if (password.value) {
            profileData.append("password", password.value);
        } else {
            //TODO decidere cosa fare quando l'utente non cambia la password (risubmittarla (andrebbe memorizzata plain) oppure non submittarla (cambiare il backend))
            profileData.append("password", "placeholder");
        }

        profileData.append("indirizzo", indirizzo.value);
        profileData.append("telefono", telefono.value);

        // prende l'immagine originale e la ritaglia in base a come e stata posizionata nel canvas dall'utente
        // questo viene fatto passando per un altro canvas hidden
        const canvas = document.getElementById("canvas2");
        const img = document.getElementById("img");

        canvas.setAttribute("width", Math.min(img.width, img.height));
        canvas.setAttribute("height", Math.min(img.width, img.height));

        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, x / ratio, y / ratio);

        canvas.toBlob((blob) => {
            //TODO decidere cosa fare quando l'immagine non viene cambiata
            if (document.getElementById("fileInput").files[0])
                profileData.append("foto", new File([blob], "profilePicture.png"));

            //prelievo del token
            const tokenHeader = new Headers();

            tokenHeader.append("x-access-token", loggedUser.token);

            fetch(API_USER_URL + "/" + loggedUser.id, {
                method: "PATCH",
                headers: tokenHeader,
                body: profileData,
            }).then((resp) =>
                resp
                    .json()
                    .then(function (data) {
                        console.log(resp);
                        console.log(data);

                        if (!resp.ok) {
                            //TODO mostrare un errore
                            console.error(data.message);
                        } else {
                            console.log(data);
                            //TODO mostrare un popup di conferma delle modifiche

                            //chiusura della modifica del form
                            editingStatus.status = false;

                            //aggiornamento dei dati salvati localmente
                            getUserData(email.value); //TODO non funziona perchè il token del frontend non è più valido
                        }

                        return;
                    })
                    .catch((error) => console.error(error))
            );
        });
    }

    function getUserData(email) {
        console.log(loggedUser.token);

        const tokenHeader = new Headers();

        tokenHeader.append("x-access-token", loggedUser.token);

        fetch(API_USER_URL + "/byEmail?" + new URLSearchParams({ email: email }), {
            headers: tokenHeader,
        }).then((resp) =>
            resp.json().then(function (data) {
                if (!resp.ok) {
                    console.error(data.message);
                } else {
                    console.log(data);
                    setLoggedUser(data);
                }
            })
        );
    }
}

function deleteProfile() {
    const tokenHeader = new Headers();

    tokenHeader.append("x-access-token", loggedUser.token);

    console.log(loggedUser);

    fetch(API_USER_URL + "/" + loggedUser.id, {
        method: "DELETE",
        headers: tokenHeader,
    }).then((resp) =>
        resp
            .json()
            .then(function (data) {
                console.log(resp);

                if (!resp.ok) {
                    console.error(data.message);
                } else {
                    //effettuare il logout
                    clearLoggedUser();

                    console.log(data);
                }

                return;
            })
            .catch((error) => console.error(error))
    ); // If there is any error you will catch them here
}

//simula un click sul campo nascosto per caricare la foto
function selectPhoto() {
    //permetto la modifica della foto solo se è stata attivata la modifica del profilo
    if (editingStatus.status) {
        if (dragging) return;
        const fileInput = document.getElementById("fileInput");
        fileInput.click();
    }
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
</script>

<template>
    <main>
        <h2>Profilo</h2>
        <form id="form-profile" class="">
            <span v-if="!loggedUser.token">Per vedere il tuo profilo devi prima fare il login</span>
            <span v-if="loggedUser.token">
                <table id="image-section">
                    <tr>
                        <td rowspan="2">
                            <!-- al posto della foto di default metto la foto dell'utente -->
                            <img
                                :src="HOST + loggedUser.URLfoto"
                                id="defaultPic"
                                class="profile-picture"
                                hidden />
                            <canvas id="canvas2" hidden></canvas>
                            <img id="img" hidden />

                            <canvas
                                id="canvas"
                                class="profile-picture"
                                v-bind:class="editingStatus.status ? '' : 'disabled'"
                                @mouseup="selectPhoto()"></canvas>

                            <input
                                type="file"
                                id="fileInput"
                                class="file-input"
                                accept="image/png, image/jpeg"
                                name="foto"
                                @change="cambio" />
                        </td>
                        <td>
                            <div class="wrap-input100">
                                <input
                                    type="text"
                                    class="input100"
                                    name="nome"
                                    placeholder="Nome"
                                    v-model="nome"
                                    :disabled="!editingStatus.status" />
                                <span class="focus-input100"></span>
                                <span class="symbol-input100">
                                    <i class="fa-solid fa-user" aria-hidden="true"></i>
                                </span>
                            </div>
                        </td>
                        <td>
                            <div class="wrap-input100">
                                <input
                                    type="text"
                                    class="input100"
                                    name="cognome"
                                    placeholder="Cognome"
                                    v-model="cognome"
                                    :disabled="!editingStatus.status" />
                                <span class="focus-input100"></span>
                                <span class="symbol-input100">
                                    <i class="fa-solid fa-user" aria-hidden="true"></i>
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <div class="wrap-input100">
                                <input
                                    type="text"
                                    class="input100"
                                    name="email"
                                    placeholder="Email"
                                    v-model="email"
                                    :disabled="!editingStatus.status" />
                                <span class="focus-input100"></span>
                                <span class="symbol-input100">
                                    <i class="fa-solid fa-envelope" aria-hidden="true"></i>
                                </span>
                            </div>
                        </td>
                    </tr>
                </table>
                <table>
                    <tr>
                        <td>
                            <div class="wrap-input100">
                                <input
                                    type="password"
                                    class="input100"
                                    name="password"
                                    placeholder="Nuova password"
                                    v-model="password"
                                    :disabled="!editingStatus.status" />
                                <span class="focus-input100"></span>
                                <span class="symbol-input100">
                                    <i class="fa-solid fa-lock" aria-hidden="true"></i>
                                </span>
                            </div>
                        </td>
                        <td>
                            <div class="wrap-input100">
                                <input
                                    type="password"
                                    class="input100"
                                    name="password"
                                    placeholder="Ripeti la password"
                                    v-model="ripetiPassword"
                                    :disabled="!editingStatus.status" />
                                <span class="focus-input100"></span>
                                <span class="symbol-input100">
                                    <i class="fa-solid fa-lock" aria-hidden="true"></i>
                                </span>
                            </div>
                        </td>
                    </tr>
                </table>
                <table>
                    <tr>
                        <td colspan="2">
                            <div class="wrap-input100">
                                <input
                                    type="text"
                                    class="input100"
                                    name="indirizzo"
                                    placeholder="Indirizzo"
                                    v-model="indirizzo"
                                    :disabled="!editingStatus.status" />
                                <span class="focus-input100"></span>
                                <span class="symbol-input100">
                                    <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td id="telefono">
                            <div class="wrap-input100">
                                <input
                                    type="tel"
                                    class="input100"
                                    name="telefono"
                                    placeholder="Telefono"
                                    v-model="telefono"
                                    :disabled="!editingStatus.status" />
                                <span class="focus-input100"></span>
                                <span class="symbol-input100">
                                    <i class="fa-solid fa-phone" aria-hidden="true"></i>
                                </span>
                            </div>
                        </td>
                        <td></td>
                    </tr>
                </table>

                <div class="button-line">
                    <div class="button-line">
                        <button
                            type="button"
                            class="form-button green animated rounded-corners-small"
                            v-if="!editingStatus.status"
                            @click="edit(true)">
                            <i class="fa-solid fa-user-pen" aria-hidden="true"></i>
                            <span>Modifica dati</span>
                        </button>
                        <button
                            type="reset"
                            class="form-button red animated rounded-corners-small"
                            v-if="editingStatus.status"
                            @click="resetEditing()">
                            <i class="fa-solid fa-circle-xmark" aria-hidden="true"></i>
                            <span>Annulla</span>
                        </button>
                        <button
                            type="button"
                            class="form-button green animated rounded-corners-small"
                            v-if="editingStatus.status"
                            @click="saveProfile()">
                            <i class="fa-solid fa-floppy-disk" aria-hidden="true"></i>
                            <span>Salva</span>
                        </button>
                    </div>
                    <div class="button-line">
                        <button
                            type="button"
                            class="form-button red animated rounded-corners-small"
                            @click="deleteProfile()">
                            <i class="fa-solid fa-user-xmark" aria-hidden="true"></i>
                            <span>Elimina account</span>
                        </button>
                    </div>
                </div>
            </span>
        </form>
    </main>
</template>

<style>
#form-profile {
    width: 80%;
    margin: 0 auto;
}

#form-profile .profile-picture {
    width: 250px;
    height: 250px;
    border-radius: 250px;

    transition: opacity 0.5s ease;
}

#form-profile .profile-picture:not(.disabled):hover {
    opacity: 0.6;
    cursor: pointer;
}

#form-profile table {
    width: 100%;
}

#form-profile #image-section {
    margin-bottom: 30px;
}

#form-profile table td {
    padding: 0px 20px;
}

#form-profile .file-input {
    display: none;
}

#form-profile #telefono {
    width: 50%;
}

#form-profile div.button-line {
    margin-top: 30px;
    display: flex;
    justify-content: space-around;
}

#form-profile div.button-line > .button-line {
    width: 50%;
    margin-top: 0px;
}
</style>
