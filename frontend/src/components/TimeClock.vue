<template>
  <v-row no-gutters>
    <v-col cols="12" sm="6">
      <h3>Shift history for user #{{this.userid}}, {{this.username}}.</h3>
      <v-list>
        <v-list-group
          v-for="shift in shifts"
          :key="shift.id"
          v-model="shift.active"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{getShiftText(shift)}}</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            v-for="shiftBreak in shift.breaks"
            :key="shiftBreak.id"
          >
            <v-list-item-content>
              <v-list-item-title>{{getBreakText(shiftBreak)}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-col>
    <v-col cols="6" sm="4">
      <div v-if="currentShift">
        Shift in progress, start time: {{this.currentShift.start}}
        <div v-if="currentBreak">
          Break in progress, start time: {{this.currentBreak.start}}
          <v-btn @click="endBreak">End break</v-btn>
        </div>
        <div v-else>
          <v-btn @click="startBreak">Start break</v-btn>
          <v-btn @click="startLunchBreak">Start lunch break</v-btn>
          <v-btn @click="endShift">End shift</v-btn>
        </div>
      </div>
      <div v-else>
        <v-btn @click="startShift">Start shift</v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import UserService from '@/services/UserService'
import ShiftService from '@/services/ShiftService'
import BreakService from '@/services/BreakService'

export default {
  name: 'TimeClock',
  data: () => ({
    shifts: [],
    currentShift: null,
    currentBreak: null,
    userid: -1,
    username: ""
  }),
  async mounted() {
    if (this.$cookies.get('userid')) {
      this.userid = this.$cookies.get('userid');
      this.username = this.$cookies.get('username');
      this.getUserDetails();
    }
  },
  methods: {
    async getUserDetails() {
      this.currentShift = null;
      this.currentBreak = null;
      if (this.userid !== -1) {
        const userDetailsResponse = await UserService.getUserDetails(this.userid);
        this.shifts = userDetailsResponse.data.shifts;
        this.setCurrentShift();
        if (this.currentShift) {
          this.setCurrentBreak();
        }
      }
    },
    getShiftText(shiftData) {
      const startDate = new Date(shiftData.start);
      if (!shiftData.end) {
        return "Active shift, started " + startDate.toLocaleTimeString();
      }
      else {
        const endDate = new Date(shiftData.end);
        return startDate.toLocaleDateString("en-US") + " Shift      " + startDate.toLocaleTimeString() +
            " to " + endDate.toLocaleTimeString();
      }
    },
    getBreakText(breakData) {
      const startDate = new Date(breakData.start);
      let breakText = "";
      if (!breakData.end) {
        if (breakData.lunch) {
          breakText = breakText + "Active lunch break, started ";
        }
        else {
          breakText = breakText + "Active break, started ";
        }
        return breakText + startDate.toLocaleTimeString();
      }
      else {
        const endDate = new Date(breakData.end);
        if (breakData.lunch) {
          breakText = breakText + "Lunch break ";
        }
        else {
          breakText = breakText + "Break ";
        }
        return breakText + startDate.toLocaleTimeString() +
            " to " + endDate.toLocaleTimeString();
      }
    },
    setCurrentShift() {
      this.shifts.forEach(shift => {
        if (!shift.end) {
          this.currentShift = shift;
        }
      });
    },
    setCurrentBreak() {
      this.currentShift.breaks.forEach(b => {
        if (!b.end) {
          this.currentBreak = b;
        }
      });
    },
    async startShift() {
      const startShiftResponse = await ShiftService.startShift();
      if (startShiftResponse) {
        await this.getUserDetails();
      }
    },
    async startBreak() {
      const startBreakResponse = await BreakService.startBreak({lunch: false});
      if (startBreakResponse) {
        await this.getUserDetails();
      }
    },
    async startLunchBreak() {
      const startBreakResponse = await BreakService.startBreak({lunch: true});
      if (startBreakResponse) {
        await this.getUserDetails();
      }
    },
    async endBreak() {
      const endBreakResponse = await BreakService.endBreak();
      if (endBreakResponse) {
        await this.getUserDetails();
      }
    },
    async endShift() {
      const endShiftResponse = await ShiftService.endShift();
      if (endShiftResponse) {
        await this.getUserDetails();
      }
    }
  }
}
</script>
