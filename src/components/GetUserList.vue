<template>
  <div>
    <q-toolbar>
      <q-toolbar-title> All Users </q-toolbar-title>
      <q-input
        v-model="filter"
        outlined
        dense
        placeholder="Search..."
        @input="search"
        style="width: 30%"
      />

      <!-- <q-btn-dropdown
        color="secondary"
        label="Sort By"
        style="padding-left: 30px"
      >
        <q-list>
          <q-item clickable v-close-popup @click="sortItem('pending')">
            <q-item-section>
              <q-item-label>Pending</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="sortItem('accepted')">
            <q-item-section>
              <q-item-label>Accepted</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="sortItem('rejected')">
            <q-item-section>
              <q-item-section>
                <q-item-label>Rejected</q-item-label>
              </q-item-section>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown> -->

      <q-btn
        :ripple="{ center: true }"
        color="secondary"
        label="Add New User"
        no-caps
        class="q-page-sticky"
        style="margin-left: 10px"
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
          :rows="filterRows"
          :columns="columns"
          row-key="name"
          light
          color="secondary"
          :filter="filter"
          :sort-method="sortMethod"
          loading
        />
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
const { users } = storeToRefs(useStore());

const router = useRouter();
const store = useStore();
var isModalOpen = ref(false);
const accept = ref(false);
const firstName = ref("");
const lastName = ref("");
const email = ref("");

const token = localStorage.getItem("token");

const qs = require("qs");
const formData = ref();
const setUser = async () => {
  try {
    const response = await axios.post(
      "http://192.168.11.164:3000/api/createuser",
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
    // Handle the response as needed
    console.log("Response:", response);
  } catch (error) {
    // Handle errors
    console.error("Error submitting form:", error);
  }
};

function openModal() {
  isModalOpen.value = true;
  console.log("Modal is open now:", isModalOpen.value);
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

//Filter on status basis

const statusFilter = ref("");
const sortItem = (status) => {
  statusFilter.value = status;
};

const filterRows = computed(() => {
  return rows.value.filter(
    (row) => !statusFilter.value || row.isAdmin === statusFilter.value
  );
});

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
    name: "isAdmin",
    align: "left",
    label: "Status",
    field: "isAdmin",
    sortable: true,
    //filter: (value, row) => row.status === statusFilter.value,
  },
  {
    name: "isVerified",
    label: "Verification Status",
    field: "isVerified",
  },
];
// const token = localStorage.getItem("token");
//const rows = ref(users.value);
const rows = ref([]);

// Fetch data from the API when the component is created
onBeforeMount(async () => {
  try {
    const response = await axios.get("http://192.168.11.164:3000/api/getuser", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    rows.value = response.data.data; // Assuming the response data is an array of users
    console.log(rows.value);
  } catch (error) {
    alert("Error fetching user data:", error);
  }
});

//Search bar Filter
const filter = ref("");
const filteredRows = ref([...rows.value]);
</script>

<style scoped>
table,
th,
td {
  padding: 10px;
  background-color: #ebf3e8;
}
.table-container {
  width: 100%;
}
tr {
  border-bottom: 2px solid black;
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

@media screen and (max-width: 767px) {
  .modal-content {
    width: 100% !important;
  }
}
</style>

<!--
{
headers: {
"Authorization": `${token}`
}
}
-->
