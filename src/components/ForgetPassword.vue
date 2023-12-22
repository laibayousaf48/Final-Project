<template>
  <div class="q-pa-md content" style="max-width: 100%">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <h5 style="text-align: center">Forget Password</h5>
      <q-input
        filled
        v-model="email"
        label="Email *"
        type="email"
       style="width: 400px"
      />
      <div class="forget">
        <a href="/">Back to Login Page</a>
      </div>
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
import { instance } from "@/helper/http-config";
//const token = ref(route.params.token);
const $q = useQuasar();
const email = ref("");
// const route = useRoute();
 const token = localStorage.getItem("token");
const onSubmit = async () => {
  try {
    const response = await instance.post(
      `auth/forget-password`,
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
    $q.notify({
          message: "Error submitting form",
          color: 'secondary'
        })
    console.error("Error in submitting form:", error);
  }
};

function onReset() {

  accept.value = false;
}
</script>
<style scoped>
.forget a{
  text-decoration: none;
}
.content{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
}
</style>
