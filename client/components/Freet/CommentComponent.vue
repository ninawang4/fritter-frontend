<template>
    <article class="comment">
    <header>
      <h3 class="author">@{{ comment.username }}</h3>
      <button @click="deleteComment">Delete Comment</button>
    </header>     
    <p class="content">
      {{comment.content}}
     </p>
  </article>
</template>

<script>
export default {
  name: 'CommentComponent',
  props: {
    // Data from the stored freet (coming from freet component)
    comment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      comments: this.freet.comment,
      commentView: false
    };
  },
  methods: {
    deleteComment() {
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        //if params.url
        var r;
        r = await fetch(`/api/comment/${this.comment._id}`, options);

        // const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('updateFreets');
        this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
}
</script>

<style scoped>
.comment {
    border-top: 0.5px solid #111;
    padding: 20px;
    margin: 12px;
    position: relative;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

section {
  display: flex;
  flex-direction: column;
}

invisible {
  border: 0px;

}

button {
  background-color: white; /* Green */
  border: none;
  color: white;
  text-align: center;
  color: black;
  text-decoration: none;
  font-size: 16px;
}

button:hover {
  color: #729e85;
}
</style>
