<script setup>
import { ref, onMounted } from "vue";
import { loggedUser, setLoggedUser, clearLoggedUser } from "../states/loggedUser.js";
import { reactive } from "vue";
import InputFoto from "../components/inputFoto.vue";

const emit = defineEmits(["errore", "info", "successo"]);

let signupStatus = reactive({
    status: false,
});

const HOST = import.meta.env.VITE_BACKEND;
const API_USER_URL = HOST + `/utente`;

//variabili in che contengono il valore dei campi del form di registrazione
const nome = ref("");
const cognome = ref("");
const email = ref("");
const password = ref("");
const ripetiPassword = ref("");
const indirizzo = ref("");
const civico = ref("");
const citta = ref("");
const telefono = ref("");
const inputFoto = ref(null);

// const loggedUser = ref({})
// const loggedUser = defineProps(['loggedUser'])
//const emit = defineEmits(["login"]);

async function signup() {
    if (password.value != ripetiPassword.value) {
        emit("errore", "Errore", "Le password sono diverse.");
    } else {
        let indirizzoCompleto = "";
        if (indirizzo.value && civico.value && citta.value) {
            indirizzoCompleto = indirizzo.value + " " + civico.value + ", " + citta.value;
        }

        //inserisco i valori come campi di un form
        const signupData = new FormData();
        signupData.append("nome", nome.value);
        signupData.append("cognome", cognome.value);
        signupData.append("email", email.value);
        signupData.append("password", password.value);
        signupData.append("indirizzo", indirizzoCompleto);
        signupData.append("telefono", telefono.value);

        const file = await inputFoto.value.getFile();
        signupData.append("foto", file);

        fetch(API_USER_URL + "/registrazione", {
            method: "POST",
            body: signupData,
        })
            .then((resp) =>
                resp
                    .json()
                    .then(function (data) {
                        if (!resp.ok) {
                            emit(
                                "errore",
                                "Errore",
                                "Impossibile inviare i dati al database.\nErrore: " + data.message
                            );
                        } else {
                            console.log(data);

                            signupStatus.status = true;
                        }

                        //emit("login", loggedUser);
                        return;
                    })
                    .catch((error) => {
                        emit("errore", "Errore", "Errore imprevisto: " + error);
                    })
            )
            .catch((error) => {
                emit("errore", "Errore", "Errore imprevisto: " + error);
            });
    }
}

function resetPhoto() {
    inputFoto.value.resetPhoto();
}
</script>

<template>
    <main>
        <h2>Registrazione</h2>
        <form id="form-signup">
            <span v-if="loggedUser.token">Sei già loggato, non serve registrarsi di nuovo!</span>
            <span v-if="!loggedUser.token">
                <span v-if="signupStatus.status">
                    <div id="email-success">
                        <span>
                            <h1>Grazie!</h1>
                            <br />
                            <p>Ti abbiamo inviato un'email per confermare la tua registrazione.</p>
                            <a
                                href="https://mail.google.com"
                                target="_blank"
                                class="email-link rounded-corners-small"
                                ><img src="@/assets/gmail-logo.png" alt="Apri gmail"
                            /></a>
                            <a
                                href="https://outlook.live.com"
                                target="_blank"
                                class="email-link rounded-corners-small"
                                ><img src="@/assets/outlook-logo.png" alt="Apri outlook"
                            /></a>
                        </span>

                        <img
                            src="@/assets/email-success.gif"
                            id="email-gif"
                            class="rounded-corners" />
                    </div>
                </span>
                <span v-if="!signupStatus.status">
                    <table id="image-section">
                        <tr>
                            <td rowspan="2">
                                <InputFoto ref="inputFoto"></InputFoto>
                            </td>
                            <td>
                                <div class="wrap-input100">
                                    <input
                                        type="text"
                                        class="input100"
                                        name="nome"
                                        placeholder="Nome"
                                        v-model="nome" />
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
                                        v-model="cognome" />
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
                                        v-model="email" />
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
                                        placeholder="Password"
                                        v-model="password" />
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
                                        v-model="ripetiPassword" />
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
                            <td>
                                <div class="wrap-input100">
                                    <input
                                        type="text"
                                        class="input100"
                                        name="indirizzo"
                                        placeholder="Indirizzo"
                                        v-model="indirizzo" />
                                    <span class="focus-input100"></span>
                                    <span class="symbol-input100">
                                        <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
                                    </span>
                                </div>
                            </td>
                            <td id="civico">
                                <div class="wrap-input100">
                                    <input
                                        type="text"
                                        class="input100"
                                        name="civico"
                                        placeholder="N°"
                                        v-model="civico" />
                                    <span class="focus-input100"></span>
                                    <span class="symbol-input100">
                                        <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
                                    </span>
                                </div>
                            </td>
                            <td>
                                <div class="wrap-input100">
                                    <input
                                        type="text"
                                        class="input100"
                                        name="citta"
                                        placeholder="Città"
                                        v-model="citta" />
                                    <span class="focus-input100"></span>
                                    <span class="symbol-input100">
                                        <i class="fa-solid fa-city" aria-hidden="true"></i>
                                    </span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="wrap-input100">
                                    <input
                                        type="tel"
                                        class="input100"
                                        name="telefono"
                                        placeholder="Telefono"
                                        v-model="telefono" />
                                    <span class="focus-input100"></span>
                                    <span class="symbol-input100">
                                        <i class="fa-solid fa-phone" aria-hidden="true"></i>
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </table>

                    <div class="button-line">
                        <button
                            type="reset"
                            class="form-button red animated rounded-corners-small"
                            @click="resetPhoto()">
                            <i class="fa-solid fa-circle-xmark" aria-hidden="true"></i>
                            <span>Annulla</span>
                        </button>
                        <button
                            type="button"
                            class="form-button green animated rounded-corners-small"
                            @click="signup">
                            <i class="fa-solid fa-right-to-bracket" aria-hidden="true"></i>
                            <span>Registrati</span>
                        </button>
                    </div>
                </span>
            </span>
        </form>
    </main>
</template>

<style>
#form-signup {
    width: 80%;
    margin: 0 auto;
}

#form-signup table {
    width: 100%;
}

#form-signup #image-section {
    margin-bottom: 30px;
}

#form-signup table td {
    padding: 0px 20px;
}

#form-signup #civico {
    width: 20%;
}

#form-signup div.button-line {
    margin-top: 30px;
    display: flex;
    justify-content: space-around;
}

#email-success {
    display: flex;
    justify-content: space-around;
    align-items: center;
}

#email-success .email-link {
    cursor: pointer;
    display: inline-block;
    margin: 20px;
    background: #ffffff;
    padding: 0px 10px;

    transition: background 0.5s ease;
}

#email-success .email-link:hover {
    background: #ffffffb2;
}

#email-success .email-link img {
    height: 40px;
    margin: 0px;
}

#email-success img {
    padding: 0px;
    margin: 20px;
    max-width: 400px;
}
</style>
