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
    shifts: []
  }),
  created() {
    this.getUserDetails();
  },
  methods: {
    async getUserDetails() {
      console.log('getuserdetails');
      console.log(this.$store.state.userid);
      if (this.$store.state.userid !== -1) {
        console.log('getting response');
        const userDetailsResponse = await UserService.getUserDetails(this.$store.state.userid);
        this.shifts = userDetailsResponse.data.shifts;
      }
    }
  }
}
</script>
