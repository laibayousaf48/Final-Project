import { defineStore } from "pinia";
export const useStore = defineStore("applicants", {
  state: () => {
    return {
      applicants: [],
    };
  },
  getters: {
    getApplicantList(state) {
      return state.applicants;
    },
  },

  actions: {
    saveApplicant(newApplicant) {
       debugger;
      const isApplicantExist = this.applicants?.some(
        (applicant) => applicant.email === newApplicant.email
      );

      if (!isApplicantExist) {
        newApplicant.id = this.applicants.length + 1;
        this.applicants.push(newApplicant);
        // commit("addUser", newUser);
        alert("Email send Successfully");
      } else {
        alert("User already exists");
      }
    },
    addApplicant(applicant) {
      this.applicants.push({
        ...applicant,
        status: 'Pending',
        dateApplied: new Date().toISOString(), // Set the current date as the date applied
      })
   
    }
  },
  persist: true,
});
