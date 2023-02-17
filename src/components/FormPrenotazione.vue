<script setup>
import { ref } from "vue";
import { loggedUser } from "../states/loggedUser";
import CardServizio from "./CardServizio.vue";
import CardSpazio from "./CardSpazio.vue";
const emit = defineEmits(["errore", "info", "successo", "toListaPrenotazioni"]);

const prezzo = ref(0);
const newRicorrenza = () => {
    return {
        inizio: ref(""),
        fine: ref(""),
        spazi: ref([]), // oggetti {spazio: obj, selezionato: bool}
    };
};

const ricorrenze = ref([newRicorrenza()]);

const aggiungiRicorrenza = () => {
    ricorrenze.value.push(newRicorrenza());
};
const rimuoviRicorrenza = (index) => {
    ricorrenze.value.splice(index, 1);
    if (ricorrenze.value.length == 0) {
        ricorrenze.value.push(newRicorrenza());
    }
};

const VITE_BACKEND = import.meta.env.VITE_BACKEND;
const getSpazi = async () => {
    return await fetch(`${VITE_BACKEND}/spazio`)
        .then((res) => {
            if (!res.ok) throw "spazi non trovati";
            return res.json();
        })
        .then((data) => {
            return data;
        })
        .catch((e) => {
            emit("errore", "Errore", e);
        });
};
const getDisponibilità = (index) => {
    const ricorrenza = ricorrenze.value[index];
    const inizio = ricorrenza.inizio;
    const fine = ricorrenza.fine;
    if (inizio == "" || fine == "") return;
    getSpazi()
        .then((spazi) => {
            const disponibilitaSpazi = Promise.all(
                spazi.map(async (spazio) => {
                    return await fetch(
                        `${VITE_BACKEND}/spazio/disponibilita?id=${spazio._id}&inizio=${inizio}&fine=${fine}`
                    ).then(async (res) => {
                        if (!res.ok) return;
                        const data = await res.json();
                        return { spazio: spazio, disponibilita: data.disponibilita };
                    });
                })
            );

            return disponibilitaSpazi;
        })
        .then((disponibilitaSpazi) => {
            const spaziDisponibili = disponibilitaSpazi
                .filter((spazio) => spazio.disponibilita)
                .map((a) => a.spazio);
            ricorrenza.spazi = spaziDisponibili.map((spazio) => {
                return {
                    spazio: spazio,
                    servizi: ref([]),
                    selezionato: ref(false),
                };
            });
        })
        .catch((e) => {
            console.error(e);
        });
};

const updatePrezzo = () => {
    let sum = 0;
    for (let ricorrenza of ricorrenze.value) {
        const inizio = ricorrenza.inizio;
        const fine = ricorrenza.fine;
        const ore = (new Date(fine) - new Date(inizio)) / 60 / 60 / 1000;
        for (let spazio of ricorrenza.spazi.filter((spazio) => spazio.selezionato)) {
            sum += spazio.spazio.prezzoIniziale + spazio.spazio.prezzoOra * ore;
            for (let servizio of spazio.servizi
                .filter((servizio) => servizio.selezionato)
                .map((servizio) => servizio.servizio)) {
                sum += servizio.prezzoIniziale + servizio.prezzoOra * ore;
            }
        }
    }
    prezzo.value = Math.round(sum * 100) / 100;
};

const updateServizi = (indexRicorrenza, indexSpazio, stato) => {
    const ricorrenza = ricorrenze.value[indexRicorrenza];
    const spazio = ricorrenza.spazi[indexSpazio];

    if (!stato) {
        spazio.servizi.splice(0, spazio.servizi.length);
        updatePrezzo();
        return;
    }

    const inizio = ricorrenza.inizio;
    const fine = ricorrenza.fine;

    const servizi = spazio.spazio.servizi;

    Promise.all(
        servizi.map((servizio) => {
            return fetch(
                `${VITE_BACKEND}/servizio/disponibilita?id=${servizio._id}&inizio=${inizio}&fine=${fine}`
            )
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    if (data.disponibilita) return servizio;
                    else return false;
                })
                .catch((e) => {
                    emit("errore", "Error", e);
                    return false;
                });
        })
    ).then((servizi) => {
        const serviziDisponibili = servizi.map((a) => a);

        spazio.servizi.push(
            ...serviziDisponibili.map((servizio) => {
                return {
                    servizio: servizio,
                    selezionato: ref(false),
                };
            })
        );
    });
};
const updateSpazio = (indexRicorrenza, indexSpazio, event) => {
    updateServizi(indexRicorrenza, indexSpazio, event.target.checked);
    updatePrezzo();
};
const reset = () => {
    ricorrenze.value = [newRicorrenza()];
    prezzo.value = 0;
};

const getOggettoRicorrenze = () => {
    const ret = [];
    for (let ricorrenza of ricorrenze.value) {
        if (ricorrenza.inizio == "" || ricorrenza.fine == "") continue;

        const spaziPrenotati = ricorrenza.spazi.filter((spazio) => spazio.selezionato);
        const serviziPrenotati = [];
        for (let spazio of spaziPrenotati) {
            serviziPrenotati.push(
                ...spazio.servizi
                    .filter((servizio) => servizio.selezionato)
                    .map((servizio) => servizio.servizio._id)
            );
        }

        ret.push({
            inizio: new Date(ricorrenza.inizio).toISOString(),
            fine: new Date(ricorrenza.fine).toISOString(),
            spaziPrenotati: spaziPrenotati.map((spazio) => spazio.spazio._id),
            serviziPrenotati: serviziPrenotati,
        });
    }
    return ret;
};
const submit = () => {
    const formData = JSON.stringify({
        proprietario: loggedUser.id,
        ricorrenze: getOggettoRicorrenze(),
    });

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("x-access-token", loggedUser.token);

    fetch(`${VITE_BACKEND}/prenotazione/`, {
        method: "POST",
        headers: headers,
        body: formData,
    }).then((res) => {
        if (res.ok) {
            emit("successo", "AAAAAAAAA", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
            emit("toListaPrenotazioni");
        } else {
            emit("errore", "AAAAAAAAA", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
        }
    });
};
</script>

<template>
    <p class="total-price">Costo totale: {{ prezzo }}€</p>
    <form onsubmit="return false">
        <div v-for="(ricorrenza, i) of ricorrenze">
            <div class="rounded-corners container-nuova-ricorrenza">
                <h4>Ricorrenza {{ i + 1 }}</h4>
                <p>Seleziona le date di inizio e di fine:</p>

                <table class="table-layout date-selector">
                    <tr>
                        <td>
                            <div class="wrap-input100">
                                <input
                                    type="datetime-local"
                                    class="input100"
                                    :name="'inizio' + i"
                                    placeholder="Inizio"
                                    v-model="ricorrenza.inizio"
                                    @change="getDisponibilità(i)" />
                                <span class="focus-input100"></span>
                                <span class="symbol-input100">
                                    <i class="fa-solid fa-lock" aria-hidden="true"></i>
                                </span>
                            </div>
                        </td>
                        <td>
                            <div class="wrap-input100">
                                <input
                                    type="datetime-local"
                                    class="input100"
                                    :name="'fine' + i"
                                    placeholder="Inizio"
                                    v-model="ricorrenza.fine"
                                    @change="getDisponibilità(i)" />
                                <span class="focus-input100"></span>
                                <span class="symbol-input100">
                                    <i class="fa-solid fa-lock" aria-hidden="true"></i>
                                </span>
                            </div>
                        </td>
                    </tr>
                </table>

                <p>Dopo aver selezionato le date, seleziona gli spazi</p>
                <div class="container-selettore-spazi">
                    <div v-for="(spazio, j) of ricorrenza.spazi" v-bind:key="spazio._id">
                        <table class="table-layout">
                            <tr>
                                <td>
                                    <input
                                        @change="updateSpazio(i, j, $event)"
                                        type="checkbox"
                                        v-model="spazio.selezionato"
                                        :name="'spazio' + i + '' + j" />
                                </td>
                                <td>
                                    <CardSpazio
                                        :spazio="spazio.spazio"
                                        :hideServizi="true"></CardSpazio>
                                </td>
                            </tr>
                        </table>
                        <div v-if="spazio.servizi.length > 0" class="container-lista-servizi">
                            <p>In questo spazio sono disponibili i seguenti servizi:</p>
                            <div>
                                <div
                                    v-for="(servizio, k) of spazio.servizi"
                                    v-bind:key="servizio._id">
                                    <table class="table-layout">
                                        <tr>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    @change="updatePrezzo"
                                                    v-model="servizio.selezionato"
                                                    :name="'servizio' + i + '' + j + '' + k" />
                                            </td>
                                            <td>
                                                <CardServizio
                                                    :servizio="servizio.servizio"></CardServizio>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="container-rimuovi-ricorrenza" v-if="i >= 1">
                    <button
                        type="button"
                        class="form-button red animated rounded-corners-small"
                        @click="rimuoviRicorrenza(i)">
                        <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
                        <span>Rimuovi ricorrenza</span>
                    </button>
                </div>
            </div>
        </div>
        <div id="button-new-ricorrenza">
            <button
                type="button"
                class="form-button add-button rounded-corners-small"
                @click="aggiungiRicorrenza">
                <span>Aggiungi ricorrenza</span>
            </button>
        </div>
        <div class="button-line-form-prenotazione">
            <button
                type="button"
                class="form-button red animated rounded-corners-small"
                @click="emit('toListaPrenotazioni')">
                <i class="fa-solid fa-circle-xmark" aria-hidden="true"></i>
                <span>Annulla</span>
            </button>

            <button type="reset" class="form-button animated rounded-corners-small" @click="reset">
                <i class="fa-solid fa-eraser" aria-hidden="true"></i>
                <span>Resetta il form</span>
            </button>

            <button
                type="submit"
                class="form-button green animated rounded-corners-small"
                @click="submit">
                <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
                <span>Salva prenotazione</span>
            </button>
        </div>
    </form>
</template>

<style scoped>
.total-price {
    margin-left: 30px;
}

.container-nuova-ricorrenza {
    background: rgba(255, 255, 255, 0.5);
    margin: 10px 30px 30px 30px;
}

.table-layout {
    width: 100%;
}

.date-selector td {
    padding: 10px 20px 10px 20px;
}

.container-selettore-spazi {
    max-height: 600px;
    overflow-y: auto;
}

.container-lista-servizi {
    margin: 0px 20px 0px 30px;
}

.container-lista-servizi > div {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: center;
}

.container-lista-servizi > div > * {
    flex-grow: 1;
    width: 50%;
}

#button-new-ricorrenza {
    margin: 30px;
}
#button-new-ricorrenza button {
    width: 100%;
    height: 80px;
}

.container-rimuovi-ricorrenza {
    display: flex;
    justify-content: end;
}

.button-line-form-prenotazione {
    margin-top: 10px;
    display: flex;
    justify-content: space-around;
}
</style>
