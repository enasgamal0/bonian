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
                :placeholder="$t('PLACEHOLDERS.provider_name')"
                v-model="filterOptions.provider_name"
              />

              <!-- Start:: Start Date Input -->
              <base-picker-input
                col="4"
                type="date"
                :placeholder="$t('PLACEHOLDERS.time_from')"
                v-model.trim="filterOptions.from_date"
              />
              <!-- End:: Start Date Input -->

              <!-- Start:: End Date Input -->
              <base-picker-input
                col="4"
                type="date"
                :placeholder="$t('PLACEHOLDERS.time_to')"
                v-model.trim="filterOptions.to_date"
              />
              <!-- End:: End Date Input -->
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
          <h5>
            {{ $t("PLACEHOLDERS.financial_reports") }}
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
          <!-- <base-button
            class="mt-0 pdf_btn"
            styleType="solid_btn"
            :btnText="$t('BUTTONS.downloadPdf')"
            @fireClick="downloadPdf"
          >
            <template v-slot:btn_icon>
              <i class="fal fa-file-pdf"></i>
            </template>
          </base-button> -->
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
        :items-per-page="paginations.items_per_page"
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
                (paginations.current_page - 1) * paginations.items_per_page +
                index +
                1
              }}
            </p>
          </div>
        </template>

        <!-- Start:: Actions -->
        <template v-slot:[`item.actions`]="{ item }">
          <div class="actions">
            <a-tooltip placement="bottom">
              <template slot="title">
                <span>{{ $t("PLACEHOLDERS.payment_history") }}</span>
              </template>
              <button class="btn_show" @click="showPaymentHistory(item)">
                <i class="fal fa-eye"></i>
              </button>
            </a-tooltip>
          </div>
        </template>
        <!-- End:: Actions -->
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

    <!-- Start:: Payment History Modal -->
    <v-dialog v-model="paymentHistoryDialog" max-width="900px" persistent>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>{{ $t("PLACEHOLDERS.payment_history") }}</span>
          <v-btn icon @click="paymentHistoryDialog = false">
            <i class="fal fa-times"></i>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div v-if="paymentHistoryLoading" class="text-center py-5">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
          <div v-else-if="paymentHistoryData.length === 0" class="text-center py-5">
            {{ $t("TABLES.noData") }}
          </div>
          <v-simple-table v-else>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>{{ $t("PLACEHOLDERS.provider_name") }}</th>
                  <th>{{ $t("PLACEHOLDERS.client_name") }}</th>
                  <th>{{ $t("PLACEHOLDERS.order_number") }}</th>
                  <th>{{ $t("PLACEHOLDERS.sub_service") }}</th>
                  <th>{{ $t("PLACEHOLDERS.riyal_price") }}</th>
                  <th>{{ $t("PLACEHOLDERS.tax_value") }}</th>
                  <th>{{ $t("PLACEHOLDERS.transfer_date") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(payment, index) in paymentHistoryData" :key="index">
                  <td>{{ payment.provider_name || "-" }}</td>
                  <td>{{ payment.client_name || "-" }}</td>
                  <td>{{ payment.order_number || "-" }}</td>
                  <td>{{ payment.sub_service || "-" }}</td>
                  <td>{{ payment.amount || "-" }}</td>
                  <td>{{ payment.tax_value || "-" }}</td>
                  <td>{{ payment.transfer_date || "-" }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="paymentHistoryDialog = false">
            {{ $t("BUTTONS.close") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End:: Payment History Modal -->

    <!-- Start:: Generate PDF Template Content -->
    <vue-html2pdf
      :show-layout="false"
      :float-layout="true"
      :enable-download="true"
      :preview-modal="true"
      :filename="$t('PLACEHOLDERS.financial_reports')"
      :pdf-quality="2"
      pdf-format="a4"
      :manual-pagination="false"
      :paginate-elements-by-height="1400"
      pdf-content-width="100%"
      @hasGenerated="$message.success($t('MESSAGES.generatedSuccessfully'))"
      ref="html2Pdf"
    >
      <section slot="pdf-content">
        <div class="pdf_file_content">
          <h3 class="file_title">
            {{ $t("PLACEHOLDERS.financial_reports") }}
          </h3>
          <p v-if="filterOptions.provider_name" class="mb-2">
            {{ $t("PLACEHOLDERS.provider_name") }}: {{ filterOptions.provider_name }}
          </p>
          <p v-if="filterOptions.from_date || filterOptions.to_date" class="mb-2">
            {{ $t("PLACEHOLDERS.from_date") }}: {{ filterOptions.from_date || "-" }} | 
            {{ $t("PLACEHOLDERS.to_date") }}: {{ filterOptions.to_date || "-" }}
          </p>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th
                    v-for="(header, index) in tableHeaders"
                    :key="header.value"
                  >
                    <span>{{ header.text }}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in tableRows" :key="row.id">
                  <td>
                    {{
                      (paginations.current_page - 1) *
                        paginations.items_per_page +
                      index +
                      1
                    }}
                  </td>
                  <td>{{ row.provider_name }}</td>
                  <td>{{ row.total_price }}</td>
                  <td>{{ row.total_tax }}</td>
                  <td>{{ row.payment_count || row.payments_count || "-" }}</td>
                  <td>{{ row.last_subscription_date }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div>
      </section>
    </vue-html2pdf>
    <!-- End:: Generate PDF Template Content -->
  </div>
</template>

<script>
import VueHtml2pdf from "vue-html2pdf";
import { mapGetters } from "vuex";
import * as XLSX from "xlsx";

export default {
  name: "AllFinancialReports",

  components: {
    VueHtml2pdf,
  },

  computed: {
    ...mapGetters({
      getAppLocale: "AppLangModule/getAppLocale",
    }),
  },

  data() {
    return {
      loading: false,
      isWaitingRequest: false,
      excelDownloadBtnIsLoading: false,

      filterFormIsActive: false,
      filterOptions: {
        provider_name: null,
        from_date: null,
        to_date: null,
      },
      paymentHistoryDialog: false,
      paymentHistoryLoading: false,
      paymentHistoryData: [],
      selectedProviderId: null,
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
          text: this.$t("PLACEHOLDERS.total_payments"),
          value: "total_price",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("PLACEHOLDERS.total_paid_tax"),
          value: "total_tax",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("PLACEHOLDERS.payment_count"),
          value: "payment_count",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("PLACEHOLDERS.last_payment_date"),
          value: "last_subscription_date",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("TABLES.actions"),
          value: "actions",
          align: "center",
          sortable: false,
        },
      ],
      tableRows: [],
      paginations: {
        current_page: 1,
        last_page: 1,
        items_per_page: 6,
      },
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
          url: "financial-reports",
          params: {
            page: this.paginations.current_page,
            provider_name: this.filterOptions.provider_name,
            search: this.filterOptions.provider_name,
            date_from: this.filterOptions.from_date,
            date_to: this.filterOptions.to_date,
          },
        });
        this.loading = false;
        const financialReports = res.data.data.financial_reports || [];
        // Map the data to match table structure
        this.tableRows = financialReports.map((report) => ({
          ...report,
          // payment_count might need to be calculated or provided by API
          // For now, we'll show "-" if not available
          payment_count: report.payment_count || report.payments_count || "-",
        }));
        
        // Update pagination if API provides meta data
        if (res.data.data.meta) {
          this.paginations.last_page = res.data.data.meta.last_page;
          this.paginations.current_page = res.data.data.meta.current_page || 1;
        } else if (res.data.meta) {
          this.paginations.last_page = res.data.meta.last_page || 1;
          this.paginations.current_page = res.data.meta.current_page || 1;
        } else {
          // Default pagination if not provided
          this.paginations.last_page = 1;
        }
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
    async showPaymentHistory(item) {
      this.selectedProviderId = item.id;
      this.paymentHistoryDialog = true;
      this.paymentHistoryLoading = true;
      this.paymentHistoryData = [];
      
      try {
        // Fetch payment history for this provider
        // Adjust the endpoint based on your actual API
        let res = await this.$axios({
          method: "GET",
          url: `financial-reports/${item.id}/payments`,
          // Or use query params: url: "financial-reports/payments", params: { provider_id: item.id }
        });
        
        this.paymentHistoryData = res.data.data || [];
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
        // If endpoint doesn't exist, show a message or use mock data structure
        this.paymentHistoryData = [];
      } finally {
        this.paymentHistoryLoading = false;
      }
    },
    async downloadPdf() {
      await this.$refs.html2Pdf.generatePdf();
    },
    async downloadExcelAllData() {
      this.excelDownloadBtnIsLoading = true;
      try {
        let res = await this.$axios({
          method: "GET",
          url: "financial-reports",
          params: {
            provider_name: this.filterOptions.provider_name,
            from: this.filterOptions.from_date,
            to: this.filterOptions.to_date,
          },
        });
        const allData = res.data.data.financial_reports || [];

        // Map data with translated headers
        const translatedData = allData.map((row, index) => {
          if (this.getAppLocale == "ar") {
            return {
              [this.$t("TABLES.Admins.serialNumber")]: index + 1,
              [this.$t("PLACEHOLDERS.provider_name")]: row.provider_name,
              [this.$t("PLACEHOLDERS.total_payments")]: row.total_price,
              [this.$t("PLACEHOLDERS.total_paid_tax")]: row.total_tax,
              [this.$t("PLACEHOLDERS.payment_count")]: row.payment_count || row.payments_count || "-",
              [this.$t("PLACEHOLDERS.last_payment_date")]: row.last_subscription_date,
            };
          } else {
            return {
              [this.$t("TABLES.Admins.serialNumber")]: index + 1,
              [this.$t("PLACEHOLDERS.provider_name")]: row.provider_name,
              [this.$t("PLACEHOLDERS.total_payments")]: row.total_price,
              [this.$t("PLACEHOLDERS.total_paid_tax")]: row.total_tax,
              [this.$t("PLACEHOLDERS.payment_count")]: row.payment_count || row.payments_count || "-",
              [this.$t("PLACEHOLDERS.last_payment_date")]: row.last_subscription_date,
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
