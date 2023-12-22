<template>
  <div>
    <q-toolbar class="header">
      <q-toolbar-title style="margin-left: 20px"> All Users </q-toolbar-title>
      <!-- <q-input
        v-model="filter"
        outlined
        dense
        placeholder="Search by Name"
        @input="search"
        style="width: 30%; align-item: right"
        class="searchBar"
      /> -->
      <q-input
        v-model="filter"
        outlined
        dense
        placeholder="Search by Name"
        @input="search"
        style="width: 30%; align-item: right"
        class="searchBar"
      />
    </q-toolbar>
    <q-toolbar
    class="head"
      style="
        width: 97%;
        margin-left: 13px;
        background-color: #eef0e5;
        font-size: large;
        display: flex;
        justify-content: space-between;
      "
    >
      {{ `Total users ${totalusers}` }}
      <q-separator dark vertical />
      {{ `Active users ${activeUser}` }}
      <q-separator dark vertical />
      {{ `Inactive users ${inactiveUser}` }}

      <q-btn
        :ripple="{ center: true }"
        color="secondary"
        label="Add New User"
        no-caps
        class="q-page-sticky"
        style="margin-left: 10px; margin-right: 20px"
        @click="openModal"
      />
    </q-toolbar>
  </div>
  <!-- Table to show Users -->
  <div class="table-container">
    <div class="table-responsive">
      <div class="q-pa-md">
        <q-table
          flat
          bordered
          title="Users"
          :rows="rows"
          :columns="columns"
          row-key="name"
          light
          color="secondary"
          :filter="filter"
          :sort-method="sortMethod"
          loading
        >
          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <span
                v-if="!props.row.isVerified"
                @click="handleTextClick(props.row.userId)"
                style="color: green"
              >
                Resend Link
              </span>
              <span v-else> Verified </span>
            </q-td>
          </template>
        </q-table>
      </div>

      <!-- Modal to add new user -->
      <div v-if="isModalOpen" class="modal">
        <div class="modal-content" style="width: 50%">
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
                :rules="[(val) => !!val || 'This field is required']"
              />
              <q-input
                filled
                v-model="lastName"
                label="Last Name *"
                hint="Surname"
                :rules="[(val) => !!val || 'This field is required']"
              />
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
              <div>
                <q-btn label="Send Email" type="submit" color="secondary" />
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
      </div>
    </div>
  </div>
</template>
<script setup>
import { useStore } from "@/Store/users";
import { ref, computed } from "vue";
import { onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import axios from "axios";
import { useQuasar } from "quasar";
import { Notify } from "quasar";
import { instance } from "@/helper/http-config";
const $q = useQuasar();
const { users } = storeToRefs(useStore());

const router = useRouter();
const store = useStore();
var isModalOpen = ref(false);
const accept = ref(false);
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const totalusers = ref("0");
const activeUser = ref("0");
const inactiveUser = ref("0");

const token = localStorage.getItem("token");

const userData = ref("");
const formatActionColumn = (id, row) => {
  const isDisabled = row;
  const userId = id;

  return isDisabled
    ? "N/A"
    : `<span @click="handleTextClick(${userId})">Enable</span>`;
};
const handleTextClick = async (data) => {
  try {
    const response = await instance.patch(
      `auth/verify-user/${data}`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // Handle the response as needed
    console.log("Response:", response);
  } catch (error) {
    $q.notify({
      message: "Error in Submitting form",
      color: "secondary",
    });
    console.error("Error in Resending Email:", error);
  }
};

const qs = require("qs");
const formData = ref();
const setUser = async () => {
  try {
    const response = await instance.post(
      "auth/create-user",
      {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // Handle response
    console.log("Response:", response);
  } catch (error) {
    $q.notify({
      message: "Error in Submitting form",
      color: "secondary",
    });
    //console.error("Error submitting form:", error);
  }
};

function openModal() {
  isModalOpen.value = true;

  return true;
}

function closeModal() {
  isModalOpen.value = false;
}
function onReset() {
  firstName.value = null;
  lastName.value = null;
  email.value = null;
  accept.value = false;
}



// Specify columns for Table
const columns = [
  {
    name: "userId",
    align: "left",
    label: "ID",
    field: "userId",
    sortable: true,
  },
  {
    name: "name",
    align: "left",
    label: "Name",
    field: (row) => `${row.firstName} ${row.lastName}`,
    sortable: true,
  },

  { name: "email", align: "left", label: "Email", field: "email" },
  {
    name: "action",
    label: "Action",
    align: "left",
    field: "action",
    format: (value, row) => {
      // Render a clickable text only when isVerified is false
      const isDisabled = row.isVerified;
      return isDisabled
        ? value
        : `<span @click="() => handleTextClick(${JSON.stringify(
            row
          )})">${value}</span>`;
    },
  },
];



const rows = ref([]);

// Fetch Users data from the API
onBeforeMount(async () => {
  try {
    const response = await instance.get(
      "user/get-user",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    rows.value = response.data.data.rows;
    //console.log(rows.value);
    totalusers.value = response.data.data.pagination.totalUsers;
    activeUser.value = response.data.data.pagination.countVerifiedUsers;
    inactiveUser.value = response.data.data.pagination.countUnverifiedUsers;
  } catch (error) {
    $q.notify({
      message: "Error in Fetching User data",
      color: "secondary",
    });
  }
});

//Search bar Filter
const filter = ref("");
const filteredRows = ref([...rows.value]);


// const handleChange = (status) => {
//   console.log(status);
// };

// async function fetchData(search) {
//   try {
//     console.log(filter.value);
//     const response = await instance.get(
//       `applicant/get-applicants/?search=${search.value}`,

//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     console.log("Response:", response);
//      rows.value = response.data.data.rows;
//   } catch (error) {
//     $q.notify({
//       message: "Error in Updating Applicant status",
//       color: "secondary",
//     });
//   }
// }

</script>

<style scoped>
.header{
  display: flex; 
  justify-content: space-between;
  margin-top: 30px;
}
table {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
thead th {
  background-color: #b2c8ba !important;
}
caption {
  font-size: larger;
  font-weight: bolder;
  color: white;
}

/* modal */
.modal {
  display: block;
  position: fixed;
  float: right;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
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
.searchBar {
  margin-left: 30px;
  align-self: center;
}
.q-toolbar{
  margin-left: 0;
  margin-right: 0;
}
@media screen and (max-width: 767px) {
  .modal-content {
    width: 100% !important;
  }
}
@media screen and (max-width: 767px) {
  .searchBar {
    width: 60% !important;
  }
}
@media screen and (max-width: 767px) {
  .head {
    width: 100% !important;
  }
}
</style>


