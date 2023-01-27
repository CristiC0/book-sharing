<script setup lang="ts">
import { ref } from "vue";
import ManageRoles from "@/views/admin/ManageRoles.vue";
import AddAuthors from "./AddAuthors.vue";
import ApproveAssignments from "./ApproveAssignments.vue";
const selectedIndex = ref(0);
const tabs = [
  "Manage Roles",
  "Approve Assignmets",
  "Add authors",
  "Delete Reviews",
];

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
    >
      <ManageRoles />
    </div>
    <div
      class="tab-pane fade show"
      :class="{ active: 1 === selectedIndex }"
      :id="tabs[1]"
      role="tabpanel"
    >
      <ApproveAssignments />
    </div>
    <div
      class="tab-pane fade show"
      :class="{ active: 2 === selectedIndex }"
      :id="tabs[2]"
      role="tabpanel"
    >
      <AddAuthors />
    </div>
  </div>
</template>
<style scoped></style>
