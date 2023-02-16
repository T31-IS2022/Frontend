<script setup>
import { ref } from 'vue';
import { loggedUser } from '../states/loggedUser';
import CardServizio from './CardServizio.vue';
import CardSpazio from './CardSpazio.vue';
const emit = defineEmits(["errore", "info", "successo"]);

const prezzo = ref(0);
const newRicorrenza = ()=>{
    return {
        inizio: ref(""),
        fine: ref(""),
        spazi: ref([]),  // oggetti {spazio: obj, selezionato: bool}
    }
}

const ricorrenze = ref([newRicorrenza()]);

const aggiungiRicorrenza=()=>{
    ricorrenze.value.push(newRicorrenza())
}
const rimuoviRicorrenza = (index)=>{
    ricorrenze.value.splice(index,1);
    if (ricorrenze.value.length==0){
        ricorrenze.value.push(newRicorrenza());
    }
}

const VITE_BACKEND = import.meta.env.VITE_BACKEND;
const getSpazi = async ()=>{
    return await fetch(`${VITE_BACKEND}/spazio`)
    .then(res=>{
        if (!res.ok)
            throw "spazi non trovati";
        return res.json();
    })
    .then(data=>{
        return data;
    })
    .catch(e=>{
        emit("errore","Errore",e);
    })
}
const getDisponibilità = (index)=>{
    const ricorrenza = ricorrenze.value[index];
    const inizio = ricorrenza.inizio;
    const fine = ricorrenza.fine;
    if (inizio=="" || fine=="")
        return;
    getSpazi()
    .then(spazi=>{
        const disponibilitaSpazi = Promise.all(spazi.map(async spazio=>{
            return await fetch(`${VITE_BACKEND}/spazio/disponibilita?id=${spazio._id}&inizio=${inizio}&fine=${fine}`)
            .then(async res=>{
                if (!res.ok)
                    return 
                const data = await res.json();
                return {spazio: spazio, disponibilita: data.disponibilita};
            })
        }))

        return disponibilitaSpazi;
    })
    .then(disponibilitaSpazi=>{
        const spaziDisponibili =  disponibilitaSpazi.filter(spazio=>spazio.disponibilita).map(a=>a.spazio)
        ricorrenza.spazi = spaziDisponibili.map(spazio=>{return {
            spazio: spazio,
            servizi: ref([]),
            selezionato: ref(false)
        }});
    })
    .catch(e=>{
        console.error(e);
    })
}


const updatePrezzo = ()=>{
    let sum = 0;
    for (let ricorrenza of ricorrenze.value){
        const inizio = ricorrenza.inizio;
        const fine = ricorrenza.fine;
        const ore = (new Date(fine) - new Date(inizio))/60/60/1000;
        for (let spazio of ricorrenza.spazi.filter(spazio=>spazio.selezionato)){
            sum += spazio.spazio.prezzoIniziale + spazio.spazio.prezzoOra*ore;
            for (let servizio of spazio.servizi.filter(servizio=>servizio.selezionato).map(servizio=>servizio.servizio)){
                sum += servizio.prezzoIniziale + servizio.prezzoOra*ore;
            }
        }
    }
    prezzo.value = Math.round(sum*100)/100;
}

const updateServizi = (indexRicorrenza, indexSpazio, stato)=>{
    const ricorrenza = ricorrenze.value[indexRicorrenza];
    const spazio = ricorrenza.spazi[indexSpazio];

    if (!stato){
        spazio.servizi.splice(0,spazio.servizi.length);
        updatePrezzo();
        return;
    }

    const inizio = ricorrenza.inizio;
    const fine = ricorrenza.fine;

    const servizi = spazio.spazio.servizi
    
    Promise.all(servizi.map(servizio=>{
        return fetch(`${VITE_BACKEND}/servizio/disponibilita?id=${servizio._id}&inizio=${inizio}&fine=${fine}`)
        .then(res=>{
            return res.json();
        })
        .then(data=>{
            if (data.disponibilita)
                return servizio
            else 
                return false;
        })
        .catch(e=>{
            emit("errore","Error", e);
            return false;
        })
    }))
    .then(servizi=>{
        const serviziDisponibili = servizi.map(a=>a);

        spazio.servizi.push(... serviziDisponibili.map(servizio=>{return{
            servizio: servizio,
            selezionato: ref(false)
        }}));
    })
}
const updateSpazio = (indexRicorrenza, indexSpazio, event)=>{
    updateServizi(indexRicorrenza, indexSpazio, event.target.checked)
    updatePrezzo();
}
const reset=()=>{
    ricorrenze.value = [newRicorrenza()];
    prezzo.value=0;
}


const getOggettoRicorrenze = ()=>{
    const ret = [];
    for (let ricorrenza of ricorrenze.value){
        if (ricorrenza.inizio=="" || ricorrenza.fine=="")
            continue;

        const spaziPrenotati = ricorrenza.spazi.filter(spazio=>spazio.selezionato);
        const serviziPrenotati = [];
        for (let spazio of spaziPrenotati){
            serviziPrenotati.push(...spazio.servizi.filter(servizio=>servizio.selezionato).map(servizio=>servizio.servizio._id))
        }

        ret.push({
            inizio: new Date(ricorrenza.inizio).toISOString(),
            fine: new Date(ricorrenza.fine).toISOString(),
            spaziPrenotati: spaziPrenotati.map(spazio=>spazio.spazio._id),
            serviziPrenotati: serviziPrenotati
        })
    }
    return ret;
}
const submit = ()=>{
    const formData = JSON.stringify({
        proprietario: loggedUser.id,
        ricorrenze: getOggettoRicorrenze()
    })

    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    headers.append('x-access-token', loggedUser.token)

    fetch(`${VITE_BACKEND}/prenotazione/`,{
        method:"POST",
        headers:headers,
        body:formData
    })
    .then(res=>{
        if (res.ok)
            emit("successo","AAAAAAAAA","AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
        else
            emit("errore","AAAAAAAAA","AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
    })
}
</script>

<template>
    <p>Prezzo: €{{ prezzo }}</p>
    <form onsubmit="return false">
        <div v-for="(ricorrenza,i) of ricorrenze">
            <fieldset>
                <legend>Ricorrenza {{ i+1 }}</legend>

                <label :for="'inizio'+i">inizio</label>
                <input @change="getDisponibilità(i)" type="datetime-local" v-model="ricorrenza.inizio" :name="'inizio'+i">
                <br>
                
                <label :for="'fine'+i">fine</label>
                <input @change="getDisponibilità(i)" type="datetime-local" v-model="ricorrenza.fine" :name="'inizio'+i">
                <br>

                <p>spazi</p>
                <ul v-for="(spazio, j) of ricorrenza.spazi" v-bind:key="spazio._id">
                    <li>
                        <input @change="updateSpazio(i,j,$event)" type="checkbox" v-model="spazio.selezionato" :name="'spazio'+i+''+j">
                        <CardSpazio :spazio="spazio.spazio" :hideServizi="true"></CardSpazio>
                    </li>
                    <div v-if="spazio.servizi.length>0">
                        <li>Servizi</li>
                        <ul v-for="(servizio, k) of spazio.servizi" v-bind:key="servizio._id">
                            <li>
                                <input type="checkbox" @change="updatePrezzo" v-model="servizio.selezionato" :name="'servizio'+i+''+j+''+k">
                                <CardServizio :servizio="servizio.servizio"></CardServizio>
                            </li>
                        </ul>
                    </div>
                </ul>
                <br>

                <button @click="rimuoviRicorrenza(i)" type="button">rimuovi</button>
            </fieldset>
        </div>
        <button type="button" @click="aggiungiRicorrenza">aggiungi ricorrenza</button>
        <button type="submit" @click="submit">submit</button>
        <button type="reset" @click="reset">reset</button>
    </form>
</template>
