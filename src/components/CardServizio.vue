<script setup>
const props = defineProps(["servizio"]);
const servizio = props.servizio;

const urlFoto = import.meta.env.VITE_BACKEND + servizio.URLfoto;
</script>

<template>
    <div class="rounded-corners-small card-servizio">
        <h4>{{ servizio.nome }}</h4>
        <div class="dynamic-flex">
            <div class="info-servizio">
                <ul>
                    <li>Tipologia: {{ servizio.tipologia }}</li>
                    <li>Prezzo iniziale: {{ servizio.prezzoIniziale }}€</li>
                    <li>Prezzo all'ora: {{ servizio.prezzoOra }}€/ora</li>
                </ul>
                <br />
                <p>{{ servizio.descrizione }}</p>
            </div>
            <div class="foto-servizio">
                <img :src="urlFoto" :alt="servizio.nome" class="rounded-corners-small" />
            </div>
        </div>
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
    align-items: center;
    justify-content: space-between;
}

.info-servizio {
    list-style-position: inside;
    padding: 10px 10px 0px 10px;
}

.info-servizio ul {
    width: fit-content;
}

.foto-servizio > img {
    max-width: 100px;
    max-height: 100px;

    margin: 20px 0px 0px 30px;
}
</style>