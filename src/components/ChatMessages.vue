<template>
  <div class="q-pa-md">
    <q-page>
      <q-scroll-area style="max-height: 300px;">
        <q-chat :messages="chatMessages" @send="sendMessage" />
      </q-scroll-area>
      
      <q-icon @click="toggleChatBox" name="chat" size="3em" color="green" class="msg"></q-icon>

      <!-- Chat Box Component -->
      <div v-if="showChatBox" class="chat-box">
        <div class="header">
          <q-icon @click="toggleChatBox" name="close" size="1em" color="black" />
        </div>
        <q-scroll-area style="max-height: 200px;">
          <q-chat :messages="chatMessages" />
        </q-scroll-area>
        <q-input v-model="messageInput" @keyup.enter="sendMessage" placeholder="Type your message..." class="input"/>
      </div>
    </q-page>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import io from 'socket.io-client';
import { useStore } from '@/Store/users'
const store = useStore()
const messageInput = ref('');
const chatMessages = ref([]);
const connected = ref(false);
const showChatBox = ref(false);
const socketOptions = {
  transports: ["websocket"],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 3,
  timeout: 5000,
};
const socket = io(process.env.VUE_APP_BASE_URL, socketOptions); 

socket.on('chat message', (message) => {
  console.log("Recevied from bot: ",message )
  chatMessages.value.push({ text: message, side: 'received' });
});

// socket.on('responseMessage', (response) => {
//   console.log('Server response:', response);
//   // Handle the server response as needed
//   chatMessages.value.push({ text: response, side: 'received' });
// });

// socket.on('disconnect', () => {
//   console.log('Disconnected from the server');
//   connected.value = false;
// });

const sendMessage = () => {
  console.log("Message:", messageInput?.value)
  const message = messageInput.value.trim();
  if (message) {
    chatMessages.value.push({ text: message, side: 'sent' });
    socket.emit('chat message', message);
    
    messageInput.value = '';
    console.log("message sent");
  }
};

const connectToServer = () => {
  socket.connect();
};


watch(() => chatMessages.value, () => {
  scrollToBottom();
});

const scrollToBottom = () => {
  const scrollArea = document.querySelector('.q-scroll-area__content');
  if (scrollArea) {
    scrollArea.scrollTop = scrollArea.scrollHeight;
  }
};

const toggleChatBox = () => {
  showChatBox.value = !showChatBox.value;
};
</script>

<style scoped>
.q-page {
  max-width: 300px;
  margin: auto;
}
/* .msg{

    position: fixed;
    bottom: 10px; 
    right: 10px; 
    color: #ffffff; 
    padding: 10px; 
    border-radius: 5px; 
  } */
.msg {
  position: fixed;
  bottom: 10px; 
  right: 10px; 
  color: #ffffff; 
  padding: 10px; 
  border-radius: 5px; 
  z-index: 1;
}


.header{
  background-color: white;
  position: fixed;
    bottom: 170px; 
    right: 70px;
}
.chat-box{
  position: fixed;
    bottom: 40px; 
    right: 60px;

}
.input{
  right: 90px !important;
  
}
</style>
