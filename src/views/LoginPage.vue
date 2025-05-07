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
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; 
  background: 
    linear-gradient(135deg,#000000, #58c095, #000000),
    url('https://www.transparenttextures.com/patterns/cartographer.png');
  background-blend-mode: overlay;
  color: white;
}

.login-box {
  padding: 50px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
  border: 2px solid #000000; 
}

h2 {
  margin-bottom: 20px;
  font-family: Arial, sans-serif;
  font-size: 20px;
  color: #000000;
}

input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px;
  border-radius: 4px;
  font-size: 16px;
}

button {
  width: 50%;
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  border: 2px solid black;
  cursor: pointer;
  align-items: center;
  background: 
    linear-gradient(135deg,#000000, #58c095, #000000),
    url('https://www.transparenttextures.com/patterns/cartographer.png');
  background-blend-mode: overlay;
  color: rgb(0, 0, 0);
}
</style>

