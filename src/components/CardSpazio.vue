<script setup>
import CardServizio from "./CardServizio.vue";

const props = defineProps(["spazio", "hideServizi"]);
const spazio = props.spazio;
const hideServizi = props.hideServizi || false;

const urlFoto = import.meta.env.VITE_BACKEND + spazio.URLfoto;
</script>

<template>
    <div class="rounded-corners card-spazio">
        <h3>{{ spazio.nome }}</h3>
        <div class="dynamic-flex">
            <div class="info-spazio">
                <p>{{ spazio.descrizione }}</p>
                <br />
                <ul>
                    <li>Tipologia: {{ spazio.tipologia }}</li>
                    <li>Prezzo iniziale: {{ spazio.prezzoIniziale }}€</li>
                    <li>Prezzo all'ora: {{ spazio.prezzoOra }}€/ora</li>
                </ul>
            </div>
            <img :src="urlFoto" :alt="spazio.nome" class="rounded-corners-small foto-spazio" />
        </div>

        <div v-if="spazio.servizi.length > 0 && !hideServizi" class="container-servizi">
            <h4>Questo spazio dispone dei seguenti servizi:</h4>
            <div>
                <div v-for="servizio in spazio.servizi" v-bind:key="servizio._id">
                    <CardServizio :servizio="servizio"></CardServizio>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card-spazio {
    background: rgba(255, 255, 255, 0.5);
    margin: 10px 30px 30px 30px;
}

.card-spazio .dynamic-flex {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
}

.info-spazio {
    list-style-position: inside;
    padding: 10px 10px 0px 10px;
}

.foto-spazio {
    height: 200px;
}

.container-servizi {
    margin-top: 20px;
}

.container-servizi > div {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: center;
}

.container-servizi > div > * {
    flex-grow: 1;
    width: 50%;
}
</style>