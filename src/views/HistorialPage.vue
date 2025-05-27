<template>
  <div class="history">
    <h2>Historial de Movimientos</h2>
    
    <!-- Mostrar historial si hay movimientos -->
    <div v-if="transactions.length > 0">
      <table>
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Cantidad</th>
            <th>Dinero (en Pesos)</th>
            <th>Acción</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in transactions" :key="transaction._id">
            <td>{{ transaction.crypto_code }}</td>
            <td>{{ transaction.crypto_amount }}</td>
            <td>{{ transaction.money }}</td>
            <td>{{ transaction.action === 'purchase' ? 'Compra' : 'Venta' }}</td>
            <td>{{ formatDate(transaction.datetime) }}</td>
            <td>
              <button @click="viewTransaction(transaction)">Ver</button>
              <button @click="editTransaction(transaction)">Editar</button>
              <button @click="deleteTransaction(transaction)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>No hay movimientos registrados.</p>
    </div>

    <!-- Modal para mostrar detalles de la transacción -->
    <div v-if="showDetails" class="modal">
      <div class="modal-content">
        <h3>Detalles de la Transacción</h3>
        <p><strong>Criptomoneda:</strong> {{ selectedTransaction.crypto_code }}</p>
        <p><strong>Cantidad:</strong> {{ selectedTransaction.crypto_amount }}</p>
        <p><strong>Monto pagado:</strong> {{ selectedTransaction.money }}</p>
        <p><strong>Acción:</strong> {{ selectedTransaction.action === 'purchase' ? 'Compra' : 'Venta' }}</p>
        <p><strong>Fecha:</strong> {{ formatDate(selectedTransaction.datetime) }}</p>
        <button @click="closeDetails">Cerrar</button>
      </div>
    </div>

    <!-- Modal de edición de transacción -->
    <div v-if="showEdit" class="modal">
      <div class="modal-content">
        <h3>Editar Transacción</h3>
        <form @submit.prevent="updateTransaction">
          <div>
            <label for="edit-money">Monto (en Pesos)</label>
            <input type="number" v-model="editMoney" required />
          </div>
          <button type="submit">Actualizar</button>
          <button @click="closeEdit">Cancelar</button>
        </form>
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
      transactions: [],          // Lista de transacciones del usuario
      showDetails: false,        // Flag para mostrar detalles
      showEdit: false,           // Flag para mostrar el modal de edición
      selectedTransaction: null, // Transacción seleccionada
      editMoney: '',             // Nuevo monto para editar
    };
  },
   computed: {
    ...mapState(["userId"]), // 🔥 Esto conecta el estado global de Vuex
  },
  methods: {
    // Obtener el historial de transacciones
    async getTransactionHistory() {
      try {
        const response = await axios.get(`https://laboratorio-afe2.restdb.io/rest/transactions?q={"user_id":"${this.userId}"}`, {
          headers: {
            'x-apikey': '650b53356888544ec60c00bf', // Aquí va tu API Key
          },
        });
        this.transactions = response.data;
      } catch (error) {
        console.error('Error al obtener el historial de transacciones', error);
      }
    },

    // Formatear la fecha al formato "DD-MM-YYYY hh:mm"
    formatDate(datetime) {
      const date = new Date(datetime);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    },

    // Mostrar los detalles de una transacción
    viewTransaction(transaction) {
      this.selectedTransaction = transaction;
      this.showDetails = true;
    },

    // Cerrar el modal de detalles
    closeDetails() {
      this.showDetails = false;
    },

    // Mostrar el modal de edición con los valores actuales
    editTransaction(transaction) {
      this.selectedTransaction = transaction;
      this.editMoney = transaction.money;
      this.showEdit = true;
    },

    // Cerrar el modal de edición
    closeEdit() {
      this.showEdit = false;
    },

    // Actualizar la transacción
    async updateTransaction() {
      const updatedData = {
        money: this.editMoney,
      };

      try {
        await axios.patch(`https://laboratorio-afe2.restdb.io/rest/transactions/${this.selectedTransaction._id}`, updatedData, {
          headers: {
            'x-apikey': '650b53356888544ec60c00bf', // Aquí va tu API Key
          },
        });

        // Actualizar la transacción en el array local
        this.selectedTransaction.money = this.editMoney;
        this.showEdit = false;
      } catch (error) {
        console.error('Error al actualizar la transacción', error);
      }
    },

    // Eliminar una transacción
    async deleteTransaction(transaction) {
      if (confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
        try {
          await axios.delete(`https://laboratorio-afe2.restdb.io/rest/transactions/${transaction._id}`, {
            headers: {
              'x-apikey': '650b53356888544ec60c00bf',
            },
          });

          // Eliminar la transacción de la lista local
          this.transactions = this.transactions.filter((t) => t._id !== transaction._id);
        } catch (error) {
          console.error('Error al eliminar la transacción', error);
        }
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
/* Estilos para el historial */
.history {
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

button {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

/* Modal de detalles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 5px;
  width: 400px;
}

.modal-content button {
  background-color: #f44336;
}
</style>