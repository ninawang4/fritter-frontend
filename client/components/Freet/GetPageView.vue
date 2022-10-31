<!-- Form for getting freets (all, from user) (inline style) -->

<script>
import Button from '@/components/common/Button.vue';


export default {
  name: 'GetPageView',
  mixins: [Button],
  data() {
    return {
        value: this.$store.state.pageView,
        refreshFreets: true
    };
  },
  methods: {
    async submit() {
        var url;
        var pageView;

        if (this.button === 'Home Page') {
            url ='/api/page?page=home';
            this.$store.commit('updatePageview', 'home');
        } else if (this.button === 'View all Freets') {
            url = '/api/freets';
            this.$store.commit('updatePageview', null);
        } else if (this.button === 'Trending Freets') {
            url = '/api/page?page=trending';
            this.$store.commit('updatePageview', 'trending');
        };
        this.value = '';
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        } else {
            console.log('yay worked');
        }
        this.$store.commit('updateFreets', res);
      } catch (e) {
        if (this.value === this.$store.state.filter) {
          // This section triggers if you filter to a user but they
          // change their username when you refresh
          this.$store.commit('updateFilter', null);
          this.$store.commit('updatePageview', null);
          this.value = ''; // Clear filter to show all users' freets
          this.$store.commit('refreshFreets');
        } else {
          // Otherwise reset to previous fitler
          this.value = this.$store.state.filter;
        }

        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>


