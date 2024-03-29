<script setup>
import { ref, onMounted } from "vue";
import { logUser, loggedUser, setLoggedUser, clearLoggedUser } from "../states/loggedUser.js";

const emit = defineEmits(["login", "errore", "info", "successo"]);

onMounted(() => {
    let popup = document.getElementById("popup-login");

    document.body.appendChild(popup);
});

const HOST = import.meta.env.VITE_BACKEND;
const API_USER_URL = HOST + `/utente`;

//variabili in che contengono il valore dei campi del login
const email = ref("");
const password = ref("");

function login() {
    //chiudo il popup
    togglePopupLogin();

    //inserisco i valori come campi di un form
    const loginData = new URLSearchParams();
    loginData.append("email", email.value);
    loginData.append("password", password.value);

    fetch(API_USER_URL + "/login", {
        method: "POST",
        body: loginData,
    })
        .then((resp) =>
            resp
                .json()
                .then(function (data) {
                    if (!resp.ok) {
                        emit(
                            "errore",
                            "Errore",
                            "Impossibile eseguire l'accesso.\nErrore: " + data.message
                        );
                    } else {
                        // recupero le informazioni su questo utente
                        logUser(data).catch((e) => {
                            emit("errore", "Errore", "Sessione scaduta");
                        });
                        console.log(data);
                    }

                    emit("login", loggedUser);
                    return;
                })
                .catch((error) => {
                    emit("errore", "Errore", "Errore imprevisto: " + error);
                })
        )
        .catch((error) => {
            emit("errore", "Errore", "Errore imprevisto: " + error);
        }); // If there is any error you will catch them here
}

function logout() {
    //chiudo il popup
    togglePopupLogin();

    clearLoggedUser();
}

function getUserData(email) {
    console.log(loggedUser.token);

    const tokenHeader = new Headers();

    tokenHeader.append("x-access-token", loggedUser.token);

    fetch(API_USER_URL + "/byEmail?" + new URLSearchParams({ email: email }), {
        headers: tokenHeader,
    })
        .then((resp) =>
            resp.json().then(function (data) {
                if (!resp.ok) {
                    emit(
                        "errore",
                        "Errore",
                        "Impossibile recuperare i dati dal database.\nErrore: " + data.message
                    );
                } else {
                    console.log(data);
                    setLoggedUser(data);
                    emit("successo", "Bentornato!");
                }
            })
        )
        .catch((error) => {
            emit("errore", "Errore", "Errore imprevisto: " + error);
        });
}

let popupLoginVisible = false;

function togglePopupLogin() {
    let popup = document.getElementById("popup-login");
    let navbar = document.getElementById("navbar");

    if (!popupLoginVisible) {
        popup.style.display = "block";

        //posizionamento del popup sotto alla navbar
        let popupRect = popup.getBoundingClientRect();
        var navbarRect = navbar.getBoundingClientRect();

        let popupRight = window.innerWidth - navbarRect.x - navbarRect.width;
        let popupTop = navbarRect.y + navbarRect.height;

        popup.style.right = popupRight + "px";
        popup.style.top = popupTop + "px";
    } else {
        popup.style.display = "none";
    }

    popupLoginVisible = !popupLoginVisible;
}
</script>

<template>
    <button id="login-button" class="acrylic" @click="togglePopupLogin()">
        <span v-if="loggedUser.token">
            {{ loggedUser.nome || "Account" }}
        </span>
        <span v-if="!loggedUser.token">Account</span>
    </button>
    <div id="popup-login">
        <div class="acrylic rounded-corners">
            <form>
                <span v-if="loggedUser.token">
                    <table id="profile-card">
                        <tr>
                            <td>
                                <img :src="HOST + loggedUser.URLfoto" class="profile-picture" />
                            </td>
                            <td>
                                <span id="profile-name">
                                    {{ loggedUser.nome }}
                                    {{ loggedUser.cognome }}
                                </span>
                                <span> {{ loggedUser.email }} </span>

                                <span
                                    >Guarda il tuo
                                    <RouterLink to="/profilo" @click="togglePopupLogin()"
                                        >Profilo</RouterLink
                                    >
                                </span>
                            </td>
                        </tr>
                    </table>

                    <div class="button-line">
                        <button
                            type="button"
                            class="form-button animated rounded-corners-small"
                            @click="togglePopupLogin()">
                            <i class="fa-solid fa-circle-xmark" aria-hidden="true"></i>
                            <span>Chiudi</span>
                        </button>
                        <button
                            type="button"
                            class="form-button red animated rounded-corners-small"
                            @click="logout">
                            <i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
                            <span>Logout</span>
                        </button>
                    </div>
                </span>

                <span v-if="!loggedUser.token">
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

                    <span
                        >Non hai un account?
                        <RouterLink to="/registrazione" @click="togglePopupLogin()"
                            >Registrati ora!</RouterLink
                        >
                    </span>

                    <div class="button-line">
                        <button
                            type="button"
                            class="form-button animated rounded-corners-small"
                            @click="togglePopupLogin()">
                            <i class="fa-solid fa-circle-xmark" aria-hidden="true"></i>
                            <span>Chiudi</span>
                        </button>
                        <button
                            type="button"
                            class="form-button green animated rounded-corners-small"
                            @click="login">
                            <i class="fa-solid fa-right-to-bracket" aria-hidden="true"></i>
                            <span>Login</span>
                        </button>
                    </div>
                </span>
            </form>
        </div>
    </div>
</template>


<style scoped>
#popup-login {
    position: fixed;
    display: none;

    z-index: 1000;

    transition: display 0.5s ease;
}

#popup-login > div {
    border-top-right-radius: 0px;
}

#popup-login div.button-line {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
}

#profile-card .profile-picture {
    width: 120px;
    height: 120px;
    border-radius: 120px;
}

#profile-card span {
    display: block;
    margin: 10px 20px;
}

#profile-card #profile-name {
    font-size: 20px;
}
</style>