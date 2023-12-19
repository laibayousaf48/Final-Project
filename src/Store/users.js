import { defineStore } from "pinia";
export const useStore = defineStore("users", {
  state: () => {
    return {
      users: [],
    };
  },
  getters: {
    getUserList(state) {
      return state.users;
    },
  },

  actions: {
    saveUser(newUser) {
      const isUserExist = this.users?.some(
        (user) => user.email === newUser.email
      );

      if (!isUserExist) {
        newUser.id = this.users.length + 1;
        this.users.push(newUser);
        // commit("addUser", newUser);
        alert("User added Successfully");
      } else {
        alert("User already exists");
      }
    },
  },
  persist: true,
});
