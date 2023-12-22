import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
// import { useStore } from "@/Store/admin";
// import { ref} from "vue"

//import { storeToRefs } from "pinia";

function guardRoute(to, from, next) {
  const token = localStorage.getItem("token");
  if (!token) {
    next();
  } else {
    next("/dashboard");
  }
}


function guardMyroute(to, from, next) {
  const token = localStorage.getItem("token");
  if (token) {
    next(); // allow entering the route
  } else if(!isAuthenticatedRef.value){
    next("/"); // go to '/login';
  }
}

const routes = [
  {
    path: '/',
    name: "homeview",
    beforeEnter: guardRoute,
    component: HomeView,
  },
  {
    path: "/jobApplication",
    name: "jobapp",
    component: () => import("../views/JobApplicationView.vue"),
  },
  {
    path: "/set-password/:token",
    name: "setpassword",
    component: () => import("../views/SetPasswordView.vue"),
  },
  {
    path: "/forgetPassword",
    name: "forgetpassword",
    component: () => import("../views/ForgetPasswordView.vue"),
  },
  {
    path: "/changePassword/:token",
    name: "changepassword",
    component: () => import("../views/ChangePasswordView.vue"),
  },
  {
    path: "/dashboard",
   // name: "dashboard",
   beforeEnter: guardMyroute,
    component: () => import("../views/DashboardView.vue"),
    children: [
      {
        path: "",
        redirect: { name: "applicantList" },
      },
      // {
      //   path: "startScreen",
      //   name: "startScreen",
      //   component: () => import("@/components/StartingScreen.vue"),
      // },
      {
        path: "getUser",
        name: "getUser",
        component: () => import("@/components/GetUserList.vue"),
      },
      {
        path: "activityLogs",
        name: "activityLogs",
        component: () => import("@/components/ActivityLogs.vue"),
      },
      {
        path: "applicantList",
        name: "applicantList",
        component: () => import("@/components/ApplicantList.vue"),
      },
      {
        path: "userProfile",
        name: "userProfile",
        component: () => import("@/components/UserProfile.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
