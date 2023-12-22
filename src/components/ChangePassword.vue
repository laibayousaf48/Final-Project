<template>
  <div class="q-pa-md content" style="max-width: 100%">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <h4>Change Password</h4>
      <q-input
        filled
        v-model="oldPassword"
        label="Old Password *"
        hint="Password"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />
      <q-input
        filled
        v-model="password"
        label="Password *"
        hint="Password"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />
      <q-input
        filled
        v-model="confirmPassword"
        label="Confirm Password *"
        hint="Confirm Password"
        lazy-rules
        :rules="passwordMatchRule"
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
// import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { ref, computed } from 'vue';
import axios from "axios";


const $q = useQuasar();
const route = useRoute();
const token = ref(route.params.token);
const oldPassword = ref(null);
const password = ref(null);
const confirmPassword = ref(null);
//validation for confirm password
const passwordMatchRule = computed(() => [
  (val) => (val && val.length > 0) || "Please type something",
  (val) => val === password.value || "Passwords do not match",
]);

const onSubmit = async () => {
  try {
    const response = await axios.post(
      `http://192.168.11.164:3000/api/auth/change-password/${token.value}`,
      {
        password: password.value,
        confirmPassword: confirmPassword.value,
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
