<template>
  <div class="background">
  <div class="investment-analysis">
    <h2><u>Análisis de Inversiones</u></h2>

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
        const response = await axios.get(`https://laboratorio3-5fc7.restdb.io/rest/transactions?q={"user_id":"${this.userId}"}`, {
          headers: {
            'x-apikey': '64bdbc3386d8c5613ded91e7', // Reemplazar con tu API Key
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
        const response = await axios.get(`https://criptoya.com/api/satoshitango/${cryptoCode}/ars`);
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
.background {
  min-height: 100vh; /* Altura mínima igual al alto de la ventana */
  padding: 4rem;
  display: flex;
  justify-content: center;
  background: 
    linear-gradient(135deg, #000000, #c48a3e, #000000),
    url("https://www.transparenttextures.com/patterns/gplay.png");
  background-blend-mode: overlay;
  color: #000;
}
/* Estilos para la página de análisis de inversiones */
.investment-analysis {
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