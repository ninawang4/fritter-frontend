
<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateCommentForm',
  mixins: [BlockForm],
  props: {
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    // console.log(this.freet);
    return {
      url: `/api/comment/${this.freet._id}`,
      method: 'PUT', 
      hasBody: true,
      fields: [
        {id: 'content', type: 'text', label: 'Content', value: ''},
      ],
      
      title: 'Leave a Comment',
      refreshFreets: true,
      callback: () => {
        const message = 'Successfully created a comment!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
        this.$store.commit('updateFreets');
        this.$store.commit('refreshFreets');
      }
    };
  }
};
</script>

