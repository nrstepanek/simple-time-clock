<template>
  <div>
    <v-data-table
      dense
      :headers="headers"
      :items="summaryData"
      item-key="userid"
      class="elevation-1"
    ></v-data-table>
  </div>
</template>

<script>
import UserService from '@/services/UserService'

export default {
  data: () => ({
    summaryData: [],
    headers: [
      { text: 'User ID', value: 'userid' },
      { text: 'Username', value: 'username' },
      { text: 'Total Worked Time', value: 'totalWorkTime' },
      { text: 'Total Shifts', value: 'shiftCount' },
      { text: 'Total Shift Time', value: 'totalShiftTime' },
      { text: 'Total Breaks', value: 'breakCount' },
      { text: 'Total Lunches', value: 'lunchCount' }
    ]
  }),
  mounted() {
    if (this.isAdmin) {
      this.generateSumamry();
    } else {
      this.$router.push('/dashboard');
    }
  },
  computed: {
    isAdmin() {
      return this.$cookies.get('admin') === 'true';
    }
  },
  methods: {
    async generateSumamry() {
      const allUserDetailsResponse = await UserService.getAllUserDetails(this.userid);
      const allUserData = allUserDetailsResponse.data;
      allUserData.forEach((userData) => {
        const userid = userData.id;
        const username = userData.username;
        const shifts = userData.shifts;
        const shiftCount = shifts.length;
        let totalShiftTime = 0;
        let totalWorkTime = 0;
        let breakCount = 0;
        let lunchCount = 0;

        shifts.forEach((shift) => {
          const startDateTime = new Date(shift.start);
          if (shift.end) {
            const endDateTime = new Date(shift.end);
            totalShiftTime += endDateTime - startDateTime;
            totalWorkTime += endDateTime - startDateTime;
          }

          const breaks = shift.breaks;
          let totalBreakTime = 0;
          breaks.forEach((b) => {
            if (b.lunch) {
              lunchCount += 1;
            }
            breakCount += 1;
            if (b.end) {
              totalBreakTime += new Date(b.start) - new Date(b.end);
            }
          });

          totalWorkTime -= totalBreakTime;
        });
        totalShiftTime = this.formatDurationString(totalShiftTime);


        this.summaryData.push({userid, username, totalWorkTime, shiftCount, totalShiftTime, breakCount, lunchCount});
      });
    },
    formatDurationString(milliseconds) {
      const seconds = Math.floor((milliseconds / 1000) % 60);
      const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
      const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
      const hourString = (hours < 10) ? "0" + hours : hours;
      const minuteString = (minutes < 10) ? "0" + minutes : minutes;
      const secondString = (seconds < 10) ? "0" + seconds : seconds;

      return hourString + ":" + minuteString + ":" + secondString;
    }
  }
}
</script>
