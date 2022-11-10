

<template>
  <form @submit.prevent="submit">
    <button
      type="submit"
    >
    {{ button }}
    </button>
  </form>
</template>

<script>

export default {
  name: 'Button',
  props: {
    button: {
      type: String,
      default: 'Submit'
    }
  },
  data() {
    return {value: this.button, alerts: {}};
  }
};
</script>

<style scoped>
form {
    display: flex;
    position: relative;
}

button {
  /* background-color: #abd6be; Green */
  border: none;
  color: black;
  padding: 8px 12px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}

input {
    padding: 0 5px;
    min-width: 200px;
}
</style>

