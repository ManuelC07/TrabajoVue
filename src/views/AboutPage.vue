<template>
  <div class="home">
    <!-- Encabezado -->
    <header class="header">
      <div class="user-info">Usuario: {{ getUserId }}</div>
      <div class="title"><u>Bienvenido a CriptoApp</u></div>
      <button class="salir-button" @click="$router.push('/')">Cerrar Sesion</button>
    </header>

    <!-- Botones verticales -->
    <div class="botones">
      <button @click="$router.push('/comprar')">Comprar</button>
      <button @click="$router.push('/vender')">Vender</button>
      <button @click="$router.push('/historial')">Historial</button>
      <button @click="$router.push('/finanzas')">Mis Finanzas</button>
      <button @click="$router.push('/inversion')">Analisis Inversion</button>
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
  background: linear-gradient(135deg, #000000, #1fa099f3, #000000),
              url('https://www.transparenttextures.com/patterns/light-wool.png');
  background-blend-mode: overlay;
  color: white;
}

/* Header */
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px;
  box-sizing: border-box;
}

.title {
  font-size: 26px;
  text-align: center;
  flex-grow: 2;
}

/* Botones verticales */
.botones {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 50px;
}

button {
  width: 200px;
  height: 50px;
  background-color: #ffffff;
  color: #000000;
  font-size: 18px;
  border: 2px solid #000000;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #8b8b8b;
}

/* Botón de salir específico */
.salir-button {
  padding: 12px 16px;
  font-size: 18px;
  height: auto;
  width: auto;
  background-color: white;
  color: black;
  border: 2px solid black;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.salir-button:hover {
  background-color: #8b8b8b;
}

.user-info {
  font-size: 20px; /* Más grande */
  font-weight: 300;
}
</style>
