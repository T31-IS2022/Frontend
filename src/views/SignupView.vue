<script setup>
import { ref, onMounted } from "vue";
import { loggedUser, setLoggedUser, clearLoggedUser } from "../states/loggedUser.js";
import { reactive } from "vue";

let x,y;
let oldx,oldy,premuto;
let listener;
let ratio=1;
let dragging=false;

let cambio;

onMounted(() => {
    //TODO potrei controllare se l'utente è loggato, e in tal caso mandarlo al profilo
    console.log("registrazione mounted");

    const defaultImage = document.getElementById('defaultPic');
    defaultImage.onload=()=>{
        const canvas = document.getElementById('canvas');
        canvas.setAttribute('width', defaultImage.width);
        canvas.setAttribute('height', defaultImage.height);
        canvas.getContext("2d").drawImage(defaultImage,0,0);
    };
    var context = canvas.getContext("2d");

    ['mousedown','touchstart'].forEach(eventName=>{
        canvas.addEventListener(eventName,e=>{
            premuto=true;
            oldx = e.x || e.changedTouches[0].clientX;
            oldy = e.y || e.changedTouches[0].clientY;
        });
    });

    ['mouseup','touchend'].forEach(eventName=>{
        document.addEventListener(eventName,e=>{
            premuto=false;
            dragging=false;
        });
    });

    cambio = ()=>{
        const input = document.getElementById('fileInput')
        const file = input.files[0];
        if (!file)
            return;
        const url = URL.createObjectURL(file);
        const img = document.getElementById("img");
        img.onload=()=>{
            if (img.width<img.height)
                ratio = canvas.height/img.width;
            else
                ratio = canvas.height/img.height;

            const newWidth = img.width*ratio
            const newHeight = img.height*ratio;
            
            const minWidth = canvas.width-newWidth;
            const minHeight = canvas.height-newHeight;
				
            x = minWidth/2;
            y = minHeight/2;

            context.clearRect(0,0,canvas.width,canvas.height);
            context.drawImage(img, x, y, newWidth,newHeight);

            if (listener)
                ['mousemove','touchmove'].forEach(eventName=>{
                    canvas.removeEventListener(eventName, listener)
                });
            listener = e => {
                e.preventDefault();
                if (!premuto) return;
                dragging = true;

                const ex = e.x || e.changedTouches[0].clientX;
                const ey = e.y || e.changedTouches[0].clientY;

                const deltax = ex-oldx;
                const deltay = ey-oldy;

                x = Math.min(0, Math.max(minWidth, x+deltax));
                y = Math.min(0, Math.max(minHeight, y+deltay));

                context.clearRect(0,0,canvas.width,canvas.height);
                context.drawImage(img, x,y, newWidth,newHeight);

                oldx=ex;
                oldy=ey;
            }

            ['mousemove','touchmove'].forEach(eventName=>{
                canvas.addEventListener(eventName, listener);
            });
        }
        img.setAttribute('src', url);
    }
});

let signupStatus = reactive({
    status: false,
});

const HOST = `http://localhost:3000`;
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

// const loggedUser = ref({})
// const loggedUser = defineProps(['loggedUser'])
//const emit = defineEmits(["login"]);

function signup() {
    if (password.value != ripetiPassword.value) {
        //TODO mostrare un errore
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

        // prende l'immagine originale e la ritaglia in base a come e stata posizionata nel canvas dall'utente
        // questo viene fatto passando per un altro canvas hidden
        const canvas = document.getElementById('canvas2');
        const img = document.getElementById('img');

        canvas.setAttribute('width', Math.min(img.width, img.height));
        canvas.setAttribute('height', Math.min(img.width, img.height));

        const context = canvas.getContext('2d');
        context.clearRect(0,0,canvas.width, canvas.height);
        context.drawImage(img, x/ratio,y/ratio)

        canvas.toBlob(blob=>{
            if (document.getElementById('fileInput').files[0])  
                signupData.append("foto", new File([blob],'profilePicture.png'));

            fetch(API_USER_URL + "/registrazione", {
                method: "POST",
                body: signupData,
            }).then((resp) =>
                resp
                .json()
                .then(function (data) {
                    console.log(resp);
                    console.log(data);

                    if (!resp.ok) {
                        console.error(data.message);
                    } else {
                        console.log(data);
                        //TODO dire all'utente di guardare la sua casella di posta
                        signupStatus.status = true;
                    }

                    //emit("login", loggedUser);
                    return;
                })
                .catch((error) => console.error(error))
            );
        });
    }
}


//simula un click sul campo nascosto per caricare la foto
function selectPhoto() {
    if (dragging) return;
    const fileInput = document.getElementById("fileInput");
    fileInput.click();
}

function resetPhoto() {
    document.getElementById('fileInput').value="";
    document.getElementById('img').setAttribute('src', document.getElementById('defaultPic').getAttribute('src'));
    document.getElementById('canvas').getContext('2d').drawImage(document.getElementById('defaultPic'),0,0);
}
</script>

<template>
    <main>
        <h2>Registrazione</h2>
        <form id="form-signup">
            <span v-if="loggedUser.token">Sei già loggato, non serve registrarsi di nuovo!</span>
            <span v-if="!loggedUser.token">
                <span v-if="signupStatus.status"
                    >Guarda la tua casella di posta e conferma la registrazione</span
                >
                <span v-if="!signupStatus.status">
                    <table id="image-section">
                        <tr>
                            <td rowspan="2">
                                <img src="@/assets/profile-default.png" id='defaultPic' class="profile-picture" hidden />
                                <canvas id="canvas2" hidden></canvas>
                                <img id="img" hidden>

                                <canvas id="canvas" class="profile-picture" @mouseup="selectPhoto()"></canvas>
                                    
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

#form-signup .profile-picture {
    width: 250px;
    height: 250px;
    border-radius: 250px;
    cursor: pointer;

    transition: opacity 0.5s ease;
}

#form-signup .profile-picture:hover {
    opacity: 0.6;
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

#form-signup .file-input {
    display: none;
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
