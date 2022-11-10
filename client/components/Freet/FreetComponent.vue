<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
  >
    <header>
      <h3 class="author">
        @{{ freet.author }}
      </h3>
    </header>
    <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <p
      v-else
      class="content"
    >
      {{ freet.content }}
    </p>
    <p class="info">
      {{ freet.dateModified }}
      <i v-if="freet.edited">(edited)</i>
    </p>
    <div
        v-if="$store.state.username === freet.author"
        class="actions"
      >
        <button
          v-if="editing"
          @click="submitEdit"
        >
          ✅ Save changes
        </button>
        <button
          v-if="editing"
          @click="stopEditing"
        >
          🚫 Discard changes
        </button>
        <button
          v-if="!editing"
          @click="startEditing"
        >
          ✏️ Edit
        </button>
        <button @click="deleteFreet">
          🗑️ Delete
        </button>
      </div>
    <div class="row">
        <img v-if="upvoted" src="../../../client/dist/img/likedalready.png" @click="upvoteFreet"/>

          <img v-else src="../../../client/dist/img/newlike.png" @click="upvoteFreet"/>
          <div>{{freet.upvotes}} likes</div>
          <br />

          <img src="../../../client/dist/img/comments.png" margin="12px" @click="showComments"/>
          <div>{{comments.length}} comments</div>
    </div>
    <section v-if="commentView">
      <CreateCommentForm
        :id="freet.id"
        :freet = "freet"
      />
      <CommentComponent
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
      />
    </section>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
import CommentComponent from '@/components/Freet/CommentComponent.vue';
import CreateCommentForm from '@/components/Freet/CreateCommentForm.vue';

// components: {
//   CreateCommentForm: () => import('@/components/Freet/CreateCommentForm.vue')
// }

export default {
  name: 'FreetComponent',
  components: {CommentComponent, CreateCommentForm},
  props: {
    // Data from the stored freet (coming from store)
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {}, // Displays success/error messages encountered during freet modification
      upvotes: this.freet.upvotes,
      upvoted : false,
      comments: this.freet.comment,
      commentView: false
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    upvoteFreet() {
      // this.upvotes ++;
      const params = {
        method: 'PUT',
        url: '/api/upvote',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully upvoted freet!', status: 'success'
          });
        },
      };
      try {
        this.request(params);
        this.$store.commit('updateFreets');
        this.$store.commit('refreshFreets');
        if (this.upvoted === false) {
          this.upvoted = true;
        } else {
          this.upvoted = false;
        };
      } catch(e) {
        this.$set(this.alerts, 'Cannot upvote more than once', 'Cannot upvote more than once');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      } 
    },
    showComments() {
      console.log('hi');
      if (this.commentView == true) {
        this.commentView = false;
      } else {
        this.commentView = true;
      }
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
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
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error = 'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited freet!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
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
        if (params.url) {
          r = await fetch(`${params.url}/${this.freet._id}`, options);
        } else {
          r = await fetch(`/api/freets/${this.freet._id}`, options);
        }
        // const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.freet {
    border-top: 0.5px solid #111;
    /* border: none; */
    padding: 20px;
    position: relative;
}

.info {
  color: rgb(170, 170, 170);
  font-size: 12pt;
}

section {
  display: flex;
  flex-direction: column;
}

invisible {
  border: 0px;

}

.row {
  margin-top: 16px;
  display: flex;
}

.row img {
  width: auto;
  max-width: 24px;
  height: auto;
  max-height: 24px;
  background: url("../../../client/dist/img/hoverlike.png");
}

.row img.image-hover {
  background: url("../../../client/dist/img/hoverlike.png");
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  object-fit: contain;
  opacity: 0;
  transition: opacity .2s;
}

.row:hover img.image-hover {
    opacity: 1;
  }

.row div {
  padding: 12px;
  margin-top: -12px;
}

button {
  background-color: white; /* Green */
  border: none;
  color: white;
  padding: 4px 8px;
  text-align: center;
  color: black;
  text-decoration: none;

  font-size: 16px;
}

button:hover {
  color: #729e85;
}

.column {
  flex: 50%;
}
</style>
