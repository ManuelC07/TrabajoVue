<template>
  <div class="finances">
    <h2>Análisis del Estado Actual de Mis Finanzas</h2>
    
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
            <td>{{ crypto.amount.toFixed(4) }}</td>
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
        const response = await axios.get(`https://criptoya.com/api/satoshitango/${cryptoCode}/ars/`);
        const price = response.data.ask; // Obtener el precio de venta (ask)

        // Calcular el valor en pesos
        const valueInPesos = price * cryptoAmount;

        // Almacenar la información de la criptomoneda
        this.cryptos.push({
          crypto_code: cryptoCode,
          amount: cryptoAmount,
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
/* Estilos para la página de análisis de finanzas */
.finances {
  max-width: 900px;
  margin: 0 auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th, table td {
  padding: 0.8rem;
  text-align: left;
  border: 1px solid #ddd;
}

table th {
  background-color: #f2f2f2;
}

strong {
  font-weight: bold;
}
</style>