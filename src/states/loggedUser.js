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

    document.cookie = 'x-access-token=;Max-Age=0'
}

async function logUser(data){
    if (data)
        document.cookie = `x-access-token=${JSON.stringify(data.token)};`;
    const match = document.cookie.match(/x-access-token="(?<token>.+)"(;|$)/);
    if (!match)
        return;
    const token = match.groups.token;

    const tokenHeader = new Headers();
    tokenHeader.append("x-access-token", token);
    const res = await fetch(`${import.meta.env.VITE_BACKEND}/utente/byToken/`,{headers:tokenHeader})
    if (!res.ok)
        throw new Error('cannot fetch user')
    const user = await res.json();
    
    loggedUser.token = token;
    loggedUser.email = user.email;
    loggedUser.id = user._id;
    loggedUser.nome = user.nome;
    loggedUser.cognome = user.cognome;
    loggedUser.indirizzo = user.indirizzo;
    loggedUser.telefono = user.telefono;
    loggedUser.URLfoto = user.URLfoto;
}

export { loggedUser, setLoggedUser, clearLoggedUser, logUser };
