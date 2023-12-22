<template>
  <div class="q-pa-md main">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <h5 style="text-align: center;">Set Password</h5>
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

      <q-input
        v-model="confirmPassword"
        filled
        :type="pass ? 'password' : 'text'"
        label="Confirm Password *"
        hint="Confirm Password"
        style="width: 400px"
        class="content"
      >
        <template v-slot:append>
          <q-icon
            :name="pass ? 'visibility_off' : 'visibility'"
            class="cursor-pointer eye"
            @click="pass = !pass"
            lazy-rules
            :rules="passwordMatchRule"
          />
        </template>
      </q-input>
      <div>
        <q-btn label="Set Password" type="submit" color="secondary" />
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
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { instance } from "@/helper/http-config";
const $q = useQuasar();
const route = useRoute();
const isPwd = ref(true);
const pass = ref(true);
const password = ref(null);
const confirmPassword = ref(null);
const accept = ref(false);
const token = ref(route.params.token);

console.log("token", token.value);
const passwordMatchRule = computed(() => [
  (val) => (val && val.length > 0) || "Please type something",
  (val) => val === password.value || "Passwords do not match",
]);

const onSubmit = async () => {
  try {
    const response = await instance.post(
      `auth/set-password/${token.value}`,
      {
        password: password.value,
        confirmPassword: confirmPassword.value,
      }
    );
    // Handle the response as needed
    alert("Password set successfully");
    console.log("Response:", response);
  } catch (error) {
    // Handle errors
    console.error("Error submitting form:", error);
  }finally{
    onReset();
  }
};

function onReset() {
  password.value = null;
  confirmPassword.value = null;
  accept.value = false;
}

</script>
<style scoped>
.main{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 45px;
}
* .content :deep(.q-field__marginal ){
width: fit-content !important;
}
</style>
