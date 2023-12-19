<template>
  <div class="q-pa-md content" style="max-width: 100%">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <h4>Forget Password</h4>
      <!-- <q-input
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
      /> -->
      <q-input
        filled
        v-model="email"
        label="Email *"
        type="email"
       
      />
      <div>
        <q-btn label="Submit" type="submit" color="secondary" />
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
import { useQuasar } from "quasar";
 import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
import axios from "axios";
//const token = ref(route.params.token);
const $q = useQuasar();
const email = ref("");
// const route = useRoute();
 const token = localStorage.getItem("token");
const onSubmit = async () => {
  try {
    const response = await axios.post(
      `http://192.168.11.164:3000/api/forgetpassword`,
      {
        email: email.value,
      
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // Handle the response as needed
    alert("Password set successfully");
    console.log("Response:", response);
    router.push("/");
  } catch (error) {
    // Handle errors
    console.error("Error in submitting form:", error);
  }
};

function onReset() {

  accept.value = false;
}
</script>
