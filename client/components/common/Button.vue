

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

input {
    padding: 0 5px;
    min-width: 200px;
}
</style>

