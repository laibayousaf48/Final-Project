import { defineStore } from "pinia";
//import { useRouter } from "vue-router";

//const router = useRouter();
export const useStore = defineStore("admin", {
  state: () => {
    return {
      admin: {
        email: "admin@gmail.com",
        password: "qwerty",
      },
      auth: false,
    };
  },
  gettters: {
    getAdmin(state) {
      console.log(state.admin);
    },
    // isAdminLoggedIn(state) {
    //   console.log(state.auth);
    //   return state.auth;
    // }
  },
  actions: {
    checkAdmin(email, password) {
       //const router = useRouter();
        console.log(this.admin);
      if (email === this.admin.email && password === this.admin.password) {
       // console.log(this.auth);
        if (!this.auth) {
            this.auth = true;
            return true;
          // Indicate successful login
        } else {
          alert("You are already logged in");
          return true;
         // router.push("/dashboard");
        }
      } else {
        // throw new Error("Invalid credentials");
        alert("Invalid Credentials");
      }
    },
    checkLogout(){
      //const router = useRouter();
      debugger;
      if(this.auth === true){
        this.auth = false;
        return false;
        //router.push("/");
      }
    }
  },

  persist: true,
});
