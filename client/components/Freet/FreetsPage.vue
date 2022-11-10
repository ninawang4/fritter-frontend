<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h1>Welcome {{ $store.state.username }}!</h1>
        <button @click="createFreet">Create a Freet!</button>
      </header>
      <div v-if="creatingFreet === true">
        <CreateFreetForm />
      </div>
    </section>
    <section v-else>
      <header>
        <h2>Welcome to Fritter!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login">
            Sign in
          </router-link>
          to create, edit, and delete freets.
        </h3>
      </article>
    </section>
    <section>
      <header>
        <div class="left">
          <h2>
            <span v-if="$store.state.filter">
              Viewing all freets by @{{ $store.state.filter }}
            </span>
            <span v-else-if="$store.state.pageView === 'home'">
              Viewing Home Page
            </span>
            <span v-else-if="$store.state.pageView === 'trending'">
              Viewing Trending Page
            </span>
            <span v-else>
              Viewing all freets
            </span>
          </h2>
        </div>
        <div>

          <GetPageView
            ref="getPageView"
            value="page"
            button="Home Page"
          />
          <GetPageView
            ref="getPageView"
            value="page"
            button="Trending Freets"
          />
          <GetPageView
            ref="getPageView"
            value="view-all"
            button="View all Freets"
          />
          <GetPageView
            ref="getPageView"
            value="draft"
            button="Drafts"
          />
        </div>

        <div class="right">
          <GetFreetsForm
            ref="getFreetsForm"
            value="author"
            placeholder="🔍 Filter by author (optional)"
            button="Get freets"
          />
        </div>
      </header>
      <section
        v-if="$store.state.freets.length"
      >
        <FreetComponent
          v-for="freet in $store.state.freets"
          :key="freet.id"
          :freet="freet"
        />
      </section>
      <article
        v-else
      >
        <h3>No freets found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';
import GetPageView from '@/components/Freet/GetPageView.vue';

export default {
  name: 'FreetPage',
  components: {FreetComponent, GetFreetsForm, GetPageView, CreateFreetForm},
  mounted() {
    this.$refs.getFreetsForm.submit();
  },
  data() {
    return {
      creatingFreet: false,
    };
  },
  methods: {
    createFreet() {
      if (this.creatingFreet === false) {
        this.creatingFreet = true;
      } else {
        this.creatingFreet = false;
      }
      
    }
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  /* background-color: #abd6be; */
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

header h1 {
  color: #729e85;
  font-size: 36pt;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}

button {
  background-color: #abd6be; /* Green */
  border: none;
  color: white;
  padding: 8px 12px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}

</style>
