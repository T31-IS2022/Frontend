<script setup>
import { ref, onMounted } from "vue";
import {
    loggedUser,
    setLoggedUser,
    clearLoggedUser,
} from "../states/loggedUser.js";

const HOST = `http://localhost:3000`;
const API_USER_URL = HOST + `/utente`;

const email = ref("test@gmail.com");
const password = ref("1234#");

// const loggedUser = ref({})
// const loggedUser = defineProps(['loggedUser'])
const emit = defineEmits(["login"]);

function login() {
    //inserisco i valori come campi di un form
    const loginData = new URLSearchParams();
    loginData.append("email", email.value);
    loginData.append("password", password.value);

    fetch(API_USER_URL + "/login", {
        method: "POST",
        body: loginData,
    }).then((resp) =>
        resp
            .json()
            .then(function (data) {
                console.log(resp);
                console.log(data);

                if (!resp.ok) {
                    console.error(data.message);
                } else {
                    // recupero le informazioni su questo utente
                    setLoggedUser(data);

                    getUserData(email.value);

                    console.log(data);
                    // loggedUser.token = data.token;
                    // loggedUser.email = data.email;
                    // loggedUser.id = data.id;
                    // loggedUser.self = data.self;
                }

                emit("login", loggedUser);
                return;
            })
            .catch((error) => console.error(error))
    ); // If there is any error you will catch them here
}

function logout() {
    clearLoggedUser();
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

let popupLoginVisible = false;

function togglePopupLogin() {
    let popup = document.getElementById("popup-login");
    let navbar = document.getElementById("navbar");

    let navbarHeight = window
        .getComputedStyle(navbar, null)
        .getPropertyValue("height");

    if (!popupLoginVisible) {
        popup.style.right = "0px";
        popup.style.top = navbarHeight;
        popup.style.display = "block";
    } else {
        popup.style.display = "none";
    }

    popupLoginVisible = !popupLoginVisible;
}
</script>

<template>
    <button id="login-button" class="acrylic" @click="togglePopupLogin()">
        <span v-if="loggedUser.token">
            Ciao {{ loggedUser.nome }}
            <!--
            <a :href="HOST + '/' + loggedUser.self">{{ loggedUser.email }}</a>
            <button type="button" @click="logout">LogOut</button>
            -->
        </span>
        <span v-if="!loggedUser.token">Login</span>
    </button>
    <div id="popup-login">
        <div class="acrylic rounded-corners">
            <form>
                <span v-if="loggedUser.token">
                    Welcome
                    <button type="button" @click="logout">LogOut</button>
                </span>

                <span v-if="!loggedUser.token">
                    <input name="email" v-model="email" />
                    <input name="password" v-model="password" />
                    <button type="button" @click="login">LogIn</button>
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
</style>