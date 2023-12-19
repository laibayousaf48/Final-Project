<template>
     <div class="q-pa-md">
        <q-table flat bordered title="Activity Logs" :rows="rows.data" :columns="columns"
        row-key="name" light color="secondary" :filter="filter"
        :sort-method="sortMethod" loading: true />
      </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { onBeforeMount } from "vue";
const columns = [
  { name: "logId", align: "center", label: "Log ID", field: "logId", sortable: true },
  { name: "method", align: "center", label: "Method", field: "method", sortable: true },
  { name: "name", align: "left", label: "Name", field: "name" },
  { name: "email", align: "left", label: "Email", field: "email" },
  { name: "createdAt", align: "left", label: "Time", field: "createdAt",
    format: (value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}  
];


const token = localStorage.getItem("token");
const rows = ref([]);

// Fetch data from the API when the component is created
onBeforeMount (async () => {
  try {
    const response = await axios.get(`http://192.168.11.164:3000/api/getlogs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    rows.value = response.data; // Assuming the response data is an array of users
  } catch (error) {
    console.error('Error fetching Activity log:', error);
  }
});
</script>
