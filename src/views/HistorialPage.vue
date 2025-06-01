<template>
  <div class="background">
   <div class="history">
    <h2><u>Historial de Movimientos</u></h2>
    
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
              <button @click="confirmDelete(transaction)">Eliminar</button>
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
      <div class="modal-content edit-mode">
        <h3>Editar Transacción</h3>
        <form @submit.prevent="updateTransaction">
          <div>
            <label for="edit-crypto-amount">Cantidad</label>
            <input id="edit-crypto-amount" type="number" step="any" v-model="editCryptoAmount" required />
          </div>
          <div class="form-group">
            <label for="edit-action">Acción</label>
            <select id="edit-action" v-model="editAction" required>
              <option value="purchase">compra</option>
              <option value="sale">venta</option>
            </select>
          </div>
          <button class="update-btn" type="submit">Actualizar</button>
          <button @click="closeEdit">Cancelar</button>
        </form>
      </div>
    </div>
    <!-- Modal de confirmación para eliminar -->
    <div v-if="showDeleteConfirm" class="modal">
     <div class="modal-content edit-mode">
       <h3>Confirmar Eliminación</h3>
       <p>¿Estás seguro que deseas eliminar esta transacción?</p>
        <div>
          <button class="update-btn" @click="deleteTransactionConfirmed">Aceptar</button>
          <button @click="cancelDelete">Cancelar</button>
       </div>
      </div>
    </div>
    <div class="botones-container">
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
      transactions: [],          // Lista de transacciones del usuario
      showDetails: false,        // Flag para mostrar detalles
      showEdit: false,           // Flag para mostrar el modal de edición
      selectedTransaction: null, // Transacción seleccionada
      editCryptoAmount: '',
      editAction:'',
      editCryptoCode: '',
      showDeleteConfirm: false,      // Para mostrar el modal de confirmación
      transactionToDelete: null,     // Guarda la transacción que quieres eliminar            
    };
  },
   computed: {
    ...mapState(["userId"]), // 🔥 Esto conecta el estado global de Vuex
  },
  methods: {
    // Obtener el historial de transacciones
    async getTransactionHistory() {
      try {
        const response = await axios.get(`https://laboratorio3-5fc7.restdb.io/rest/transactions?q={"user_id":"${this.userId}"}`, {
          headers: {
            'x-apikey': '64bdbc3386d8c5613ded91e7', // Aquí va tu API Key
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
      this.editCryptoAmount = transaction.crypto_amount;
      this.editAction = transaction.action;
      this.editCryptoCode = transaction.crypto_code
      this.showEdit = true;
    },

    // Cerrar el modal de edición
    closeEdit() {
      this.showEdit = false;
      this.editCryptoAmount = '';
      this.editAction = '';
      this.editCryptoCode ='';
    },

    // Actualizar la transacción
    async updateTransaction() {
    try {
     // Determinar si es compra o venta
    const action = this.editAction;

    // Obtener el endpoint correcto según la acción
    const url = action === 'purchase'
      ? `https://criptoya.com/api/satoshitango/${this.editCryptoCode}/ars`
      : `https://criptoya.com/api/satoshitango/${this.editCryptoCode}/ars`;

    const response = await axios.get(url);
    const priceData = response.data;

    // Usar el precio de compra o de venta según corresponda
    const price = action === 'purchase'
      ? parseFloat(priceData.ask)
      : parseFloat(priceData.bid);

    const newAmount = parseFloat(this.editCryptoAmount);
    const newMoney = parseFloat((price * newAmount).toFixed(2));

    // Paso 5: Preparar los datos a actualizar
    const updatedData = {
      crypto_amount: newAmount,
      money: newMoney,
      crypto_code: this.editCryptoCode,
      action: action
    };

    // Paso 6: Hacer PATCH a la API para actualizar la transacción
    await axios.patch(
      `https://laboratorio3-5fc7.restdb.io/rest/transactions/${this.selectedTransaction._id}`,updatedData,{
        headers: {
          'x-apikey': '64bdbc3386d8c5613ded91e7'
        }
      }
    );

    // Paso 7: Actualizar el array local con los nuevos datos
    Object.assign(this.selectedTransaction, updatedData);
    // Paso 8: Cerrar el formulario de edición
    this.showEdit = false;

  } catch (error) {
    console.error('Error al actualizar la transacción:', error);
     if (error.response && error.response.data && error.response.data.list) {
    console.table(error.response.data.list);
  }
  }
 },
    confirmDelete(transaction) {
      this.transactionToDelete = transaction;
      this.showDeleteConfirm = true;
    },

    // Eliminar una transacción
    async deleteTransactionConfirmed() {
      try {
        await axios.delete(`https://laboratorio3-5fc7.restdb.io/rest/transactions/${this.transactionToDelete._id}`, {
          headers: {
            'x-apikey': '64bdbc3386d8c5613ded91e7',
          },
        });

        this.transactions = this.transactions.filter((t) => t._id !== this.transactionToDelete._id);
        this.transactionToDelete = null;
        this.showDeleteConfirm = false;
      } catch (error) {
        console.error('Error al eliminar la transacción', error);
      }
    },
     cancelDelete() {
      this.transactionToDelete = null;
      this.showDeleteConfirm = false;
    }
  },
  mounted() {
    // Cargar el historial de transacciones cuando el componente se monte
    this.getTransactionHistory();
  },
};
</script>

<style scoped>
.background {
  min-height: 100vh; /* Mínimo alto de la pantalla */
  padding: 4rem;
  display: flex;
  justify-content: center;  /* Centra horizontalmente */
  background: 
    linear-gradient(135deg, #000000, #30329e, #000000),
    url("https://www.transparenttextures.com/patterns/brushed-alum-dark.png");
  background-blend-mode: overlay;
  color: #000; /* Color del texto */
}

/* Estilos para el historial */
.history {
  max-width: 900px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.6); /* Fondo blanco con transparencia */
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #000; /* Borde negro sólido */
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2); /* sombra suave para mejorar contraste */
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th, table td {
  padding: 0.8rem;
  text-align: left;
  border: 1px solid #000; /* Bordes negros */
  background-color: rgba(255, 255, 255, 0.6); /* celda semitransparente */
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2); /* sombra suave para mejorar contraste */
}

button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 12px;
  background-color: #ffff;
  color: black;
  border: 2px solid black;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #8b8b8b;
  box-shadow: 0 0 12px 4px rgba(245, 234, 83, 0.6); /* efecto de brillo suave */
}

.botones-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 28px; 
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
/* SOLO para el modo editar */
.edit-mode label {
  color: #333;
  font-weight: 600;
}

.edit-mode input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #aaa;
  border-radius: 4px;
  color: #222;
  margin-bottom: 1rem;
}

.modal-content.edit-mode .update-btn{
  background-color: #4caf50;
}
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.form-group label {
  color: #333;
  font-weight: 600;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #aaa;
  border-radius: 4px;
  color: #222;
  margin-bottom: 1rem;
}
</style>