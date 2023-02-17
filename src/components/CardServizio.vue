<script setup>
const props = defineProps(["servizio"]);
const servizio = props.servizio;

const urlFoto = import.meta.env.VITE_BACKEND + servizio.URLfoto;
</script>

<template>
    <div class="rounded-corners-small card-servizio">
        <div class="dynamic-flex">
            <div class="info-servizio">
                <h4>{{ servizio.nome }}</h4>
                <ul>
                    <li>Tipologia: {{ servizio.tipologia }}</li>
                    <li>Prezzo iniziale: {{ servizio.prezzoIniziale }}€</li>
                    <li>Prezzo all'ora: {{ servizio.prezzoOra }}€/ora</li>
                </ul>
            </div>
            <div class="foto-servizio">
                <img :src="urlFoto" :alt="servizio.nome" class="rounded-corners-small" />
            </div>
        </div>

        <p class="descrizione-servizio" v-if="servizio.descrizione">{{ servizio.descrizione }}</p>
    </div>
</template>

<style scoped>
.card-servizio {
    background: rgba(255, 255, 255, 0.5);
    margin: 10px 10px 10px 10px;
    padding: 20px;
}

.card-servizio .dynamic-flex {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
}

.info-servizio {
    list-style-position: inside;
}

.info-servizio h4 {
    margin-bottom: 10px;
}

.info-servizio ul {
    width: fit-content;
    padding: 0px 20px;
    margin-bottom: 10px;
}

.foto-servizio > img {
    max-width: 100px;
    max-height: 100px;

    margin: 0px 0px 0px 30px;
}

.descrizione-servizio {
    margin: 10px 0px 0px 20px;
}
</style>