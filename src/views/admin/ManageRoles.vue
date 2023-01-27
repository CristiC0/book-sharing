<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { User } from "@/types/User";
import ActionButton from "@/components/ActionButton.vue";
import { useFetch } from "@/helpers/useFetch";
import usePagination from "@/helpers/usePagination";
import PaginationComponent from "@/components/PaginationComponent.vue";
import ModalComponent from "@/components/ModalComponent.vue";
const allUsers = ref<User[]>([]);
const pagination = ref();
const selectedUser = ref<User>();

onMounted(async () => {
  const userList = await useFetch
    .getAuthorized("/api/users")
    .then((response) => response.json())
    .catch(console.error);

  allUsers.value = userList.users;
  pagination.value = usePagination(allUsers.value as object[], 12);
});

const assignRole = (role: string) => {
  useFetch.postAuthorized(`/api/user/${selectedUser.value?.id}/roles/${role}`);
  allUsers.value = allUsers.value.map((user) => {
    if (user.id === selectedUser.value?.id) return { ...user, role };
    else return user;
  });

  const { currentPage } = pagination.value;
  pagination.value = usePagination(allUsers.value as object[], 12);
  pagination.value.changePageNumber(currentPage);
};
</script>
<template>
  <div class="container-fluid container-md">
    <div class="row">
      <div class="col-12 col-lg-10 col-xl-7">
        <div class="table-responsive">
          <table class="table text-center align-middle">
            <thead>
              <tr class="border-bottom border-primary">
                <th scope="col" class="col-6">USERNAME</th>
                <th scope="col" class="col-3">ROLES</th>
                <th scope="col" class="col-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody v-if="pagination">
              <tr
                v-for="(user, index) in pagination.elementsOnCurrentPage"
                :key="index"
              >
                <th scope="row">{{ user.userName }}</th>
                <td>{{ user.role }}</td>
                <td>
                  <div class="d-flex gap-1 justify-content-center">
                    <ActionButton
                      v-if="user.role === 'User'"
                      :class="'btn-warning px-3 col-8'"
                      text="ASSIGN"
                      @click="selectedUser = user"
                      data-bs-toggle="modal"
                      data-bs-target="#giveAdmin"
                    />
                    <ActionButton
                      v-else-if="user.role === 'Administrator'"
                      :class="'btn-danger px-3 col-8'"
                      text="REMOVE"
                      @click="selectedUser = user"
                      data-bs-toggle="modal"
                      data-bs-target="#revokeAdmin"
                    />
                    <span v-else
                      >super-admin role cannot be removed, please contact
                      technical support.</span
                    >
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <PaginationComponent
          v-if="pagination"
          :current-page="pagination.currentPage"
          :pageNumbers="pagination.pages"
          :nrOfPages="pagination.nrOfPages"
          :next="pagination.nextPage"
          :prev="pagination.previousPage"
          @changePageNumber="pagination?.changePageNumber"
        />
      </div>
    </div>
  </div>

  <ModalComponent name="revokeAdmin">
    <template v-slot:title>Confirm </template>
    <template v-slot:body
      >Are you sure you want to revoke the Admin rights of the user
      {{ selectedUser?.userName }}?
    </template>
    <template v-slot:footer>
      <button
        class="btn btn-success"
        data-bs-dismiss="modal"
        @click="assignRole('User')"
      >
        Yes
      </button>
      <button class="btn btn-danger" data-bs-dismiss="modal">No</button>
    </template>
  </ModalComponent>
  <ModalComponent name="giveAdmin">
    <template v-slot:title>Confirm </template>
    <template v-slot:body
      >Are you sure you want to give the Admin rights to the user
      {{ selectedUser?.userName }}?
    </template>
    <template v-slot:footer>
      <button
        class="btn btn-success"
        data-bs-dismiss="modal"
        @click="assignRole('Administrator')"
      >
        Yes
      </button>
      <button class="btn btn-danger" data-bs-dismiss="modal">No</button>
    </template>
  </ModalComponent>
</template>
