<template>
  <div class="home">
    <h4>Usuario: {{ getUserId }}</h4>
    <h1><u>Bienvenido a CriptoApp</u></h1>
    <div class="botones">
      <button @click="$router.push('/comprar')">Comprar</button>
      <button @click="$router.push('/vender')">Vender</button>
      <button @click="$router.push('/historial')">Historial</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: 'HomeView',
  computed: {
    ...mapGetters(['getUserId'])  // Accedemos al getter getUserId desde Vuex
  }
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  min-height: 100vh;
  background: 
    linear-gradient(135deg,#000000, #58c095, #000000),
    url('https://www.transparenttextures.com/patterns/light-wool.png');
  background-blend-mode: overlay;
  color: rgb(0, 0, 0);
}

.botones {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

button {
  width: 150px;
  height: 50px;
  background-color: #000000;
  color: #47e747;
  font-size: 18px;
  border: 2px solid #47e747;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #1a1a1a;
}
</style>
