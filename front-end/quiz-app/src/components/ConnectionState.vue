<template>
    <p>State: {{ connected }}</p>
  </template>
  
  <script>
  import { state } from "@/utils/socket";
  
  export default {
    name: "ConnectionState",
  
    computed: {
      connected() {
        return state.connected;
      }
    }
  }
  </script>