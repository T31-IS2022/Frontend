<script setup>
import { ref } from "vue";
import { RouterLink, RouterView } from "vue-router";
import Login from "@/components/Login.vue";
import GestorePopup from "@/components/GestorePopup.vue";
import { logUser } from "./states/loggedUser";

function changeGradient(nextActive) {
    let active = document.getElementById(nextActive);

    let all = document.getElementsByClassName("background");

    for (var i = 0; i < all.length; i++) {
        all[i].classList.remove("bg-active");
    }

    active.classList.add("bg-active");
}

let darkModeActive = false;

function toggleDarkMode() {
    if (darkModeActive) {
        document.getElementById("bg-black").classList.remove("bg-active");
        document.getElementById("dark-toggle").innerHTML = `<i class="fa-solid fa-moon"></i>`;
    } else {
        document.getElementById("bg-black").classList.add("bg-active");
        document.getElementById("dark-toggle").innerHTML = `<i class="fa-solid fa-sun"></i>`;
    }

    darkModeActive = !darkModeActive;
}

//popup per i messaggi
const gestorePopup = ref(null);

function fun1(titolo, descrizione) {
    gestorePopup.value.errore(titolo, descrizione);
}

function fun2(titolo, descrizione) {
    gestorePopup.value.info(titolo, descrizione);
}

function fun3(titolo, descrizione) {
    gestorePopup.value.conferma(titolo, descrizione);
}

logUser();
</script>

<template>
    <div id="bg-orange" class="background"></div>
    <div id="bg-yellow" class="background"></div>
    <div id="bg-green" class="background"></div>
    <div id="bg-blue" class="background bg-active"></div>
    <div id="bg-violet" class="background"></div>
    <div id="bg-black" class="dark-background"></div>

    <div id="header">
        <nav id="navbar" class="acrylic rounded-corners">
            <RouterLink to="/" class="acrylic" @click="changeGradient('bg-blue')">Home</RouterLink>
            <RouterLink to="/oratorio" class="acrylic" @click="changeGradient('bg-blue')"
                >Oratorio</RouterLink
            >
            <RouterLink to="/eventi" class="acrylic" @click="changeGradient('bg-blue')"
                >Eventi</RouterLink
            >
            <RouterLink to="/prenotazioni" class="acrylic" @click="changeGradient('bg-blue')"
                >Prenotazioni</RouterLink
            >

            <!-- componente per eseguire il login -->
            <Login @errore="fun1" @info="fun2" @successo="fun3" />
        </nav>
        <button id="dark-toggle" class="acrylic" @click="toggleDarkMode()">
            <i class="fa-solid fa-moon"></i>
        </button>
    </div>

    <div id="page-scroll">
        <div id="content">
            <div class="acrylic rounded-corners">
                <!-- componente che visualizza la vista selezionata nella navbar -->
                <RouterView @errore="fun1" @info="fun2" @successo="fun3" />
            </div>
        </div>

        <div id="footer" class="unselectable">
            <div class="rounded-corners-small acrylic">
                Made with &#10084;&#65039; by Gruppo T31
            </div>
        </div>
    </div>

    <GestorePopup ref="gestorePopup" />
</template>

<style scoped>
</style>
