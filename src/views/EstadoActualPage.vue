<template>
  <div class="background">
  <div class="finances">
    <h2><u>Análisis del Estado Actual de Mis Finanzas</u></h2>
    
    <!-- Si hay datos, los mostramos en una tabla -->
    <div v-if="cryptos.length > 0">
      <table>
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Cantidad</th>
            <th>Dinero (ARS)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="crypto in cryptos" :key="crypto.crypto_code">
            <td>{{ crypto.crypto_code }}</td>
            <td>{{ formatAmount(crypto.amount) }}</td>
            <td>${{ crypto.valueInPesos.toFixed(2) }}</td>
          </tr>
          <tr>
            <td><strong>Total</strong></td>
            <td></td>
            <td><strong>${{ totalAmount.toFixed(2) }}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>No tienes criptomonedas registradas o tienes saldo cero.</p>
    </div>
     <div>
      <button @click="$router.push('/about')">Volver</button>
     </div>
  </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from "vuex";

export default {
  data() {
    return {
      transactions: [], // Transacciones del usuario
      cryptos: [], // Información de criptomonedas con su saldo y valor
      totalAmount: 0, // Total de dinero en ARS
    };
  },
  computed: {
    ...mapState(["userId"]), // 🔥 Esto conecta el estado global de Vuex
  },
  methods: {
    formatAmount(amount) {
      return parseFloat(amount.toFixed(8)).toString();
    },
    // Método para obtener todas las transacciones del usuario
    async getTransactionHistory() {
      try {
        const response = await axios.get(`https://laboratorio3-5fc7.restdb.io/rest/transactions?q={"user_id":"${this.userId}"}`, {
          headers: {
            'x-apikey': '64bdbc3386d8c5613ded91e7', // Reemplazar con tu API Key
          },
        });
        this.transactions = response.data;
        this.calculateBalances();
      } catch (error) {
        console.error('Error al obtener el historial de transacciones', error);
      }
    },

    // Método para calcular el saldo de cada criptomoneda
    calculateBalances() {
      const cryptoBalances = {};

      // Calcular el saldo neto para cada criptomoneda
      this.transactions.forEach(transaction => {
        if (!cryptoBalances[transaction.crypto_code]) {
          cryptoBalances[transaction.crypto_code] = 0;
        }

        // Si es una compra, sumamos la cantidad
        if (transaction.action === 'purchase') {
          cryptoBalances[transaction.crypto_code] += parseFloat(transaction.crypto_amount);
        }
        // Si es una venta, restamos la cantidad
        if (transaction.action === 'sale') {
          cryptoBalances[transaction.crypto_code] -= parseFloat(transaction.crypto_amount);
        }
      });

      // Filtrar las criptomonedas que tienen saldo positivo
      for (let cryptoCode in cryptoBalances) {
        if (cryptoBalances[cryptoCode] > 0) {
          this.fetchCryptoPrice(cryptoCode, cryptoBalances[cryptoCode]);
        }
      }
    },

    // Obtener el precio de cada criptomoneda desde la API de Criptoya
    async fetchCryptoPrice(cryptoCode, cryptoAmount) {
      try {
        // Realizar la solicitud para obtener el precio de la criptomoneda en ARS
        const response = await axios.get(`https://criptoya.com/api/satoshitango/${cryptoCode}/ars`);
        const price = response.data.ask; // Obtener el precio de venta (ask)

        // Calcular el valor en pesos
        const valueInPesos = price * cryptoAmount;

        // Almacenar la información de la criptomoneda
        this.cryptos.push({
          crypto_code: cryptoCode,
          amount:parseFloat(cryptoAmount.toFixed(8)),
          valueInPesos,
        });

        // Actualizar el total de dinero
        this.totalAmount += valueInPesos;
      } catch (error) {
        console.error(`Error al obtener el precio de ${cryptoCode}`, error);
      }
    },
  },
  mounted() {
    // Cargar el historial de transacciones cuando el componente se monte
    this.getTransactionHistory();
  },
};
</script>

<style scoped>
.background {
  min-height: 100vh; /* Altura mínima igual al alto de la ventana */
  padding: 4rem;
  display: flex;
  justify-content: center;
  background: 
    linear-gradient(135deg, #000000, #a045a8, #000000),
    url("https://www.transparenttextures.com/patterns/diamond-upholstery.png");
  background-blend-mode: overlay;
  color: #000;
}

/* Estilos para la página de análisis de finanzas */
.finances {
  max-width: 900px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.6); /* Fondo blanco con transparencia */
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #000; /* Borde negro sólido */
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2); /* Sombra suave para mejorar el contraste */
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px; /* Ajuste opcional para separar la tabla del borde superior */
  table-layout: fixed;
}

table th, table td {
  width: 33.33%;
  min-width: 120px;
  word-wrap: break-word;
  padding: 0.8rem;
  text-align: left;
  border: 1px solid #ddd; /* Bordes grises */
  background-color: rgba(255, 255, 255, 0.6); /* Celda semitransparente */
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2); /* Sombra suave para mejorar el contraste */
}

button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 12px;
  background-color: #ffff; /* Fondo blanco */
  color: black;
  border: 2px solid black;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 20px; /* Ajuste opcional para separar el botón de la tabla */
}

button:hover {
  background-color: #8b8b8b; /* Cambio de color al pasar el mouse */
  box-shadow: 0 0 12px 4px rgba(245, 234, 83, 0.6); /* efecto de brillo suave */
}

strong {
  font-weight: bold;
}
</style>