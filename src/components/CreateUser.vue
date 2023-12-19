<template>

<div>
  <q-btn :ripple="{ center: true }" color="secondary" label="Add New User" no-caps @click="openModal"/>
</div>
      <div v-if="isModalOpen" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeModal">&times;</span>
          <div>
            <h4>Add New User</h4>
            <hr />
          <q-form
      @submit.prevent="setUser"
      @reset="onReset"
      class="q-gutter-md"
    >
      <q-input
        filled
        v-model="firstName"
        label="First Name *"
        hint="Name" 
         :rules="[val => !!val || 'This field is required']" 
      />
      <q-input
        filled
        v-model="lastName"
        label="Last Name *"
        hint="Surname" 
         :rules="[val => !!val || 'This field is required']" 
      />
      <q-input
        filled
        v-model="email"
        label="Your Email*"
        hint="Email"
        :rules="[
        val => !!val || 'This field is required',
        val => /.+@.+/.test(val) || 'Enter a valid email address',
      ]"
      />
      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
          </div>
        </div>
      </div>
</template>

<script setup>
import { useStore } from "@/Store/users";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useStore();
var isModalOpen = ref(false);
 const accept = ref(false)
const firstName = ref("");
const lastName = ref("");
const email = ref("");

//console.log("modal:", isModalOpen.value);

const userList = computed(() => {
  return store.getters.getUserList;
});
console.log("userlist", userList);
const setUser = () => {
  const newUser = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
  };

  store.saveUser(newUser);

  // Clear form fields
  // firstName.value = "";
  // lastName.value = "";
  // email.value = "";

  router.push("/dashboard");
};

function openModal(){
      isModalOpen.value = true;
      console.log("Modal is open now:", isModalOpen);
      return(true);
    };

  function closeModal (){
      isModalOpen.value = false;
    };
    function onReset () {
        firstName.value = null;
        lastName.value = null;
        email.value = null;
        accept.value = false
      }
</script>

<style scoped>
.wrapper {
  width: 420px;
  background-color: #b2c8ba;
  /* background-color: #164863; */
  padding: 30px 40px;
}
.wrapper h2 {
  text-align: center;
}
.wrapper .input-box {
  width: 100%;
  height: 50px;
  position: relative;
  border: none;
}
.input-box input {
  background: transparent;
  width: 100%;
  border: none;
  border-bottom: 2px solid #00a9ff;
}
.input-box i {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
}
.wrapper .remember {
  display: flex;
  justify-content: space-between;
  margin: -15px 0 15px;
}

.remeber label input {
  margin-left: 5px;
}
.wrapper a {
  color: white;
  text-decoration: none;
  float: right;
  margin-right: 3px;
}

.btn {
  /* background: #3cb0fd; */
  background: #86a789;
  -webkit-border-radius: 28;
  -moz-border-radius: 28;
  border-radius: 28px;
  font-family: Arial;
  color: #ffffff;
  font-size: 20px;
  padding: 8px 20px 8px 20px;
  text-decoration: none;
  width: 100%;
  cursor: pointer;
}

/* modal */
/* YourComponent.css */

.modal {
  display: block;
  position: fixed;
  float: right;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* semi-transparent background */
}

.modal-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
  color: #333;
}

.close:hover {
  color: red;
}

</style>
