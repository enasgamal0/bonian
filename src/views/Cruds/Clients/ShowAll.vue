<template>
  <div class="show_all_content_wrapper">
    <!-- Start:: Main Section -->
    <main>
      <!--  =========== Start:: Filter Form =========== -->
      <div
        class="filter_content_wrapper"
        :class="{ active: filterFormIsActive }"
      >
        <button
          class="filter_toggler"
          @click="filterFormIsActive = !filterFormIsActive"
        >
          <i class="fal fa-times"></i>
        </button>
        <div class="filter_title_wrapper">
          <h5>{{ $t("TITLES.searchBy") }}</h5>
        </div>
        <div class="filter_form_wrapper">
          <form @submit.prevent="submitFilterForm">
            <div class="row justify-content-center align-items-center w-100">
              <!-- Start:: Name Input -->
              <base-input
                col="4"
                type="text"
                :placeholder="$t('PLACEHOLDERS.client_name')"
                v-model.trim="filterOptions.client_name"
              />
              <!-- End:: Name Input -->

              <!-- Start:: Phone Input -->
              <base-input
                col="4"
                type="tel"
                :placeholder="$t('PLACEHOLDERS.email')"
                v-model.trim="filterOptions.email"
              />
              <!-- End:: Phone Input -->

              <!-- Start:: Status Input -->
              <base-select-input
                col="4"
                :optionsList="countries"
                :placeholder="$t('PLACEHOLDERS.country')"
                v-model="filterOptions.country"
              />
              <base-select-input
                col="4"
                :optionsList="country_sections"
                :placeholder="$t('PLACEHOLDERS.country_section')"
                v-model="filterOptions.country_section"
              />
              <base-select-input
                col="4"
                :optionsList="activeStatuses"
                :placeholder="$t('PLACEHOLDERS.status')"
                v-model="filterOptions.isActive"
              />
              <!-- End:: Status Input -->
            </div>

            <div class="btns_wrapper">
              <a-tooltip placement="bottom">
                <template slot="title">
                  <span>{{ $t("BUTTONS.search") }}</span>
                </template>
                <span
                  class="submit_btn"
                  @click="submitFilterForm"
                  :disabled="isWaitingRequest"
                >
                  <i class="fal fa-search"></i>
                </span>
              </a-tooltip>

              <a-tooltip placement="bottom">
                <template slot="title">
                  <span>{{ $t("BUTTONS.rseet_search") }}</span>
                </template>
                <span
                  class="reset_btn"
                  :disabled="isWaitingRequest"
                  @click="resetFilter"
                >
                  <i class="fal fa-redo"></i>
                </span>
              </a-tooltip>
            </div>
          </form>
        </div>
      </div>
      <!--  =========== End:: Filter Form =========== -->

      <!--  =========== Start:: Table Title =========== -->
      <div class="table_title_wrapper">
        <div class="title_text_wrapper">
          <h5>{{ $t("SIDENAV.Clients.title") }}</h5>
          <button
            v-if="!filterFormIsActive"
            class="filter_toggler"
            @click.stop="filterFormIsActive = !filterFormIsActive"
          >
            <i class="fal fa-search"></i>
          </button>
        </div>
        <div class="title_route_wrapper" v-if="$can('clients create', 'clients')">
          <router-link to="/clients/create">
            {{ $t("TITLES.addClient") }}
          </router-link>
        </div>
      </div>
      <!--  =========== End:: Table Title =========== -->

      <!--  =========== Start:: Data Table =========== -->
      <v-data-table
        class="thumb"
        :loading="loading"
        :loading-text="$t('TABLES.loadingData')"
        :search="searchValue"
        :headers="tableHeaders"
        :items="tableRows"
        item-class="ltr"
        :items-per-page="paginations.items_per_page"
        hide-default-footer
      >
        <!-- Start:: No Data State -->
        <template v-slot:no-data>
          {{ $t("TABLES.noData") }}
        </template>
        <!-- Start:: No Data State -->

        <template v-slot:[`item.id`]="{ item, index }">
          <div class="table_image_wrapper">
            <h6 class="text-danger" v-if="!item.id">
              {{ $t("TABLES.noData") }}
            </h6>
            <p v-else>
              {{
                (paginations.current_page - 1) * paginations.items_per_page +
                index +
                1
              }}
            </p>
          </div>
        </template>

        <!-- Start:: Name -->
        <template v-slot:[`item.name`]="{ item }">
          <h6 class="text-danger" v-if="!item.name">
            {{ $t("TABLES.noData") }}
          </h6>
          <h6 v-else>{{ item.name }}</h6>
        </template>
        <!-- End:: Name -->

        <!-- Start:: city -->
        <template v-slot:[`item.city.name`]="{ item }">
          <h6 class="text-danger" v-if="!item.city?.name">
            {{ $t("TABLES.noData") }}
          </h6>
          <h6 v-else>{{ item.city?.name }}</h6>
        </template>
        <!-- End:: Name -->

        <!-- Start:: email -->
        <template v-slot:[`item.email`]="{ item }">
          <h6 class="text-danger" v-if="!item.email">-</h6>
          <h6 v-else>{{ item.email }}</h6>
        </template>
        <!-- End:: email -->

        <template v-slot:[`item.is_vip`]="{ item }">
          <v-chip
            :color="item.is_vip ? 'green' : 'red'"
            text-color="white"
            small
          >
            <template v-if="item.is_vip">
              {{ $t("SIDENAV.Clients.vip") }}
            </template>
            <template v-else>
              {{ $t("SIDENAV.Clients.not_vip") }}
            </template>
          </v-chip>
        </template>

        <!-- Start:: Activation Status -->
        <template v-slot:[`item.is_active`]="{ item }">
          <span class="text-success text-h5" v-if="item.is_active">
            <i class="far fa-check"></i>
          </span>
          <span class="text-danger text-h5" v-else>
            <i class="far fa-times"></i>
          </span>
        </template>
        <!-- End:: Activation Status -->

        <!-- Start:: Actions -->
        <template v-slot:[`item.actions`]="{ item }">
          <div class="actions">
            <a-tooltip placement="bottom" v-if="$can('clients delete', 'clients')">
              <template slot="title">
                <span>{{ $t("BUTTONS.delete") }}</span>
              </template>
              <button class="btn_delete" @click="selectDeleteItem(item)">
                <i class="fal fa-trash-alt"></i>
              </button>
            </a-tooltip>
            <a-tooltip placement="bottom" v-if="$can('clients edit', 'clients')">
              <template slot="title">
                <span>{{ $t("BUTTONS.edit") }}</span>
              </template>

              <button class="btn_edit" @click="editItem(item)">
                <i class="fal fa-edit"></i>
              </button>
            </a-tooltip>
            <a-tooltip
              placement="bottom"
              v-if="$can('clients show', 'clients')"
            >
              <template slot="title">
                <span>{{ $t("BUTTONS.show") }}</span>
              </template>
              <button class="btn_show" @click="showItem(item)">
                <i class="fal fa-eye"></i>
              </button>
            </a-tooltip>

            <!-- <a-tooltip placement="bottom" v-if="$can('clients edit', 'clients')">
              <template slot="title">
                <span>{{ $t("BUTTONS.user_wallet") }}</span>
              </template>
              <button class="btn_show" @click="openWalletModal(item)">
                <i class="fal fa-wallet"></i>
              </button>
            </a-tooltip> -->

            <!-- <template v-else>
              <i class="fal fa-lock-alt fs-5 blue-grey--text text--darken-1"></i>
            </template> -->

            <template v-if="$can('clients activate', 'clients')">
              <a-tooltip placement="bottom" v-if="!item.is_active">
                <template slot="title">
                  <span>{{ $t("BUTTONS.activate") }}</span>
                </template>
                <button
                  class="btn_activate"
                  @click="HandlingItemActivationStatus(item)"
                >
                  <i class="fad fa-check-circle"></i>
                </button>
              </a-tooltip>
              <a-tooltip placement="bottom" v-else>
                <template slot="title">
                  <span>{{ $t("BUTTONS.deactivate") }}</span>
                </template>
                <button
                  class="btn_deactivate"
                  @click="selectDeactivateItem(item)"
                >
                  <i class="fad fa-times-circle"></i>
                </button>
              </a-tooltip>
            </template>
          </div>
        </template>
        <!-- End:: Actions -->

        <!-- ======================== Start:: Dialogs ======================== -->
        <template v-slot:top>
          <!-- Start:: Deactivate Modal -->
          <v-dialog v-model="dialogDeactivate">
            <v-card>
              <v-card-title
                class="text-h5 justify-center"
                v-if="itemToChangeActivationStatus"
              >
                {{
                  $t("TITLES.DeactivateConfirmingMessage", {
                    name: itemToChangeActivationStatus.name,
                  })
                }}
              </v-card-title>

              <form class="w-100">
                <base-input
                  col="12"
                  rows="3"
                  type="textarea"
                  :placeholder="$t('PLACEHOLDERS.deactivateReason')"
                  v-model.trim="deactivateReason"
                  required
                />
              </form>

              <v-card-actions>
                <v-btn
                  class="modal_confirm_btn"
                  @click="HandlingItemActivationStatus"
                  :disabled="!!!deactivateReason || deactivateReason?.length < 3"
                >
                  {{ $t("BUTTONS.ok") }}
                </v-btn>

                <v-btn
                  class="modal_cancel_btn"
                  @click="dialogDeactivate = false"
                  >{{ $t("BUTTONS.cancel") }}</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- End:: Deactivate Modal -->
           <!-- Start:: Wallet Modal -->
          <v-dialog v-model="user_wallet_modal">
            <v-card>
              <v-card-title class="text-h5 justify-center">
                {{
                  $t("PLACEHOLDERS.change_balance")
                }}
              </v-card-title>
              <div class="w-100">
                <div class="mt-3">
                  <div>
                      <p class="font-weight-bold mx-1" style="font-size: 16px;">{{ $t("SIDENAV.Clients.user_balance") }}: {{ balance }} {{ $t("PLACEHOLDERS.riyal") }} </p>
                      <div class="mt-5">
                      <p class="font-weight-bold mx-1 d-inline-block" style="font-size: 16px;">{{ $t("SIDENAV.Clients.charge_amout") }} </p>
                        <input
                        type="number"
                        class="bg-white rounded mx-3 p-2 w-25"
                        v-model="charge_amout"
                      />
                      <p class="d-inline-block">{{ $t('PLACEHOLDERS.riyal') }}</p>
                      </div>
                      <div class="mt-5">
                        <p style="font-size: 16px;" class="font-weight-bold mx-1 d-inline-block">{{ $t("SIDENAV.Clients.note2") }} ({{ $t("PLACEHOLDERS.optional") }}): </p>
                        <input
                          type="text"
                          class="bg-white rounded mx-3 p-2 w-75 mt-2"
                          v-model="note"
                        />
                      </div>
                      <div class="text-center mt-5">
                        <v-btn style="font-size: 16px;" class="modal_confirm_btn mx-1 bg-success text-white" @click="changeBalance()" :disabled="button_waiting">{{$t("BUTTONS.save")}}</v-btn>
                        <v-btn style="font-size: 16px;" class="modal_confirm_btn mx-1 bg-danger text-white" @click="closeWalletModal()">{{$t("BUTTONS.cancel")}}</v-btn>
                      </div>
                    </div>
                </div>
              </div>
            </v-card>
          </v-dialog>
          <!-- End:: Wallet Modal -->
          <!-- Start:: Delete Modal -->
          <v-dialog v-model="dialogDelete">
            <v-card>
              <v-card-title class="text-h5 justify-center" v-if="itemToDelete">
                {{
                  $t("TITLES.DeleteConfirmingMessage", {
                    name: itemToDelete.name,
                  })
                }}
              </v-card-title>
              <v-card-actions>
                <v-btn class="modal_confirm_btn" @click="confirmDeleteItem">{{
                  $t("BUTTONS.ok")
                }}</v-btn>

                <v-btn class="modal_cancel_btn" @click="dialogDelete = false">{{
                  $t("BUTTONS.cancel")
                }}</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- End:: Delete Modal -->
        </template>
        <!-- ======================== End:: Dialogs ======================== -->
      </v-data-table>
      <!--  =========== End:: Data Table =========== -->
    </main>
    <!-- End:: Main Section -->

    <!-- Start:: Pagination -->
    <template>
      <div class="pagination_container text-center mt-3 mb-0">
        <v-pagination
          class="py-0"
          square
          v-model="paginations.current_page"
          :length="paginations.last_page"
          :total-visible="6"
          @input="updateRouterQueryParam($event)"
          :prev-icon="
            getAppLocale == 'ar' ? 'fal fa-angle-right' : 'fal fa-angle-left'
          "
          :next-icon="
            getAppLocale == 'ar' ? 'fal fa-angle-left' : 'fal fa-angle-right'
          "
        />
      </div>
    </template>
    <!-- End:: Pagination -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AllClients",

  computed: {
    ...mapGetters({
      getAppLocale: "AppLangModule/getAppLocale",
    }),

    activeStatuses() {
      return [
        {
          id: 1,
          name: this.$t("STATUS.active"),
          value: 1,
        },
        {
          id: 2,
          name: this.$t("STATUS.notActive"),
          value: 0,
        },
      ];
    },
  },

  data() {
    return {
      // Start:: Loading Data
      loading: false,
      isWaitingRequest: false,
      // End:: Loading Data

      // Start:: Filter Data
      filterFormIsActive: false,
      filterOptions: {
        client_name: null,
        email: null,
        country: null,
        country_section: null,
        isActive: null,
      },
      // End:: Filter Data

      // Start:: Table Data
      searchValue: "",
      tableHeaders: [
        {
          text: this.$t("TABLES.Clients.serialNumber"),
          value: "id",
          align: "center",
          width: "80",
          sortable: false,
        },
        {
          text: this.$t("PLACEHOLDERS.client_name"),
          value: "name",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("TABLES.Clients.phone"),
          value: "mobile",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("PLACEHOLDERS.email"),
          value: "email",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("PLACEHOLDERS.country"),
          value: "country_id.name",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("PLACEHOLDERS.country_section"),
          value: "section_id.name",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("TABLES.Clients.joiningDate"),
          value: "created_at",
          align: "center",
          sortable: false,
        },
        // {
        //   text: this.$t("SIDENAV.Clients.is_vip"),
        //   value: "is_vip",
        //   align: "center",
        //   sortable: false,
        // },
        {
          text: this.$t("TABLES.Clients.active"),
          value: "is_active",
          align: "center",
          width: "120",
          sortable: false,
        },
        {
          text: this.$t("TABLES.Clients.actions"),
          value: "actions",
          sortable: false,
          align: "center",
        },
      ],
      tableRows: [],
      countries: [],
      country_sections: [],
      // End:: Table Data

      // Start:: Pagination Data
      paginations: {
        current_page: 1,
        last_page: 1,
        items_per_page: 6,
      },
      // End:: Pagination Data

      dialogDeactivate: false,
      itemToChangeActivationStatus: null,
      deactivateReason: null,
      dialogDelete: false,
      itemToDelete: null,
      dialogBalance: false,
      itemToBalance: null,
      user_wallet_modal: false,
      button_waiting: false,
      balance: null,
      charge_amout: null,
      note: null,
      item_id: null,
    };
  },

  watch: {
    // Start:: Page Query Param Watcher To Get Page Data Based On It's Change
    ["$route.query.page"]() {
      this.paginations.current_page = +this.$route.query.page;
      this.setTableRows();
    },
    // End:: Page Query Param Watcher To Get Page Data Based On It's Change
  },

  methods: {
    // ===== Start:: Delete
    selectDeleteItem(item) {
      this.dialogDelete = true;
      this.itemToDelete = item;
    },

    async confirmDeleteItem() {
      try {
        await this.$axios({
          method: "DELETE",
          url: `clients/${this.itemToDelete.id}`,
        });
        this.dialogDelete = false;
        this.setTableRows();
        this.$message.success(this.$t("MESSAGES.deletedSuccessfully"));
      } catch (error) {
        this.dialogDelete = false;
        this.$message.error(error.response.data.message);
      }
    },
    // ===== End:: Delete
    // ===== Start:: End
    editItem(item) {
      this.$router.push({ path: `/clients/edit/${item.id}` });
    },
    showItem(item) {
      this.$router.push({ path: `/clients/show/${item.id}` });
    },
    // ===== End:: End
    // Start:: Handel Filter
    async submitFilterForm() {
      if (this.$route.query.page !== "1") {
        await this.$router.push({ path: "/clients/all", query: { page: 1 } });
      }
      this.setTableRows();
    },
    async resetFilter() {
      this.filterOptions.client_name = null;
      this.filterOptions.email = null;
      this.filterOptions.country = null;
      this.filterOptions.country_section = null;
      this.filterOptions.isActive = null;
      if (this.$route.query.page !== "1") {
        await this.$router.push({ path: "/clients/all", query: { page: 1 } });
      }
      this.setTableRows();
    },
    // End:: Handel Filter

    // Start:: User Wallet Modal
    openWalletModal(item){
      this.user_wallet_modal = true;
      this.balance = item.balance;
      this.note = item.note;
      this.item_id = item.id;
    },
    closeWalletModal() {
      this.user_wallet_modal = false;
    },
    async changeBalance(){
      this.button_waiting = true;
      const REQUEST_DATA = new FormData();
      if (this.charge_amout) {
        REQUEST_DATA.append("amount", this.charge_amout);
      }
      if (this.note) {
        REQUEST_DATA.append("notes", this.note);
      }
      try {
        await this.$axios({
          method: "POST",
          url: `clients/update-wallet/${this.item_id}`,
          data: REQUEST_DATA,
        });
        this.user_wallet_modal = false;
        this.button_waiting = false;
        this.charge_amout = null;
        this.setTableRows();
        this.$message.success(this.$t("MESSAGES.editedSuccessfully"));
      } catch (error) {
        this.button_waiting = false;
        this.$message.error(error.response.data.message);
      }
    },
    // End:: User Wallet Modals

    // Start:: Set Table Rows
    updateRouterQueryParam(pagenationValue) {
      this.$router.push({
        query: {
          ...this.$route.query,
          page: pagenationValue,
        },
      });

      // Scroll To Screen's Top After Get Products
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    },

    async getCountries() {
      this.loading = true;
      try {
        let res = await this.$axios({
          method: "GET",
          url: `/countries?page=0&limit=0&is_active=1&ignorePermissionCheck=1`,
        });

        this.countries = res.data.data.data;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    async getCountry_sections() {
      this.loading = true;
      try {
        let res = await this.$axios({
          method: "GET",
          url: `/sections?page=0&limit=0&is_active=1&ignorePermissionCheck=1`,
        });

        this.country_sections = res.data.data.data;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },

    async setTableRows() {
      this.loading = true;
      try {
        let nameParam = this.filterOptions.client_name;
        if (!nameParam) {
          nameParam = null;
        }

        let res = await this.$axios({
          method: "GET",
          url: "clients?status=accepted",
          params: {
            page: this.paginations.current_page,
            name: nameParam,
            email: this.filterOptions.email,
            country_id: this.filterOptions.country?.id,
            section_id: this.filterOptions.country_section?.id,
            is_active: this.filterOptions.isActive?.value,
          },
        });
        this.loading = false;
        // console.log("All Data ==>", res.data.data);
        this.tableRows = res.data.data.data;
        this.paginations.last_page = res.data.data.meta.last_page;
        this.paginations.items_per_page = res.data.data.meta.per_page;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    // End:: Set Table Rows

    // Start:: Change Activation Status
    async changeActivationStatus(item) {
      try {
        await this.$axios({
          method: "POST",
          url: `clients/toggle-status/${item.id}`,
        });
        this.setTableRows();
        this.$message.success(this.$t("MESSAGES.changeActivation"));
      } catch (error) {
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Change Activation Status

    // ==================== Start:: Crud ====================
    // ===== Start:: Show
    showItem(item) {
      this.$router.push({ path: `/clients/show/${item.id}` });
    },
    // ===== End:: Show

    // ===== Start:: Handling Activation & Deactivation
    selectDeactivateItem(item) {
      this.dialogDeactivate = true;
      this.itemToChangeActivationStatus = item;
    },
    async HandlingItemActivationStatus(selectedItem) {
      this.dialogDeactivate = false;
      let targetItem = this.itemToChangeActivationStatus
        ? this.itemToChangeActivationStatus
        : selectedItem;
      const REQUEST_DATA = {};
      // Start:: Append Request Data
      REQUEST_DATA.reason = this.deactivateReason;
      // Start:: Append Request Data
      try {
        await this.$axios({
          method: "POST",
          url: `clients/toggle-status/${targetItem.id}`,
          data: REQUEST_DATA,
        });
        this.$message.success(this.$t("MESSAGES.changeActivation"));
        this.setTableRows();
        this.itemToChangeActivationStatus = null;
        this.deactivateReason = null;
      } catch (error) {
        this.$message.error(error.response.data.message);
      }
    },
    // ===== End:: Handling Activation & Deactivation

    selectAcceptItem(item) {
      this.dialogBalance = true;
      this.itemToBalance = item;
    },
    async confirmAcceptItem(item) {
      const REQUEST_DATA = new FormData();
      REQUEST_DATA.append("balance", this.balance_package);
      // REQUEST_DATA.append("_method", "PUT");

      try {
        await this.$axios({
          method: "POST",
          url: `change-client-balance/${this.itemToBalance.id}`,
          data: REQUEST_DATA,
        });
        this.dialogBalance = false;
        (this.balance_package = null), this.setTableRows();
        this.$message.success(this.$t("MESSAGES.verifiedSuccessfully"));
      } catch (error) {
        this.dialogBalance = false;
        this.$message.error(error.response.data.message);
      }
    },
    // ==================== End:: Crud ====================
  },

  created() {
    // Start:: Fire Methods
    window.addEventListener("click", () => {
      this.filterFormIsActive = false;
    });
    if (this.$route.query.page) {
      this.paginations.current_page = +this.$route.query.page;
    }
    this.setTableRows();
    this.getCountries();
    this.getCountry_sections();
    // End:: Fire Methods
  },
};
</script>
<style>
span.submit_btn {
  width: 45px;
  height: 45px;
  font-size: 16px;
  border-radius: 10px;
  color: var(--white_clr);
  transition: all 0.3s linear;
  background-color: #f6a513;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
