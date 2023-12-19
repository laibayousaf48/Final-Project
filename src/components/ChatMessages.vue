<template>
  <div class="q-pa-md">
    <q-page>
      <q-scroll-area style="max-height: 300px;">
        <q-chat v-if="connected" :messages="chatMessages" @send="sendMessage" />
      </q-scroll-area>
      <q-input v-model="messageInput" @keyup.enter="sendMessage" :disable="!connected" />
      <q-btn v-if="!connected" @click="connectToServer" label="Connect to Server" />
    </q-page>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Replace with your server URL
const messageInput = ref('');
const chatMessages = ref([]);
const connected = ref(false);

socket.on('connect', () => {
  console.log('Connected to the server');
  connected.value = true;
});

socket.on('message', (message) => {
  chatMessages.value.push({ text: message, side: 'received' });
});

socket.on('responseMessage', (response) => {
  console.log('Server response:', response);
  // Handle the server response as needed
  chatMessages.value.push({ text: response, side: 'received' });
});

socket.on('disconnect', () => {
  console.log('Disconnected from the server');
  connected.value = false;
});

const sendMessage = () => {
  const message = messageInput.value.trim();
  if (message) {
    chatMessages.value.push({ text: message, side: 'sent' });
    socket.emit('sendMessage', message);
    messageInput.value = '';
  }
};

const connectToServer = () => {
  socket.connect();
};

// Watch for changes in chatMessages and scroll to the bottom when new messages are added
watch(() => chatMessages.value, () => {
  scrollToBottom();
});

const scrollToBottom = () => {
  const scrollArea = document.querySelector('.q-scroll-area__content');
  if (scrollArea) {
    scrollArea.scrollTop = scrollArea.scrollHeight;
  }
};
</script>

<style scoped>
.q-page {
  max-width: 300px;
  margin: auto;
}
</style>
