<script setup lang="ts">
import { ref } from "vue";
import MyBooks from "./MyBooks.vue";
import WantedBooks from "./WantedBooks.vue";
import MyAssignments from "./MyAssignments.vue";
import UploadBook from "./UploadBook.vue";
import { useProfileStore } from "@/stores/ProfileStore";
const selectedIndex = ref(0);
const tabs = [
  "My Profile",
  "My Books",
  "My Assignments",
  "Wanted Books",
  "Upload Book",
];

const profileStore = useProfileStore();
await profileStore.fetchProfile();

const setSelectedIndex = (index: number) => {
  selectedIndex.value = index;
};
</script>
<template>
  <ul class="nav nav-tabs" role="tablist">
    <li
      class="nav-item"
      role="presentation"
      v-for="(tab, index) in tabs"
      :key="index"
    >
      <a
        class="nav-link"
        :class="index === selectedIndex ? 'active' : ''"
        data-bs-toggle="tab"
        :href="`#${tab}`"
        @click="setSelectedIndex(index)"
        aria-selected="true"
        role="tab"
        >{{ tab }}</a
      >
    </li>
  </ul>
  <div id="myTabContent" class="tab-content">
    <div
      class="tab-pane fade show"
      :class="{ active: 0 === selectedIndex }"
      :id="tabs[0]"
      role="tabpanel"
    ></div>
    <div
      class="tab-pane fade show"
      :class="{ active: 1 === selectedIndex }"
      :id="tabs[1]"
      role="tabpanel"
    >
      <MyBooks @click="setSelectedIndex(4)" />
    </div>
    <div
      class="tab-pane fade show"
      :class="{ active: 2 === selectedIndex }"
      :id="tabs[2]"
      role="tabpanel"
    >
      <MyAssignments />
    </div>
    <div
      class="tab-pane fade show"
      :class="{ active: 3 === selectedIndex }"
      :id="tabs[3]"
      role="tabpanel"
    >
      <WantedBooks />
    </div>
    <div
      class="tab-pane fade show"
      :class="{ active: 4 === selectedIndex }"
      :id="tabs[4]"
      role="tabpanel"
    >
      <UploadBook @close="setSelectedIndex(1)" />
    </div>
  </div>
</template>
<style scoped></style>
