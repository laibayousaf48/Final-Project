<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-secondary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Welcome </q-toolbar-title>
        <q-icon name="person" size="2em" @click="handelClick">
          <q-tooltip> View Profile </q-tooltip>
        </q-icon>
        <q-icon
          size="md"
          @click="logoutUser"
          class="logout"
          ><i class="fa-solid fa-right-from-bracket icon"></i></q-icon
        >
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      bordered
      class="sidebar"
      style="background-color: #eef0e5;"
    >
    
      <!-- drawer content -->
      <q-scroll-area class="fit">
        <q-list>
          <q-item  v-if="showTab">
            <q-item-section class="q-ma-md text-left">
              <router-link to="/dashboard/getUser" class="nav-link">
                <span><q-icon name="person" size="2em" class="icons"> </q-icon> </span>
                <span
                  class="nav-label"
                  style="font-size: larger; font-weight: bold"
                  >Get User List</span
                >
              </router-link>
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item v-if="showTab">
            <q-item-section class="q-ma-md text-left">
              <router-link to="/dashboard/activityLogs" class="nav-link">
                <span><q-icon name="history" size="2em" class="icons"> </q-icon> </span>
                <span
                  class="nav-label"
                  style="font-size: larger; font-weight: bold"
                  >Activity Logs</span
                >
              </router-link>
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item>
            <q-item-section class="q-ma-md text-left">
              <router-link to="/dashboard/applicantList" class="nav-link">
                <span><q-icon name="list" size="2em" class="icons"> </q-icon> </span>
                <span
                  class="nav-label"
                  style="font-size: larger; font-weight: bold"
                  >Applicant List</span
                >
              </router-link>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view style="margin-top: 30px" />
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
import UserProfile from "@/components/UserProfile.vue";
import { useStore } from "@/Store/admin";
import { onMounted } from "vue";
const store = useStore();
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { Notify } from "quasar";
const $q = useQuasar();
const router = useRouter();
const leftDrawerOpen = ref(false);
const showDropdown = ref(false);
const showTab = ref(false);
const handelClick = () => {
  router.push("/dashboard/userProfile");
};
function logoutUser() {
  router.push("/");
  localStorage.removeItem("token");
  localStorage.removeItem("userdata");

  $q.notify({
    message: "User logged out successfully.",
    color: "secondary",
  });
}
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
onMounted(async () => {
  try {
    const user = JSON.parse(localStorage.getItem("userdata"));
    const userStatus = user.isAdmin;
    showTab.value = userStatus;
  } catch {
    $q.notify({
      message: "Unable to get user status",
      color: "secondary",
    });
  }
});
</script>

<style scoped>
q-btn {
  border: none;
}
.q-drawer {
  top: 0 !important;
  background-color: #d0d4ca;
}
.logout :deep(.q-toolbar) {
  padding-right: 0px !important;
  font-size: 2em;
}
.icon{
  font-size: 0.5em;
}
.icons{
  margin-right: 10px;
}
.sidebar {
  background-color: #d0d4ca;
}
</style>
