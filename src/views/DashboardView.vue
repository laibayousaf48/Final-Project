<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-secondary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Welcome </q-toolbar-title>
        <q-btn size="md" @click="logoutUser" style="padding-right: 40px; padding-left: 40px">Logout</q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
      <q-scroll-area class="fit">
        <q-list>

          <q-item>
            <q-item-section>
              <router-link to="/dashboard/getUser"
                ><q-btn
                  label="Get User List"
                  text-color="secondary"
                  style="padding-right: 85px"
                ></q-btn></router-link
              >
            </q-item-section>
          </q-item>
          <!-- <q-item>
            <q-item-section>
              <router-link to="/dashboard/jobApplication"
                ><q-btn
                  label="Job Application Form"
                  text-color="secondary"
                   style="padding-right: 25px"
                ></q-btn
              ></router-link> </q-item-section
            >
          </q-item>
          <q-item>
            <q-item-section>
              <router-link to="/dashboard/setPassword"
                ><q-btn
                  label="Set Password"
                  text-color="secondary"
                  style="padding-right: 80px"
                ></q-btn
              ></router-link>
            </q-item-section>
          </q-item>-->
          <q-item> 
            <q-item-section>
              <router-link to="/dashboard/activityLogs"
                ><q-btn
                  label="Activity Logs"
                  text-color="secondary"
                  style="padding-right: 85px"
                ></q-btn
              ></router-link>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <router-link to="/dashboard/applicantList"
                ><q-btn
                  label="Applicant List"
                  text-color="secondary"
                  style="padding-right: 85px"
                ></q-btn
              ></router-link>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
      <!-- <component :is="component"></component> -->
      <!-- <JobApplicationForm /> -->
      <ChatMessages />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import GetUserList from "@/components/GetUserList.vue";
import JobApplicationForm from "@/components/JobApplicationForm.vue";
import ChatMessages from "@/components/ChatMessages.vue";
import { useStore } from "@/Store/admin";
const store = useStore();
import { useRouter } from "vue-router";
const router = useRouter();
const leftDrawerOpen = ref(false);

function logoutUser() {
  const result = store.checkLogout();
  if (result === false) {
    router.push("/");
  }
  console.log("User logged out successfully.");
}
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style scoped>
q-btn {
  border: none;
}
.q-drawer {
  top: 0 !important;
}
</style>
