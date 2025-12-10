<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("TITLES.showProviderRate") }}</h4>
    </div>
    <div class="col-12 text-end">
      <v-btn @click="$router.go(-1)" style="color: #1b706f">
        <i class="fas fa-backward"></i>
      </v-btn>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">
          <!-- Start:: User Data Section -->
          <div class="col-12 mb-4">
            <h5 class="section_title">{{ $t("TITLES.userData") }}</h5>
          </div>

          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.client-name')"
            v-model.trim="data.user_name"
            disabled
          />

          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.phone')"
            v-model.trim="data.user_mobile"
            disabled
          />
          <!-- End:: User Data Section -->

          <!-- Start:: Provider Data Section -->
          <div class="col-12 mb-4 mt-4">
            <h5 class="section_title">{{ $t("TITLES.providerData") }}</h5>
          </div>

          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.provider_name')"
            v-model.trim="data.provider_name"
            disabled
          />
          <!-- End:: Provider Data Section -->

          <!-- Start:: Rating Data Section -->
          <div class="col-12 mb-4 mt-4">
            <h5 class="section_title">{{ $t("TITLES.ratingData") }}</h5>
          </div>

          <base-rate-input
            col="6"
            :placeholder="$t('PLACEHOLDERS.rating_stars')"
            v-model.trim="data.rate"
            size="22"
            :readonly="true"
          />

          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.created_at')"
            v-model.trim="data.created_at"
            disabled
          />

          <base-input
            v-if="data.message"
            col="12"
            type="textarea"
            :placeholder="$t('TABLES.ProviderRates.comment')"
            v-model.trim="data.message"
            disabled
          />

          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.orderNumber')"
            v-model.trim="data.order_serial"
            disabled
          />
          <!-- End:: Rating Data Section -->
        </div>
      </form>
    </div>
    <!-- END:: Single Step Form Content -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ShowProviderRate",

  computed: {
    ...mapGetters({
      getAppLocale: "AppLangModule/getAppLocale",
    }),
  },

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data

      // Start:: Data Collection To Send
      data: {
        user_name: null,
        user_mobile: null,
        provider_name: null,
        rate: null,
        message: null,
        created_at: null,
        order_serial: null,
        order_id: null,
        is_published: false,
      },
      // End:: Data Collection To Send
    };
  },

  methods: {
    // Start:: Show Rate Data
    async showRate() {
      this.isWaitingRequest = true;
      try {
        let res = await this.$axios({
          method: "GET",
          url: `providerRates/${this.$route.params?.id}`,
        });
        
        // Handle new response structure: res.data.data.ProviderRate
        const rateData = res.data.data?.ProviderRate || res.data.data?.data || res.data.data || res.data;
        
        this.data.user_name = rateData.user?.name || "-";
        this.data.user_mobile = rateData.user?.mobile || "-";
        this.data.provider_name = rateData.provider?.name || "-";
        this.data.rate = rateData.rate;
        this.data.message = rateData.message || null;
        this.data.created_at = rateData.created_at;
        this.data.order_serial = rateData.order?.serial_number || "-";
        this.data.order_id = rateData.order_id;
        this.data.is_published = rateData.is_published || rateData.status === 'published' || false;
        
        this.isWaitingRequest = false;
      } catch (error) {
        this.isWaitingRequest = false;
        console.log(error?.response?.data?.message);
        this.$message.error(
          error?.response?.data?.message || this.$t("MESSAGES.errorOccurred")
        );
      }
    },
    // End:: Show Rate Data

    // Start:: Validate Form Inputs
    validateFormInputs() {
      // This form is read-only, no validation needed
    },
    // End:: Validate Form Inputs
  },

  created() {
    this.showRate();
  },
};
</script>

<style scoped>
.section_title {
  color: var(--main_theme_clr);
  font-weight: bold;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--main_theme_clr);
}
</style>

