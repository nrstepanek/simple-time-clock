<template>
  <div>
    <v-list>
      <v-list-group
        v-for="shift in shifts"
        :key="shift.id"
        v-model="shift.active"
      >
        <v-list-item
          v-for="shiftBreak in shift.breaks"
          :key="shiftBreak.id"
        >
          <v-list-item-content>
            <v-list-item-title v-text="shiftBreak.start"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </div>
</template>

<script>
import UserService from '@/services/UserService'

export default {
  name: 'TimeClock',
  data: () => ({
    shifts: [],
    userid: -1
  }),
  async mounted() {
    if (this.$cookies.get('userid')) {
      this.userid = this.$cookies.get('userid');
      this.getUserDetails();
    }
  },
  methods: {
    async getUserDetails() {
      if (this.userid !== -1) {
        console.log('getting response');
        const userDetailsResponse = await UserService.getUserDetails(this.userid);
        this.shifts = userDetailsResponse.data.shifts;
      }
    }
  }
}
</script>
