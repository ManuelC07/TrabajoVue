<template>
  <template>
  <div class="login-container">
    <h2>Iniciar Sesión</h2>
    <input v-model="userId" type="text" placeholder="Ingrese su ID" />
    <button @click="login">Ingresar</button>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      userId: ""
    };
  },
  methods: {
    ...mapMutations(["setUserId"]), // Llamar a la mutación de Vuex
    login() {
      if (this.userId.trim()) {
        this.setUserId(this.userId);
        this.$router.push("/home"); // Redirigir a la página principal
      } else {
        alert("Ingrese un ID válido");
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
