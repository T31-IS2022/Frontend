// https://vuejs.org/guide/scaling-up/state-management.html#simple-state-management-with-reactivity-api

import { reactive } from "vue";

const loggedUser = reactive({
    token: undefined,
    email: undefined,
    id: undefined,
    nome: undefined,
    cognome: undefined,
    indirizzo: undefined,
    telefono: undefined,
    URLfoto: undefined,
});

function setLoggedUser(data) {
    loggedUser.token ??= data.token;
    loggedUser.email = data.email;
    loggedUser.id = data._id;
    loggedUser.nome = data.nome;
    loggedUser.cognome = data.cognome;
    loggedUser.indirizzo = data.indirizzo;
    loggedUser.telefono = data.telefono;
    loggedUser.URLfoto = data.URLfoto;
}

function clearLoggedUser() {
    loggedUser.token = undefined;
    loggedUser.email = undefined;
    loggedUser.id = undefined;
    loggedUser.nome = undefined;
    loggedUser.cognome = undefined;
    loggedUser.indirizzo = undefined;
    loggedUser.telefono = undefined;
    loggedUser.URLfoto = undefined;
}

export { loggedUser, setLoggedUser, clearLoggedUser };
