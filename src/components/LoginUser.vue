<template>
  <div class="q-pa-md main" style="width: 100%">
    <q-form @submit="verifyAdmin" @reset="onReset" class="q-gutter-md">
      <h5 style="text-align: center;">Welcome</h5>
      <h6 style="text-align: center">Become a part of our Community!</h6>
      <q-input
        filled
        v-model="email"
        label="Your Email *"
        hint="Email"
        style="width: 400px"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Please type something',
          (val) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ||
            'Please enter a valid email address',
        ]"
      />
      <q-input
        v-model="password"
        filled
        :type="isPwd ? 'password' : 'text'"
        label="Password *"
        hint="Password"
        style="width: 400px"
        class="content"
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer eye"
            @click="isPwd = !isPwd"
           
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />
        </template>
      </q-input>
      <div class="forget">
        <a href="/forgetPassword">Forget your Password?</a>
      </div>
      <div>
        <q-btn label="Login" type="submit" color="secondary" />
        <q-btn
          label="Reset"
          type="reset"
          color="secondary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { useStore } from "@/Store/admin";
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { Notify } from 'quasar'
import {instance} from "../helper/http-config"
const $q = useQuasar();
const router = useRouter();
const store = useStore();

const email = ref("");
const password = ref("");

const isPwd = ref(true);

const formData = ref();
const verifyAdmin = async () => {
  try {
    const response = await instance.post(
      "auth/login",
      {
        email: email.value,
        password: password.value,
      }
    );
    console.log("Response:", response.data.token);
    const data = response.data;
    localStorage.setItem("token", data.token);
    console.log(data);
    localStorage.setItem("userdata", JSON.stringify(data.data));
    router.push("/dashboard");
   
   
  } catch (error) {
    $q.notify({
          message: "Error submitting form",
          color: 'secondary'
        })
  }
};

function onReset() {
  password.value = null;
  confirmPassword.value = null;
  accept.value = false;
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.placeholder {
  border: none;
  margin-top: 10px;
}
body {
  min-height: 100vh;
  color: white;
 
}
.forget a{
  text-decoration: none;
}




.main {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 30px;
}

.row>*{
  width: 0 !important;
}
* .content :deep(.q-field__marginal ){
width: fit-content !important;
}
</style>
