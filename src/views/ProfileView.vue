<script setup>
import { ref, onMounted } from "vue";
import { loggedUser, setLoggedUser, clearLoggedUser } from "../states/loggedUser.js";
import { reactive } from "vue";

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
const indirizzo = ref("");
const telefono = ref("");

function edit(status) {
    editingStatus.status = status;
}

function resetEditing() {
    //rimettere nei campi i valori originali

    editingStatus.status = false;
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
                            <img
                                src="@/assets/profile-default.png"
                                id="defaultPic"
                                class="profile-picture"
                                hidden />
                            <canvas id="canvas2" hidden></canvas>
                            <img id="img" hidden />

                            <canvas
                                id="canvas"
                                class="profile-picture"
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
                            <span>Modifica</span>
                        </button>
                        <button
                            type="reset"
                            class="form-button red animated rounded-corners-small"
                            v-if="editingStatus.status"
                            @click="resetEditing()">
                            <!--resetPhoto()-->
                            <i class="fa-solid fa-circle-xmark" aria-hidden="true"></i>
                            <span>Annulla</span>
                        </button>
                        <button
                            type="button"
                            class="form-button green animated rounded-corners-small"
                            v-if="editingStatus.status"
                            @click="edit(false)">
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
    cursor: pointer;

    transition: opacity 0.5s ease;
}

#form-profile .profile-picture:hover {
    opacity: 0.6;
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
