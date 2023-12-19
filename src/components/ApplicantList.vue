<template>
  <div>
    <!-- Display Applicants Table -->
    <h5>Applicant List</h5>
    <q-table :rows="rows.data" :columns="columns" row-key="email">
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
          </q-td>
          <q-td
            ><q-btn
              v-if="
                props.row.status !== 'Accepted' &&
                props.row.status !== 'Rejected'
              "
              color="positive"
              label="Accept"
              @click="acceptApplicant(props.row)"
          /></q-td>
          <q-td
            ><q-btn
              v-if="
                props.row.status !== 'Accepted' &&
                props.row.status !== 'Rejected'
              "
              color="negative"
              label="Reject"
              @click="rejectApplicant(props.row)"
          /></q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<script setup>
import { useStore } from "@/Store/applicants";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";
import axios from "axios";
const store = useStore();
const { applicants } = storeToRefs(useStore());
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
  {
    name: "phoneNumber",
    align: "left",
    label: "Phone Number",
    field: "phoneNumber",
  },
  { name: "address", align: "left", label: "Address", field: "address" },
  { name: "status", align: "left", label: "Status", field: "status" },

  { name: "age", align: "left", label: "Age", field: "age" },
  {
    name: "actions",
    label: "Download Resume",
    align: "left",
  },
];

const downloadCV = async (applicantId) => {
  console.log(applicantId);
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `http://192.168.11.164:3000/api/download-cv/${applicantId}`,
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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
onBeforeMount(async () => {
  try {
    const response = await axios.get(
      "http://192.168.11.164:3000/api/get-applicants",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    rows.value = response.data; // Assuming the response data is an array of users
    //console.log(rows.value);
  } catch (error) {
    alert("Error fetching Activity log:", error);
  }
});
//console.log("rows", rows);
const updateStatus = ref("");
function acceptApplicant(applicant) {
  console.log(applicant);
  this.updateApplicantStatus( applicant.applicantId, "Accepted");
}
function rejectApplicant(applicant) {
  this.updateApplicantStatus(applicant.applicantId, "Rejected");
}

  async function updateApplicantStatus(applicantId, Status) {  
  try {
    const response = await axios.patch(
      `http://192.168.11.164:3000/api/update-applicants/${applicantId}`,
      { status: Status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Response:", response);
  } catch (error) {
    console.error("Error updating applicant status:", error);
    // You might want to handle errors more gracefully, e.g., show an error message to the user
  }
}

</script>
