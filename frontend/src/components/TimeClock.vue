<template>
  <v-row no-gutters>
    <v-col cols="12" sm="6">
      <h3 v-if="isAdmin">Shift history for admin user #{{this.userid}}, {{this.username}}.</h3>
      <h3 v-else>Shift history for user #{{this.userid}}, {{this.username}}.</h3>
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
              <v-list-item-title style="margin-left: 40px">{{getBreakText(shiftBreak)}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-col>
    <v-col cols="6" sm="4">
      <div v-if="currentShift" style="margin-top: 10px">
        <b>Shift in progress, started: {{this.formatDateTime(this.currentShift.start)}}</b>
        <div v-if="currentBreak" style="margin-top: 10px">
          <b>{{this.currentBreakTypeString()}} in progress, started: {{this.formatDateTime(this.currentBreak.start)}}</b>
          <div id="button-group">
            <v-btn class = "clock-button" @click="endBreak">End break</v-btn>
          </div>
        </div>
        <div v-else id="button-group">
          <v-btn class="clock-button" @click="startBreak">Start break</v-btn>
          <v-btn class="clock-button" @click="startLunchBreak">Start lunch break</v-btn>
          <v-btn class="clock-button" @click="endShift">End shift</v-btn>
        </div>
      </div>
      <div v-else id="button-group">
        <v-btn class="clock-button" @click="startShift">Start shift</v-btn>
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
  computed: {
    isAdmin() {
      return this.$cookies.get('admin') === 'true';
    }
  },
  methods: {
    async getUserDetails() {
      this.currentShift = null;
      this.currentBreak = null;
      if (this.userid !== -1) {
        const userDetailsResponse = await UserService.getUserDetails(this.userid);
        this.shifts = userDetailsResponse.data.shifts;
        this.shifts.sort((a, b) => {
          return new Date(b.start) - new Date(a.start);
        });
        this.setCurrentShift();
        if (this.currentShift) {
          this.setCurrentBreak();
        }
      }
    },
    getShiftText(shiftData) {
      const startDate = new Date(shiftData.start);
      if (!shiftData.end) {
        return "Active shift, started " + startDate.toLocaleTimeString() +
            ", " + shiftData.breaks.length + " breaks";
      }
      else {
        const endDate = new Date(shiftData.end);
        return startDate.toLocaleDateString("en-US") + " Shift " + startDate.toLocaleTimeString() +
            " to " + endDate.toLocaleTimeString() + ", " + shiftData.breaks.length + " breaks";
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
    formatDateTime(dt) {
      dt = new Date(dt);
      return dt.toLocaleDateString("en-US") + " at " + dt.toLocaleTimeString();
    },
    currentBreakTypeString() {
      if (this.currentBreak.lunch) {
        return "Lunch break";
      }
      return "Break";
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

<style scoped>
#button-group {
  margin-top: 20px
}
.clock-button {
  margin-left: 20px
}
</style>