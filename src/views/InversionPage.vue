<template>
  <div class="investment-analysis">
    <h2>Análisis de Inversiones</h2>

    <!-- Si hay datos, los mostramos en una tabla -->
    <div v-if="investmentResults.length > 0">
      <table>
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Resultado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="result in investmentResults" :key="result.crypto_code">
            <td>{{ result.crypto_code }}</td>
            <td :class="{'positive': result.result > 0, 'negative': result.result < 0}">
              {{ result.result > 0 ? `+ $${result.result.toFixed(2)}` : `- $${Math.abs(result.result).toFixed(2)}` }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>No tienes transacciones o las ganancias/pérdidas no están registradas.</p>
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
      investmentResults: [], // Resultados de las inversiones (ganancia o pérdida)
    };
  },
  computed: {
    ...mapState(["userId"]), // 🔥 Esto conecta el estado global de Vuex
  },
  methods: {
    // Método para obtener todas las transacciones del usuario
    async getTransactionHistory() {
      try {
        const response = await axios.get(`https://laboratorio-afe2.restdb.io/rest/transactions?q={"user_id":"${this.userId}"}`, {
          headers: {
            'x-apikey': '650b53356888544ec60c00bf', // Reemplazar con tu API Key
          },
        });
        this.transactions = response.data;
        this.calculateInvestments();
      } catch (error) {
        console.error('Error al obtener el historial de transacciones', error);
      }
    },

    // Método para calcular las ganancias o pérdidas por criptomoneda
    calculateInvestments() {
      const investments = {}; // Almacenará las ganancias y pérdidas por criptomoneda

      // Agrupar las transacciones por criptomoneda
      this.transactions.forEach(transaction => {
        if (!investments[transaction.crypto_code]) {
          investments[transaction.crypto_code] = {
            purchasedAmount: 0,
            purchasedMoney: 0,
            soldAmount: 0,
            soldMoney: 0,
          };
        }

        // Si es una compra, sumamos la cantidad y el dinero gastado
        if (transaction.action === 'purchase') {
          investments[transaction.crypto_code].purchasedAmount += parseFloat(transaction.crypto_amount);
          investments[transaction.crypto_code].purchasedMoney += parseFloat(transaction.money);
        }
        // Si es una venta, sumamos la cantidad y el dinero ganado
        if (transaction.action === 'sale') {
          investments[transaction.crypto_code].soldAmount += parseFloat(transaction.crypto_amount);
          investments[transaction.crypto_code].soldMoney += parseFloat(transaction.money);
        }
      });

      // Para cada criptomoneda, calculamos el resultado
      for (let cryptoCode in investments) {
        // Si la criptomoneda tiene tanto compras como ventas
        if (investments[cryptoCode].purchasedAmount > 0) {
          // Consultamos el precio actual del mercado
          this.fetchCryptoPrice(cryptoCode, investments[cryptoCode]);
        }
      }
    },

    // Método para obtener el precio actual de la criptomoneda desde la API de Criptoya
    async fetchCryptoPrice(cryptoCode, investmentData) {
      try {
        const response = await axios.get(`https://criptoya.com/api/satoshitango/${cryptoCode}/ars/`);
        const currentPrice = response.data.ask; // Obtener el precio de venta (ask)

        // Calcular el valor actual de las criptomonedas compradas
        const currentValue = currentPrice * investmentData.purchasedAmount;

        // Calcular la ganancia o pérdida: 
        const result = currentValue - investmentData.purchasedMoney;

        // Almacenamos el resultado en el arreglo de resultados de inversión
        this.investmentResults.push({
          crypto_code: cryptoCode,
          result: result,
        });
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
/* Estilos para la página de análisis de inversiones */
.investment-analysis {
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

.positive {
  color: green;
}

.negative {
  color: red;
}

strong {
  font-weight: bold;
}
</style>