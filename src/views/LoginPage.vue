<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Iniciar Sesión</h2>
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
  height: 100vh;
  background: linear-gradient(#f3f3f3 10%,#77d6ce) ;
}

.login-box {
  background: linear-gradient(#f3f3f3 10%,#77d6ce) ;
  padding: 50px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
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
  background: linear-gradient(#f3f3f3 5%,#77d6ce) ;
  color: black;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid whitesmoke;
  cursor: pointer;
  align-items: center;
}
</style>

