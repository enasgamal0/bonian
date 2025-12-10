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
              <base-input
                col="4"
                type="text"
                :placeholder="$t('PLACEHOLDERS.client-name')"
                v-model.trim="filterOptions.user_name"
              />

              <base-input
                col="4"
                type="text"
                :placeholder="$t('PLACEHOLDERS.provider_name')"
                v-model.trim="filterOptions.provider_name"
              />

              <base-select-input
                col="4"
                :placeholder="$t('PLACEHOLDERS.rating_stars')"
                v-model="filterOptions.rate"
                :optionsList="[
                  { id: 1, value: 1, name: '1' },
                  { id: 2, value: 2, name: '2' },
                  { id: 3, value: 3, name: '3' },
                  { id: 4, value: 4, name: '4' },
                  { id: 5, value: 5, name: '5' },
                ]"
              />

              <base-picker-input
                col="6"
                type="date"
                :placeholder="$t('PLACEHOLDERS.data_from')"
                v-model.trim="filterOptions.from_date"
              />

              <base-picker-input
                col="6"
                type="date"
                :placeholder="$t('PLACEHOLDERS.data_to')"
                v-model.trim="filterOptions.to_date"
              />
            </div>

            <div class="btns_wrapper">
              <button class="submit_btn" :disabled="isWaitingRequest">
                <i class="fal fa-search"></i>
              </button>
              <button
                class="reset_btn"
                type="button"
                :disabled="isWaitingRequest"
                @click="resetFilter"
              >
                <i class="fal fa-redo"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
      <!--  =========== End:: Filter Form =========== -->

      <!--  =========== Start:: Table Title =========== -->
      <div class="table_title_wrapper">
        <div class="title_text_wrapper">
          <h5>{{ $t("SIDENAV.ProviderRates.title") }}</h5>
          <button
            v-if="!filterFormIsActive"
            class="filter_toggler"
            @click.stop="filterFormIsActive = !filterFormIsActive"
          >
            <i class="fal fa-search"></i>
          </button>
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

        <!-- Start:: User Name -->
        <template v-slot:[`item.user_name`]="{ item }">
          <h6 class="text-danger" v-if="!item.user_name">
            {{ $t("TABLES.noData") }}
          </h6>
          <h6 v-else>{{ item.user_name }}</h6>
        </template>
        <!-- End:: User Name -->

        <!-- Start:: User Mobile -->
        <template v-slot:[`item.user_mobile`]="{ item }">
          <h6 class="text-danger" v-if="!item.user_mobile">
            {{ $t("TABLES.noData") }}
          </h6>
          <h6 v-else>{{ item.user_mobile }}</h6>
        </template>
        <!-- End:: User Mobile -->

        <!-- Start:: Provider Name -->
        <template v-slot:[`item.provider_name`]="{ item }">
          <h6 class="text-danger" v-if="!item.provider_name">
            {{ $t("TABLES.noData") }}
          </h6>
          <h6 v-else>{{ item.provider_name }}</h6>
        </template>
        <!-- End:: Provider Name -->

        <!-- Start:: Rate -->
        <template v-slot:[`item.rate`]="{ item }">
          <h6 v-if="!item.rate">-</h6>
          <base-rate-input
            v-else
            :value="item.rate"
            :readonly="true"
            :size="24"
          />
        </template>
        <!-- End:: Rate -->

        <!-- Start:: Comment Preview -->
        <template v-slot:[`item.message`]="{ item }">
          <h6 v-if="!item.message">-</h6>
          <div class="actions" v-else>
            <button class="btn_show" @click="showCommentModal(item.message)">
              <i class="fal fa-file-alt"></i>
            </button>
          </div>
        </template>
        <!-- End:: Comment Preview -->

        <!-- Start:: Actions -->
        <template v-slot:[`item.actions`]="{ item }">
          <div class="actions">
            <a-tooltip placement="bottom" v-if="$can('rates show', 'rates')">
              <template slot="title">
                <span>{{ $t("BUTTONS.show") }}</span>
              </template>
              <button class="btn_show" @click="showItem(item)">
                <i class="fal fa-eye"></i>
              </button>
            </a-tooltip>
            <a-tooltip placement="bottom" v-if="!item.is_published">
              <template slot="title">
                <span>{{ $t("BUTTONS.publishRating") }}</span>
              </template>
              <button
                class="btn_activate"
                @click="publishRating(item)"
                :disabled="isWaitingRequest"
              >
                <i class="fal fa-check-circle"></i>
              </button>
            </a-tooltip>
            <a-tooltip placement="bottom">
              <template slot="title">
                <span>{{ $t("BUTTONS.delete") }}</span>
              </template>
              <button
                class="btn_delete"
                @click="selectDeleteRating(item)"
                :disabled="isWaitingRequest"
              >
                <i class="fal fa-trash-alt"></i>
              </button>
            </a-tooltip>
          </div>
        </template>
        <!-- End:: Actions -->

        <!-- ======================== Start:: Dialogs ======================== -->
        <template v-slot:top>
          <!-- Start:: Comment Modal -->
          <description-modal
            v-if="dialogComment"
            :modalIsOpen="dialogComment"
            :modalDesc="selectedCommentTextToShow"
            @toggleModal="dialogComment = !dialogComment"
          />
          <!-- End:: Comment Modal -->

          <!-- Start:: Delete Modal -->
          <v-dialog v-model="dialogDelete" max-width="500">
            <v-card>
              <v-card-title class="text-h5 justify-center">
                {{ $t("TITLES.DeleteProviderRate") }}
              </v-card-title>
              <v-card-text class="text-center">
                {{ $t("MESSAGES.deleteRatingConfirmation") }}
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="modal_confirm_btn" @click="confirmDeleteRating" :disabled="isWaitingRequest">
                  {{ $t("BUTTONS.yes") }}
                </v-btn>
                <v-btn class="modal_cancel_btn" @click="dialogDelete = false" :disabled="isWaitingRequest">
                  {{ $t("BUTTONS.cancel") }}
                </v-btn>
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
  name: "AllProviderRates",

  computed: {
    ...mapGetters({
      getAppLocale: "AppLangModule/getAppLocale",
    }),
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
        user_name: null,
        provider_name: null,
        rate: null,
        from_date: null,
        to_date: null,
      },
      // End:: Filter Data

      // Start:: Table Data
      searchValue: "",
      tableHeaders: [
        {
          text: this.$t("TABLES.ProviderRates.serialNumber"),
          value: "id",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("TABLES.ProviderRates.userName"),
          value: "user_name",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("TABLES.ProviderRates.userMobile"),
          value: "user_mobile",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("TABLES.ProviderRates.providerName"),
          value: "provider_name",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("PLACEHOLDERS.rating_stars"),
          value: "rate",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("TABLES.ProviderRates.comment"),
          value: "message",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("PLACEHOLDERS.created_at"),
          value: "created_at",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("TABLES.ProviderRates.actions"),
          value: "actions",
          sortable: false,
          align: "center",
        },
      ],
      tableRows: [],
      // End:: Table Data

      // Start:: Dialogs Control Data
      dialogComment: false,
      selectedCommentTextToShow: "",
      dialogDelete: false,
      itemToDelete: null,
      // End:: Dialogs Control Data

      // Start:: Pagination Data
      paginations: {
        current_page: 1,
        last_page: 1,
        items_per_page: 10,
      },
      // End:: Pagination Data
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
    // Start:: Handel Filter
    async submitFilterForm() {
      if (this.$route.query.page !== "1") {
        await this.$router.push({
          path: "/provider-rates/all",
          query: { page: 1 },
        });
      }
      this.setTableRows();
    },
    async resetFilter() {
      this.filterOptions.user_name = null;
      this.filterOptions.provider_name = null;
      this.filterOptions.rate = null;
      this.filterOptions.from_date = null;
      this.filterOptions.to_date = null;
      if (this.$route.query.page !== "1") {
        await this.$router.push({
          path: "/provider-rates/all",
          query: { page: 1 },
        });
      }
      this.setTableRows();
    },
    // End:: Handel Filter

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
    async setTableRows() {
      this.loading = true;
      try {
        let res = await this.$axios({
          method: "GET",
          url: "providerRates",
          params: {
            page: this.paginations.current_page,
            user_name: this.filterOptions.user_name,
            provider_name: this.filterOptions.provider_name,
            rate: this.filterOptions.rate?.value,
            date_from: this.filterOptions.from_date,
            date_to: this.filterOptions.to_date,
          },
        });
        this.loading = false;
        
        // Transform the data to match table structure
        const transformedData = res.data.data?.data?.map((item, index) => {
          return {
            id: item.id,
            user_name: item.user?.name || "-",
            user_mobile: item.user?.mobile || "-",
            provider_name: item.provider?.name || "-",
            rate: item.rate,
            message: item.message || null,
            created_at: item.created_at,
            order_id: item.order_id,
            order_serial: item.order?.serial_number || null,
            is_published: item.is_published || item.status === 'published' || false,
            // Keep original data for detail page
            originalData: item,
          };
        });

        this.tableRows = transformedData || [];
        this.paginations.last_page = res.data.data?.meta?.last_page || 1;
        this.paginations.items_per_page = res.data.data?.meta?.per_page || 10;
      } catch (error) {
        this.loading = false;
        console.log(error.response?.data?.message);
        this.$message.error(error.response?.data?.message || this.$t("MESSAGES.errorOccurred"));
      }
    },
    // End:: Set Table Rows

    // Start:: Control Modals
    showCommentModal(comment) {
      this.dialogComment = true;
      this.selectedCommentTextToShow = comment;
    },
    // End:: Control Modals

    // Start:: Truncate Comment
    truncateComment(comment) {
      if (!comment) return "-";
      return comment.length > 50 ? comment.substring(0, 50) + "..." : comment;
    },
    // End:: Truncate Comment

    // ==================== Start:: Crud ====================
    showItem(item) {
      this.$router.push({ path: `/provider-rates/show/${item.id}` });
    },

    // Start:: Publish Rating
    async publishRating(item) {
      this.isWaitingRequest = true;
      try {
        await this.$axios({
          method: "POST",
          url: `providerRates/${item.id}/publish`,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.ratingPublishedSuccessfully"));
        // Refresh table data
        this.setTableRows();
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(
          error?.response?.data?.message || this.$t("MESSAGES.errorOccurred")
        );
      }
    },
    // End:: Publish Rating

    // Start:: Delete Rating
    selectDeleteRating(item) {
      this.dialogDelete = true;
      this.itemToDelete = item;
    },
    async confirmDeleteRating() {
      if (!this.itemToDelete) return;
      this.isWaitingRequest = true;
      try {
        await this.$axios({
          method: "DELETE",
          url: `providerRates/${this.itemToDelete.id}`,
        });
        this.dialogDelete = false;
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.deletedSuccessfully"));
        // Refresh table data
        this.setTableRows();
        this.itemToDelete = null;
      } catch (error) {
        this.dialogDelete = false;
        this.isWaitingRequest = false;
        this.$message.error(
          error?.response?.data?.message || this.$t("MESSAGES.errorOccurred")
        );
        this.itemToDelete = null;
      }
    },
    // End:: Delete Rating
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
    // End:: Fire Methods
  },
};
</script>

<style scoped>
.comment_preview {
  margin-right: 10px;
  color: #666;
  font-size: 14px;
}
</style>

