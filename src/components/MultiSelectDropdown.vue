<script setup lang="ts">
import { ref } from "vue";
import type { IEnumList } from "@/types/EnumList";
type PropsType = {
  class?: string;
  defaultMessage: string;
  list: IEnumList[];
  required?: boolean;
  error?: boolean;
};

const props = defineProps<PropsType>();
const emits = defineEmits(["getSelectedList"]);

const listComponent = ref();
const selectedContent = ref<string>(props.defaultMessage);
const showDropdownList = ref(false);
const selectedListIds = ref<string[]>([]);
const toggleDropdown = () => {
  showDropdownList.value = !showDropdownList.value;

  if (showDropdownList.value) (listComponent.value as HTMLElement).focus();
};

const selectOption = (selectedItem: IEnumList) => {
  generateListWithSelectedItems(selectedItem);
  generateTextWithSelectedItems();

  emits("getSelectedList", selectedListIds.value);
};

const generateListWithSelectedItems = (selectedItem: IEnumList) => {
  if (selectedListIds.value.includes(selectedItem.id))
    selectedListIds.value = selectedListIds.value.filter(
      (id) => selectedItem.id !== id
    );
  else selectedListIds.value.push(selectedItem.id);
};

const generateTextWithSelectedItems = (list: IEnumList[] = props.list) => {
  selectedContent.value = list.reduce((list: string, item: IEnumList) => {
    if (selectedListIds.value.includes(item.id))
      return `${list} ${list ? ", " + item.name : item.name}`;
    return list;
  }, "");

  if (selectedContent.value === "")
    selectedContent.value = props.defaultMessage;
};

defineExpose({
  clearSelected: () => {
    selectedListIds.value = [];
    selectedContent.value = props.defaultMessage;
  },

  setDefaultValue: (list: string[], allList: IEnumList[]) => {
    selectedListIds.value = list;
    generateTextWithSelectedItems(allList);
  },
});
</script>
<template>
  <div>
    <div :class="props.class">
      <button
        type="button"
        class="form-control form-select d-flex position-relative"
        :class="{
          'border border-danger is-invalid': props.error,
        }"
        @click="toggleDropdown"
      >
        <span> {{ selectedContent }}</span>
      </button>
      <div
        tabindex="0"
        ref="listComponent"
        @focusout="showDropdownList = false"
      >
        <ul
          class="form-control position-absolute p-0 py-1"
          v-show="showDropdownList"
        >
          <li
            v-for="(item, index) in list"
            :key="index"
            class="p-2"
            @click="selectOption(item)"
            :class="{ active: selectedListIds.includes(item.id) }"
          >
            <span> {{ item.name }}</span>
          </li>
        </ul>
      </div>
      <div class="invalid-feedback" v-if="props.error">
        Select at least a value
      </div>
    </div>
    <div class="invalid-feedback" v-if="props.error">
      Select at least a value
    </div>
  </div>
</template>

<style scoped>
button span {
  overflow: hidden;
  white-space: nowrap;
}

ul {
  list-style: none;
  max-height: 10.5rem;
  z-index: 1;
  border: 0.5px solid #55595c;
  border-radius: 5px;
  white-space: 90%;
  box-shadow: 0 0 2px #55595c;
  cursor: default;
  overflow: auto;
}

li:hover {
  background-color: #e0e0e6;
}
li span::before {
  content: "";
  display: inline-block;
  position: relative;
  height: 20px;
  width: 20px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  background-color: transparent;
  margin-right: 15px;
  vertical-align: middle;
}
li span {
  width: max-content;
  display: flex;
  align-items: center;
}
li.active ::before {
  content: url("@/assets/icons/checkmark.svg");
  background-color: black;
  border: 0;
  display: inline-block;
  padding: 0;
  line-height: 1.2;
}
</style>
