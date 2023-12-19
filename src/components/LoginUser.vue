<template>
  <div class="q-pa-md content" style="max-width: 100%">
    <q-form @submit="verifyAdmin" @reset="onReset" class="q-gutter-md">
      <h4>Login</h4>
      <q-input
        filled
        v-model="email"
        label="Your Email *"
        hint="Email"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Please type something',
          (val) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ||
            'Please enter a valid email address',
        ]"
      />
      <q-input
        filled
        v-model="password"
        label="Password *"
        hint="Password"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />
      <!-- <div>
        <a href="#">Forget your Password?</a>
      </div> -->
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
const router = useRouter();
const store = useStore();

const email = ref("");
const password = ref("");

const formData = ref();
const verifyAdmin = async () => {
  try {
    const response = await axios.post(
      // "http://192.168.11.178:3031/users/login",
      "http://192.168.11.164:3000/api/login",
      {
        email: email.value,
        password: password.value,
      },
      );

    router.push("/dashboard");
    // Handle the response as needed
    console.log("Response:", response);
    console.log(response.data.data.token);
    const token = response.data.data.token;
    localStorage.setItem('token', token);
    
  } catch (error) {
    // Handle errors
    console.error("Error submitting form:", error);
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
  /* display: flex;
  background-color: #F3F3F3;
  display: flex;
  justify-content: center; */
  /* align-items: center; */
}
.hello {
  width: 420px;
  /* background-color: #164863; */
  background-color: #b2c8ba;
  padding: 50px 40px;
}
.img {
  display: flex;
  justify-content: center;
  align-items: center;
}
.hello h2 {
  text-align: center;
}
.hello .input-box {
  width: 100%;
  height: 50px;
  position: relative;
  border: none;
  margin-bottom: 20px;
}
.input-box input {
  background: transparent;
  width: 100%;
  border: none;
  /* border-bottom: 2px solid #00a9ff; */
  border-bottom: 2px;
}
.input-box i {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
}
.hello .remember {
  display: flex;
  justify-content: space-between;
  margin: -15px 0 15px;
}

.remeber label input {
  margin-left: 5px;
}
.hello a {
  color: white;
  text-decoration: none;
  float: right;
  margin-right: 3px;
}

.btn {
  background: #3cb0fd;
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

.btn:hover {
  background: #3498db;
  text-decoration: none;
}
.content {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
