<template>
  <div style="font-weight: bold; margin-left:20px" class="content">
    
    <q-icon name="person" size="5em" color="#637E76"></q-icon>
    <br>
    {{ `Name: ${name}` }}
    <br>
    {{ `Email: ${email}` }}

  </div>
<hr>
  <div class="q-pa-md main" style="max-width: 400px">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <h6>Change Password</h6>
      
       <q-input
        v-model="oldPassword"
        filled
        :type="showPass ? 'password' : 'text'"
        label="Password *"
        hint="Password"
        style="width: 400px"
        class="content"
      >
        <template v-slot:append>
          <q-icon
            :name="showPass ? 'visibility_off' : 'visibility'"
            class="cursor-pointer eye"
            @click="showPass = !showPass"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />
        </template>
      </q-input>
      
    
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
import { onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import { ref, computed } from "vue";
import axios from "axios";
import { Notify } from 'quasar'
import { instance } from "@/helper/http-config";

const $q = useQuasar();
const route = useRoute();
const token = ref(route.params.token);
console.log(token);
const oldPassword = ref(null);
const password = ref(null);
const confirmPassword = ref(null);
var name = ref("");
var email = ref("");
const showPass= ref(true);

const isPwd = ref(true);
const pass = ref(true);

onBeforeMount(async () => {
  try {
    const data = JSON.parse(localStorage.getItem("userdata"));
    console.log(data);
    name = data.FirstName + " " + data.LastName;
    email = data.email;
  } catch (error) {
     $q.notify({
          message: "Error in fetching data",
          color: 'secondary'
        })
   // console.error("Error fetching Activity log:", error);
  }
});

//validation for confirm password
const passwordMatchRule = computed(() => [
  (val) => (val && val.length > 0) || "Please type something",
  (val) => val === password.value || "Passwords do not match",
]);
const usertoken = localStorage.getItem("token");

const onSubmit = async () => {
  try {

    const response = await instance.patch(
      `auth/change-password`,
      { 
        oldPassword: oldPassword.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
      },
      {
        headers: {
          Authorization: `Bearer ${usertoken}`,
        },
      }
    );
    // Handle the response as needed
     $q.notify({
          message: "Password set successfully",
          color: 'secondary'
        })
    console.log("Response:", response);
  } catch (error) {
    // Handle error
     $q.notify({
          message: "Error in submitting form",
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

.main{
    align-self: center;
}

* .content :deep(.q-field__marginal ){
width: fit-content !important;
}
</style>