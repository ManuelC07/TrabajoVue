<template>
  <div class="login-container">
    <div class="login-box">
      <h2><u>Iniciar Sesión</u></h2>
      <input v-model="userId" type="text" placeholder="Ingrese su ID" />
      <button @click="login">Ingresar</button>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "LoginPage", // Nombre del componente corregido
  data() {
    return {
      userId: ""
    };
  },
  methods: {
    ...mapMutations(["setUserId"]),
    login() {
      if (this.userId.trim()) {
        this.setUserId(this.userId);
        this.$router.push("/about");
      } else {
        alert("Ingrese un ID válido");
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh; /* Mínimo alto de la pantalla */
  display: flex;
  justify-content: center; /* Centrado horizontal */
  align-items: center; /* Centrado vertical */
  background: 
    linear-gradient(135deg,#000000, #4aaab1e5, #000000),
    url("https://www.transparenttextures.com/patterns/xv.png");
  background-blend-mode: overlay;
  color: rgb(0, 0, 0);
}

.login-box {
  padding: 50px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.6); /* Fondo semitransparente */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  width: 300px;
  text-align: center;
  border: 2px solid #ffffff;
}

h2 {
  margin-bottom: 20px;
  font-family: Arial, sans-serif;
  font-size: 20px;
  color: #ffffff;
}

input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: none;
  border-radius: 4px;
  font-size: 16px;
}

button {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  border: 2px solid white;
  background-color: transparent; /* Botón transparente */
  color: white;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

button:hover {
  background-color: white;
  color: black;
}
</style>
