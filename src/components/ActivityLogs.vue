<template>
     <div class="q-pa-md">
        <q-table flat bordered title="Activity Logs" :rows="rows.data" :columns="columns"
        row-key="name" light color="secondary" :filter="filter"
        :sort-method="sortMethod" loading />
      </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { Notify } from 'quasar'
import { instance } from "@/helper/http-config";
const $q = useQuasar();
const columns = [
  { name: "logNumber", align: "center", label: "Log ID", field: "logNumber", sortable: true },
  //{ name: "method", align: "center", label: "Method", field: "method", sortable: true },
  { name: "name", align: "left", label: "Name", field: "name" },
  { name: "email", align: "left", label: "Email", field: "email" },
  { name: "activity", align: "left", label: "Activity", field: "activity" },
  { name: "createdAt", align: "left", label: "Time", field: "createdAt",
    format: (value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}  
];


const token = localStorage.getItem("token");
const rows = ref([]);

// Fetch data from the API when the component is created
onBeforeMount (async () => {
  try {
    const response = await instance.get(`log/get-logs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    rows.value = response.data; // Assuming the response data is an array of users
  } catch (error) {
     $q.notify({
          message: "Error in Fetching Activity Logs",
          color: 'secondary'
        })
  }
});
</script>
