<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-form @submit="setApplicant" @reset="onReset">
        <h4 style="text-align: center">Job Application Form</h4>

       
        <q-row>
          <q-col cols="12" sm="6">
            <q-input
              filled
              v-model="userName"
              label="Your name *"
              hint="Name"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please type something',
                (val) =>
                  !/\d/.test(val) ||
                  'Numbers are not allowed in the name field',
              ]"
            />
          </q-col>

          <q-col cols="12" sm="6">
            <q-input
              filled
              v-model="email"
              label="Your Email*"
              hint="Email"
              :rules="[
                (val) => !!val || 'This field is required',
                (val) => /.+@.+/.test(val) || 'Enter a valid email address',
              ]"
            />
          </q-col>
        </q-row>
        <q-row>
          <q-col cols="12" sm="6">
            <q-input
              filled
              v-model="qualification"
              label="Your Qualification *"
              hint="Qualification"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please type something',
                (val) =>
                  !/\d/.test(val) ||
                  'Numbers are not allowed in the name field',
              ]"
            />
          </q-col>
          <q-col cols="12" sm="6">
            <q-input
              filled
              v-model="cnic"
              label="Your CNIC *"
              hint="CNIC"
              :rules="[
                (val) => (val && val.length > 0) || 'Please type something',
                (val) =>
                  /^\d+$/.test(val) ||
                  'Only numbers are allowed in the phone number field',
                (val) =>
                  (val && val.length <= 13) ||
                  'Phone number cannot exceed 11 digits',
              ]"
            />
          </q-col>
        </q-row>
        <q-row>
          <q-col cols="12" sm="12">
            <q-input
              filled
              v-model="address"
              label="Your Address *"
              hint="Address"
              :rules="[
                (val) => (val && val.length > 0) || 'Please type something',
                (val) => true, // No specific rule for address, allowing both text and numbers
              ]"
            />
          </q-col>
          <q-col cols="12" sm="12">
            <q-input
              filled
              v-model="phoneNumber"
              label="Your Phone Number *"
              hint="Phone Number"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please type something',
                (val) =>
                  /^[0-9#+*\(\)\[\]\-\s]+$/.test(val) ||
                  'Invalid characters in the phone number field',
                (val) =>
                  (val && val.length <= 20) ||
                  'Phone number cannot exceed 20 characters',
              ]"
            />
          </q-col>
        </q-row>

        <q-row>
          <q-col cols="12" sm="6">
            <q-file
              standout="bg-teal text-white"
              v-model="cv"
              label="Attach Resume"
              hint="Resume/CV"
              :rules="[(val) => val !== null || 'Please attach your resume']"
            />
          </q-col>
          <q-col cols="12" sm="6">
            <q-input
              filled
              v-model="age"
              label="Your Age *"
              hint="Age"
              :rules="[
                (val) => (val && val.length > 0) || 'Please type something',
                (val) =>
                  /^\d+$/.test(val) ||
                  'Only numbers are allowed in the name field',
              ]"
            />
          </q-col>
        </q-row>

        <div class="button">
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
  </div>
</template>

<script setup>
import { useStore } from "@/Store/applicants";
import { useQuasar } from "quasar";
import { ref } from "vue";
import { Notify } from "quasar";
import axios from "axios";
import { instance } from "@/helper/http-config";
const store = useStore();
const $q = useQuasar();

const userName = ref(null);
const email = ref(null);
const qualification = ref(null);
const cnic = ref(null);
const address = ref(null);
const phoneNumber = ref(null);
const cv = ref(null);
const age = ref(null);
const accept = ref(false);

const formData = new FormData();

const setApplicant = async () => {
  try {
    formData.append("userName", userName.value);
    formData.append("email", email.value);
    formData.append("qualification", qualification.value);
    formData.append("cnic", cnic.value);
    formData.append("address", address.value);
    formData.append("phoneNumber", phoneNumber.value);
    formData.append("cv", cv.value);
    formData.append("age", age.value);

    const response = await instance.post(
     "applicant/submit-form",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Response:", response);
  } catch (error) {
    // Handle errors
    console.error("Error submitting form:", error);
  }finally{
    onReset();
  }
};

const onReset = () => {
  
  userName.value = null;
  email.value = null;
  qualification.value = null;
  cnic.value = null;
  address.value = null;
  phoneNumber.value = null;
  cv.value = null;
  age.value = null;
 
  accept.value = false;
};
</script>
<style scoped>
q-row{
  display: flex;
  flex-direction: row ;
  justify-content: space-between;
  width: 850px;
   flex-wrap: wrap;
}
q-col{
  width: 400px;
}
@media screen and (max-width: 767px) {
  q-col {
    width: 100% !important;
  }
}
@media screen and (max-width: 767px) {
  q-row{
    width: 100% !important;
  }
}
.button{
  margin-top: 10px;
}
</style>