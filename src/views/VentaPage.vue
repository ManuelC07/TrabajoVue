<template>
    <div class="sale-form">
      <h2>Venta de Criptomoneda</h2>
      <form @submit.prevent="submitForm">
        <!-- Criptomoneda -->
        <div>
         <label for="crypto"><u>Criptomoneda</u></label>
           <div class="crypto-options">
             <label class="crypto-option" :class="{ 'selected': cryptoCode === 'bitcoin' }">
               <input type="radio" v-model="cryptoCode" name="crypto" value="bitcoin" required>
               <img src="/img/icons/bitcoin2.png"/>
               Bitcoin
              </label>
              <label class="crypto-option" :class="{ 'selected': cryptoCode === 'ethereum' }">
                <input type="radio" v-model="cryptoCode" name="crypto" value="ethereum" required>
                <img src="/img/icons/ethereum.png"/>
                 Ethereum
              </label>
               <label class="crypto-option" :class="{ 'selected': cryptoCode === 'usdc' }">
                 <input type="radio" v-model="cryptoCode" name="crypto" value="usdc" required>
                 <img src="/img/icons/Usdc3.png"/>
                 USDC
               </label>
            </div>
        </div>
  
        <!-- Cantidad -->
        <div class="amount-container">
          <label for="amount"><u>Cantidad a Vender</u></label>
          <input type="number" v-model="cryptoAmount" step="any" min="0.00000001" required placeholder="Ej: 0.00070" />
        </div>
  
        <!-- Monto cobrado -->
        <div class="amount-container">
          <label for="money"><u>Monto a Cobrar</u></label>
          <input type="number" v-model="money" min="0" required placeholder="Ej: 170.98" />
        </div>
  
        <!-- Fecha y hora -->
        <div class="amount-container">
          <label for="datetime"><u>Fecha y hora</u></label>
          <input type="datetime-local" v-model="datetime" required />
        </div>
  
        <!-- Botón de enviar -->
        <div class="botones-container">
          <button type="submit">Registrar venta</button>
          <button @click="$router.push('/about')" class="volver-button">Volver</button>
        </div>
      </form>
  
      <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
      <p v-if="successMessage" style="color: green;">{{ successMessage }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        cryptoCode: '',        // Código de la criptomoneda
        cryptoAmount: '',      // Cantidad de criptomonedas vendidas
        money: '',             // Dinero recibido (en pesos)
        datetime: '',          // Fecha y hora de la venta
        userId: 'valor_introducido_login', // Este valor debe ser el que proviene del login
        errorMessage: '',      // Mensaje de error
        successMessage: '',    // Mensaje de éxito
      };
    },
    methods: {
      // Validar el formulario antes de enviarlo
      validateForm() {
        if (!this.cryptoCode || !this.cryptoAmount || !this.money || !this.datetime) {
          return false;
        }
  
        // Validar que la cantidad de criptomonedas y el dinero sean mayores a 0
        if (this.cryptoAmount <= 0 || this.money <= 0) {
          return false;
        }
  
        // Validar que la fecha sea válida (no futura)
        const currentDate = new Date();
        const inputDate = new Date(this.datetime);
        if (inputDate > currentDate) {
          return false;
        }
  
        return true;
      },
  
      // Enviar los datos al servidor
      async submitForm() {
        if (!this.validateForm()) {
          this.errorMessage = 'Por favor, revisa los datos ingresados.';
          return;
        }
  
        const transaction = {
          user_id: this.userId,
          action: 'sale', // Cambia a "sale" porque es una venta
          crypto_code: this.cryptoCode,
          crypto_amount: this.cryptoAmount,
          money: this.money,
          datetime: this.datetime,
        };
  
        try {
          await axios.post('https://laboratorio3-f36a.restdb.io/rest/transactions', transaction, {
            headers: {
              'x-apikey': 'tu_api_key', // Aquí va tu API Key
            },
          });
  
          this.successMessage = 'Venta registrada con éxito';
          this.errorMessage = '';  // Limpiar cualquier mensaje de error previo
          this.resetForm();  // Opcional: limpiar el formulario después de éxito
        } catch (error) {
          this.errorMessage = 'Error al registrar la venta. Intenta de nuevo.';
          this.successMessage = '';  // Limpiar cualquier mensaje de éxito previo
        }
      },
  
      // Limpiar el formulario
      resetForm() {
        this.cryptoCode = '';
        this.cryptoAmount = '';
        this.money = '';
        this.datetime = '';
      },
    },
  };
  </script>
  
  <style scoped>
  /* Estilos para el formulario */
  .purchase-form {
    max-width: 400px;
    margin: 0 auto;
  }
  
  form div {
    margin-bottom: 10px;
  }
  
  input, select {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.5rem;
  }
  
  .botones-container {
   display: flex;
   flex-direction: column;
   align-items: center;
   gap: 20px; /* separación entre los botones */
   margin-top: 10px;
  }

  button {
    padding: 12px 24px; /* más grande */
    font-size: 16px;     /* texto más grande */
    border-radius: 12px; /* más redondeado */
    border: 2px solid black;
    background-color: #4CAF50;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 28px;
  }
  button:hover {
    background-color: #4CAF50;
  }
  
  p {
    text-align: center;
    font-weight: bold;
  }
  
  .crypto-options {
    display: flex;
    justify-content: center;  /* Centra horizontalmente */
    align-items: center;      /* Centra verticalmente si fuera necesario */
    gap: 10px;
    margin-top: 10px;
  }
  .crypto-option {
    border: 1px solid transparent;
    padding: 8px 16px;
    cursor: pointer;
    border-radius: 5px;
    transition: border-color 0.2s;
  }
  .crypto-option.selected {
    border-color: black;
  }
  /* Oculta el input radio */
  .crypto-option input[type="radio"] {
    display: none;
  }
  
  /* Estilo para las imágenes */
  .crypto-option img {
    width: 1.2em;         /* Mismo tamaño que el texto */
    height: 1.2em;
    border-radius: 50%; /* Redondear la imagen */
    object-fit: cover;
  }
  
  .amount-container {
    width: 300px; /* o el tamaño que prefieras */
    margin: 0 auto; /* centrado horizontal */
    text-align: center; /* centra el texto dentro del div */
  }
  .amount-container input {
    width: 100%;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #ccc;
  }
  </style>