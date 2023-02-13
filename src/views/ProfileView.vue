<script setup>
import { ref, onMounted } from "vue";
import { loggedUser, setLoggedUser, clearLoggedUser } from "../states/loggedUser.js";
import { reactive } from "vue";
import InputFoto from "../components/inputFoto.vue";
import router from "../router";

onMounted(() => {
    //se l'utente non è loggato faccio un redirect alla home
    if (!loggedUser.token) {
        router.replace("/");
    } else {
        //TODO se l'utente logga dopo aver già montato il profilo, l'inputFoto rimane abilitato
        inputFoto.value.disable();
    }
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
const indirizzo = ref(loggedUser.indirizzo || "");
const telefono = ref(loggedUser.telefono || "");
const inputFoto = ref(null);

function edit(status) {
    editingStatus.status = status;
    if (status) {
        inputFoto.value.enable();
    } else {
        inputFoto.value.disable();
    }
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

    inputFoto.value.disable();
    inputFoto.value.resetPhoto();
}

async function saveProfile() {
    if ((password.value || ripetiPassword.value) && password.value != ripetiPassword.value) {
        //TODO mostrare un errore
        console.err("Password diverse!");
    } else {
        //inserisco i valori come campi di un form
        const profileData = new FormData();
        profileData.append("nome", nome.value);
        profileData.append("cognome", cognome.value);
        profileData.append("email", email.value);
        if (password.value) profileData.append("password", password.value);

        profileData.append("indirizzo", indirizzo.value);
        profileData.append("telefono", telefono.value);

        const file = await inputFoto.value.getFile();
        profileData.append("foto", file);

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
                        edit(false);

                        loggedUser.token = data.token;

                        //aggiornamento dei dati salvati localmente
                        getUserData(email.value);
                    }

                    return;
                })
                .catch((error) => console.error(error))
        );
    }
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
const deletePhoto = () => {
    inputFoto.value.deletePhoto();
};
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
                            <InputFoto
                                :default-photo-u-r-l="loggedUser.URLfoto"
                                ref="inputFoto"></InputFoto>
                            <button
                                type="button"
                                v-if="editingStatus.status"
                                id="delete-photo"
                                @click="deletePhoto">
                                <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
                            </button>
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

#form-profile #delete-photo {
    font-size: 16px;
    color: #999999;
    background: white;

    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: none;

    cursor: pointer;

    position: fixed;
    translate: -20px 20px;

    transition: color 0.25s ease;
}

#form-profile #delete-photo:hover {
    color: #666666;
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
