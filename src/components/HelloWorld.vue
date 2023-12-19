<template>
  
  <router-view />
    <LoginUser />
 
</template>

<script setup>
import LoginUser from "@/components/LoginUser.vue";
// import { useStore } from '@/Store/users';
// import { onMounted } from "vue";
// export default {
//   name: "HelloWorld",
//   props: {
//     msg: String,
//   },
// };

//import { onMounted } from "vue";
//import { ref } from "vue";
//import { reactive } from "vue";

// const store = useStore();
// console.log(store);
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  height: 70px;
  background-color: rgb(115, 177, 142);
  align-items: center;
  padding-left: 30px;
  padding-right: 30px;
}
.btn {
  border-radius: 10px;
  font-size: large;
  font-weight: bold;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
