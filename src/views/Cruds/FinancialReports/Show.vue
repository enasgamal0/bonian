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
        
      </div>
      <!--  =========== End:: Filter Form =========== -->

      <!--  =========== Start:: Table Title =========== -->
      <div class="col-12 text-end">
      <v-btn @click="$router.go(-1)" style="color: #1b706f">
        <i class="fas fa-backward"></i>
      </v-btn>
    </div>
      <div class="table_title_wrapper">
        <div class="title_text_wrapper">
          <h5>
            {{ $t("PLACEHOLDERS.financial_reports_provider") }}: {{ provider_name }}
          </h5>
          <button
            v-if="!filterFormIsActive"
            class="filter_toggler"
            @click.stop="filterFormIsActive = !filterFormIsActive"
          >
            <i class="fal fa-search"></i>
          </button>
        </div>
        

        <div class="title_route_wrapper">
          <base-button
            class="mt-0 excel_btn"
            styleType="solid_btn"
            :btnText="$t('BUTTONS.downloadExcel')"
            @fireClick="downloadExcelAllData"
            :disabled="excelDownloadBtnIsLoading"
          >
            <template v-slot:btn_icon>
              <i class="fal fa-file-excel"></i>
            </template>
          </base-button>
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
        :items-per-page="-1"
        hide-default-footer
      >
        <!-- Start:: No Data State -->
        <template v-slot:no-data>
          {{ $t("TABLES.noData") }}
        </template>
        <!-- End:: No Data State -->

        <template v-slot:[`item.serial`]="{ item, index }">
          <div class="table_image_wrapper">
            <p>
              {{
                index + 1
              }}
            </p>
          </div>
        </template>

        <!-- Start:: Provider Name -->
        <template v-slot:[`item.provider_name`]="{ item }">
          {{ item.provider_name || "-" }}
        </template>
        <!-- End:: Provider Name -->

        <!-- Start:: Client Name -->
        <template v-slot:[`item.user_name`]="{ item }">
          {{ item.user_name || "-" }}
        </template>
        <!-- End:: Client Name -->

        <!-- Start:: Order ID -->
        <template v-slot:[`item.order_id`]="{ item }">
          {{ item.order_id || "-" }}
        </template>
        <!-- End:: Order ID -->

        <!-- Start:: Sub Category -->
        <template v-slot:[`item.sub_category`]="{ item }">
          {{ item.sub_category || "-" }}
        </template>
        <!-- End:: Sub Category -->

        <!-- Start:: Price -->
        <template v-slot:[`item.price`]="{ item }">
          {{ formatPrice(item.price) }}
        </template>
        <!-- End:: Price -->

        <!-- Start:: Tax Value -->
        <template v-slot:[`item.tax_value`]="{ item }">
          {{ formatPrice(item.tax_value) }}
        </template>
        <!-- End:: Tax Value -->

        <!-- Start:: Created At -->
        <template v-slot:[`item.created_at`]="{ item }">
          {{ item.created_at }}
        </template>
        <!-- End:: Created At -->
      </v-data-table>
      <!--  =========== End:: Data Table =========== -->
    </main>
    <!-- End:: Main Section -->

    <!-- Start:: Pagination -->
    <!-- <template>
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
    </template> -->
    <!-- End:: Pagination -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as XLSX from "xlsx";

export default {
  name: "AllFinancialReports",


  computed: {
    ...mapGetters({
      getAppLocale: "AppLangModule/getAppLocale",
    }),
  },

  data() {
    return {
      provider_name: null,
      loading: false,
      isWaitingRequest: false,
      excelDownloadBtnIsLoading: false,
      searchValue: null,

      filterFormIsActive: false,
      filterOptions: {
        provider_name: null,
        from_date: null,
        to_date: null,
      },
      tableHeaders: [
        {
          text: this.$t("TABLES.Admins.serialNumber"),
          value: "serial",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("PLACEHOLDERS.provider_name"),
          value: "provider_name",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("PLACEHOLDERS.client_name"),
          value: "user_name",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("PLACEHOLDERS.order_number"),
          value: "order_id",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("PLACEHOLDERS.sub_service"),
          value: "sub_category",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("PLACEHOLDERS.riyal_price"),
          value: "price",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("PLACEHOLDERS.tax_value"),
          value: "tax_value",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("PLACEHOLDERS.transfer_date"),
          value: "created_at",
          align: "center",
          sortable: false,
        },
      ],
      tableRows: [],
      // paginations: {
      //   current_page: 1,
      //   last_page: 1,
      //   items_per_page: 6,
      // },
    };
  },

  methods: {
    async submitFilterForm() {
      this.setTableRows();
    },
    async resetFilter() {
      this.filterOptions.provider_name = null;
      this.filterOptions.from_date = null;
      this.filterOptions.to_date = null;
      this.setTableRows();
    },
    async setTableRows() {
      this.loading = true;
      try {
        let res = await this.$axios({
          method: "GET",
          url: `financial-reports/${this.$route.params.id}`,
          params: {
            // page: this.paginations.current_page,
            provider_name: this.filterOptions.provider_name,
            search: this.filterOptions.provider_name,
            date_from: this.filterOptions.from_date,
            date_to: this.filterOptions.to_date,
          },
        });
        this.loading = false;
        const financialReports = res.data.data.financial_reports || [];
        this.provider_name = res.data.data.financial_reports[0]?.provider_name;
        // Use the data directly from API
        this.tableRows = financialReports;

      } catch (error) {
        this.loading = false;
        console.log(error.response?.data?.message || error.message);
      }
    },
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
    formatPrice(price) {
      if (!price || price === "0.00") return "-";
      const numPrice = parseFloat(price);
      if (isNaN(numPrice)) return price;
      return numPrice.toFixed(2);
    },
    async downloadExcelAllData() {
      this.excelDownloadBtnIsLoading = true;
      try {
        let res = await this.$axios({
          method: "GET",
          url: `financial-reports/${this.$route.params.id}`,
          params: {
            provider_name: this.filterOptions.provider_name,
            date_from: this.filterOptions.from_date,
            date_to: this.filterOptions.to_date,
          },
        });
        const allData = res.data.data.financial_reports || [];

        // Map data with translated headers
        const translatedData = allData.map((row, index) => {
          if (this.getAppLocale == "ar") {
            return {
              [this.$t("TABLES.Admins.serialNumber")]: index + 1,
              [this.$t("PLACEHOLDERS.provider_name")]: row.provider_name,
              [this.$t("PLACEHOLDERS.client_name")]: row.user_name,
              [this.$t("PLACEHOLDERS.order_number")]: row.order_id || "-",
              [this.$t("PLACEHOLDERS.sub_service")]: row.sub_category || "-",
              [this.$t("PLACEHOLDERS.riyal_price")]: this.formatPrice(
                row.price
              ),
              [this.$t("PLACEHOLDERS.tax_value")]: this.formatPrice(
                row.tax_value
              ),
              [this.$t("PLACEHOLDERS.transfer_date")]: row.created_at,
            };
          } else {
            return {
              [this.$t("TABLES.Admins.serialNumber")]: index + 1,
              [this.$t("PLACEHOLDERS.provider_name")]: row.provider_name,
              [this.$t("PLACEHOLDERS.client_name")]: row.user_name,
              [this.$t("PLACEHOLDERS.order_number")]: row.order_id || "-",
              [this.$t("PLACEHOLDERS.sub_service")]: row.sub_category || "-",
              [this.$t("PLACEHOLDERS.riyal_price")]: this.formatPrice(
                row.price
              ),
              [this.$t("PLACEHOLDERS.tax_value")]: this.formatPrice(
                row.tax_value
              ),
              [this.$t("PLACEHOLDERS.transfer_date")]: row.created_at,
            };
          }
        });

        const worksheet = XLSX.utils.json_to_sheet(translatedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Financial Reports");

        // Generate Excel file
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const data = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
        const url = window.URL.createObjectURL(data);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${this.$t("PLACEHOLDERS.financial_reports")}.xlsx`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      } finally {
        this.excelDownloadBtnIsLoading = false;
      }
    },
  },

  created() {
    this.setTableRows();
  },
};
</script>

<style scoped>
.ex-btn-s {
  color: black !important;
  font-size: 20px;
  font-weight: bold;
  text-decoration: underline !important;
}

.all-stat {
  background: var(--main_theme_clr);
}

.all-stat th {
  color: white !important;
  font-size: 16px !important;
  font-weight: 800;
}

.excel {
  background: darkgreen;
  padding: 7px 10px;
  border-radius: 12px;
  color: #fff;
  cursor: pointer;
}
</style>
