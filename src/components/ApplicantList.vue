<template>
  <div>
    <q-toolbar style=" margin-top: 50px">
      <q-toolbar-title style="margin-left: 20px;">
        Applicant List
      </q-toolbar-title>
      
<q-input
        v-model="search"
        outlined
        dense
        placeholder="Search by Name, Email"
        @input="handleChange"
        style="width: 30%"
        class="searchbar"
      />

      <q-select
        color="secondary-12"
        v-model="filter"
        :options="options"
        label="Status"
        class="dropbtn"
        @input="handleFilterChange"
      />
      
      
    </q-toolbar>
  </div>
  <div>
    <!-- Display Applicants Table -->

    <q-table :rows="rows" :columns="columns" row-key="email">
      <template v-slot:body-cell-status="props">
        <q-td :props="props">{{ props.row.status }}</q-td>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
          <q-td auto-width>
            <q-btn
              size="sm"
              color="secondary"
              round
              dense
              @click="downloadCV(props.row.applicantId)"
              icon="cloud_download"
            />
            <q-tooltip class="bg-purple"> Download Resume </q-tooltip>
          </q-td>
          <q-td
            ><q-btn
              v-if="
                props.row.status !== 'Accepted' &&
                props.row.status !== 'Rejected'
              "
              color="green"
              icon="check"
              @click="acceptApplicant(props.row)"
              size="x-small"
            />
            <q-tooltip class="bg-purple" > Accept Applicant </q-tooltip>
          </q-td>
          <q-td
            ><q-btn
              v-if="
                props.row.status !== 'Accepted' &&
                props.row.status !== 'Rejected'
              "
              color="red"
              icon="close"
              @click="rejectApplicant(props.row)"
              size="x-small"
            />
            <q-tooltip class="bg-purple"> Reject Applicant </q-tooltip></q-td
          >
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<script setup>
import { useStore } from "@/Store/applicants";
import { ref, computed, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
// import { onBeforeMount } from "vue";
import { watch } from "vue";
import axios from "axios";
import { useQuasar } from "quasar";
import { Notify } from "quasar";
import { instance } from "@/helper/http-config";

const $q = useQuasar();
const store = useStore();
const filter = ref("");
const search = ref("");
const { applicants } = storeToRefs(useStore());

const model = ref(null);
const options = ["Pending", "Accepted", "Rejected"];

const columns = [
  {
    name: "applicantId",
    align: "left",
    label: "ID",
    field: "applicantId",
    sortable: true,
  },
  {
    name: "userName",
    align: "left",
    label: "Name",
    field: "userName",
    sortable: true,
  },
  {
    name: "qualification",
    align: "left",
    label: "Qualification",
    field: "qualification",
  },
  { name: "email", align: "left", label: "Email", field: "email" },

  { name: "cnic", align: "left", label: "CNIC", field: "cnic" },
  { name: "age", align: "left", label: "Age", field: "age" },
  {
    name: "phoneNumber",
    align: "left",
    label: "Phone Number",
    field: "phoneNumber",
  },
  { name: "address", align: "left", label: "Address", field: "address" },
  { name: "status", align: "left", label: "Status", field: "status" },
];

const downloadCV = async (applicantId) => {
  console.log(applicantId);
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`applicant/download-cv/${applicantId}`, {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Extract the filename from the Content-Disposition header
    const contentDisposition = response.headers["content-disposition"];
    const matches =
      contentDisposition && contentDisposition.match(/filename="(.+)"/);
    const suggestedFilename = matches && matches[1];
    // Create a Blob from the response data
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    // Create a link element to trigger the download
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    // Set the filename for download (use the suggested filename or a default)
    link.download = suggestedFilename || `CV_${applicantId}.pdf`;
    link.click();
  } catch (error) {
    console.error("Error downloading CV:", error);
  }
};

const token = localStorage.getItem("token");
const rows = ref([]);

// Fetch data from the API when the component is created
onMounted(async () => {
  try {
    const response = await instance.get("applicant/get-applicants", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    rows.value = response.data.data.rows; // Assuming the response data is an array of users
    //console.log(rows.value);
  } catch (error) {
    $q.notify({
      message: "Error in Fetching Applicant List",
      color: "secondary",
    });
  }
});

// Action to update applicant list
const updateStatus = ref("");
function acceptApplicant(applicant) {
  console.log(applicant);
  this.updateApplicantStatus(applicant.applicantId, "Accepted");
}
function rejectApplicant(applicant) {
  this.updateApplicantStatus(applicant.applicantId, "Rejected");
}

async function updateApplicantStatus(applicantId, Status) {
  try {
    const response = await instance.patch(
      `applicant/update-applicants/${applicantId}`,
      { status: Status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Response:", response);
  } catch (error) {
    $q.notify({
      message: "Error in Updating Applicant status",
      color: "secondary",
    });
  }
}
//Get Data on Filter Basis

const handleFilterChange = (status) => {
  console.log(status);
};

async function getData(filter) {
  try {
    console.log(filter.value);
    const response = await instance.get(
      `applicant/get-applicants/?status=${filter.value}`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Response:", response);
     rows.value = response.data.data.rows;
  } catch (error) {
    $q.notify({
      message: "Error in Updating Applicant status",
      color: "secondary",
    });
  }
}

watchEffect(()=>{
  console.log(filter.value)
  getData(filter);
  fetchData(search);
})

//Search and filter

const handleChange = (status) => {
  console.log(status);
};

async function fetchData(search) {
  try {
    console.log(filter.value);
    const response = await instance.get(
      `applicant/get-applicants/?search=${search.value}`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Response:", response);
     rows.value = response.data.data.rows;
  } catch (error) {
    $q.notify({
      message: "Error in Updating Applicant status",
      color: "secondary",
    });
  }
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
</script>
<style scoped>

* .dropbtn :deep(.q-field__marginal) {
  width: fit-content !important;
}

.dropbtn {
  width: 30% !important;
}
/* .bars {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  @media screen and (max-width: 767px) {
    .bars {
      flex-direction: column;
      align-items: stretch;
    }

    .searchbar {
      width: 100%;
      margin-bottom: 10px;
    }

    .dropbtn {
      width: 100%;
    }
  } */

  .bars {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  @media screen and (max-width: 767px) {
    .searchBar {
      flex-direction: column;
      width: 100% !important; 
    }
  }


/* @media screen and (max-width: 767px) {
  .dropbtn {
    width: 40% !important;
  }
} */
</style>
