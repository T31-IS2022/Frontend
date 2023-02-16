<script setup>
import { ref } from 'vue';
import CardSpazio from './CardSpazio.vue';
const emit = defineEmits(["errore", "info", "successo"]);

const prezzo = ref(0)
const newRicorrenza = ()=>{
    return {
        inizio: ref(""),
        fine: ref(""),
        spazi: ref([]),
        servizi: ref([]),
        spaziDisponibili: ref([]),
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
        ricorrenza.spaziDisponibili = spaziDisponibili
    })
}


const updatePrezzo = ()=>{

}
const updateServizi = ()=>{
    
}
const updateSpazi = (index)=>{
    updateServizi();
    updatePrezzo();
}
</script>

<template>
    <p>Prezzo: €{{ prezzo }}</p>
    <form>
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
                <ul v-for="(spazio, j) of ricorrenza.spaziDisponibili">
                    <li>
                        <input @change="updateSpazi(i)" type="checkbox" :name="'spazio'+i+''+j">                        
                        <CardSpazio :spazio="spazio" :hideServizi="true"></CardSpazio>
                    </li>
                </ul>
                <br>

                <p>servizi</p>
                <ul v-for="(spazio, j) of ricorrenza.spaziDisponibili">
                    <li>
                        <input @change="updatePrice(i)" type="checkbox" :name="'spazio'+i+''+j">                        
                        <CardSpazio :spazio="spazio" :hideServizi="true"></CardSpazio>
                    </li>
                </ul>
                <br>

                <button @click="rimuoviRicorrenza(i)" type="button">rimuovi</button>
            </fieldset>
        </div>
        <button type="button" @click="aggiungiRicorrenza">aggiungi ricorrenza</button>
    </form>
</template>
