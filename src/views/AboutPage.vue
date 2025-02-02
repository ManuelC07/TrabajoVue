<template>
  <div class="about-container">
    <h2>Página Principal</h2>
    <p>Bienvenido, tu ID es: {{ getUserId }}</p>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AboutPage", // Nombre del componente corregido
  computed: {
    ...mapGetters(["getUserId"])
  }
};
</script>

