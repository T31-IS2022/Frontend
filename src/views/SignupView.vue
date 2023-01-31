<script setup>
import { ref, onMounted } from "vue";
import { loggedUser, setLoggedUser, clearLoggedUser } from "../states/loggedUser.js";

onMounted(() => {
    console.log("registrazione mounted");
});
</script>

<template>
    <main>
        <h2>Registrazione</h2>
        <form id="form-signup">
            <span v-if="loggedUser.token">Sei già loggato, non serve registrarsi di nuovo!</span>
            <span v-if="!loggedUser.token">
                <table id="image-section">
                    <tr>
                        <td rowspan="2">
                            <img src="@/assets/profile-default.png" class="profile-picture" />
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
                                    v-model="password" />
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
                        @click="null">
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
        </form>
    </main>
</template>

<style>
#form-signup {
    width: 80%;
    margin: 0 auto;
}

#form-signup .profile-picture {
    width: 250px;
    border-radius: 250px;
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
</style>
