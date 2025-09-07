<template>
  <div class="crud_form_wrapper app_settings_class">
    <div class="table_title_wrapper">
      <div class="title_text_wrapper">
        <h5 style="color: #1b706f" class="font-weight-bold">{{ $t("SIDENAV.settings.general") }}</h5>
      </div>
      <div class="col-12 text-end">
        <v-btn @click="$router.go(-1)" style="color: #1b706f">
          <i class="fas fa-backward"></i>
        </v-btn>
      </div>
    </div>
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">
          <base-input
            type="text"
            col="6"
            :placeholder="$t('PLACEHOLDERS.tax')"
            v-model.trim="data.tax"
            
          />

          <base-input
            type="text"
            col="6"
            :placeholder="$t('PLACEHOLDERS.ratio_of_start_price')"
            v-model.trim="data.ratio_of_start_price"
            
          />

          <base-input
            type="text"
            col="12"
            :placeholder="$t('PLACEHOLDERS.incremental_ratio')"
            v-model.trim="data.incremental_ratio"
            
          />
          <hr class="my-5" style="width: 97%;"/>
          <h6 class="mb-5 font-weight-bold" style="color: #1b706f;">{{ $t("PLACEHOLDERS.appCommission") }}</h6>
          <base-input
            type="number"
            col="6"
            :placeholder="$t('PLACEHOLDERS.reference_price')"
            v-model.trim="data.reference_price"
            
          />

          <base-input
            type="number"
            col="6"
            :placeholder="$t('PLACEHOLDERS.less_than_reference_price')"
            v-model.trim="data.less_than_reference_price"
            
          />

          <base-input
            type="number"
            col="12"
            :placeholder="$t('PLACEHOLDERS.greater_than_reference_price')"
            v-model.trim="data.greater_than_reference_price"
            
          />

          <div class="btn_wrapper">
            <base-button
              class="mt-2"
              styleType="primary_btn"
              :btnText="$t('BUTTONS.save')"
              :isLoading="isWaitingRequest"
              :disabled="isWaitingRequest"
            />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppSetting",
  data() {
    return {
      isWaitingRequest: false,
      data: {
        tax: null,
        reference_price: null,
        less_than_reference_price: null,
        greater_than_reference_price: null,
        ratio_of_start_price: null,
        incremental_ratio: null,
      },
    };
  },
  methods: {
    async getDataToEdit() {
      try {
        let res = await this.$axios.get("settings?key=dashboard_settings");
        const settings = res.data.data.data[0].value;
        this.data.tax = settings.tax;
        this.data.reference_price = settings.commission.reference_price;
        this.data.less_than_reference_price =
          settings.commission.less_than_reference_price;
        this.data.greater_than_reference_price =
          settings.commission.greater_than_reference_price;
        this.data.ratio_of_start_price = settings.ratio_of_start_price;
        this.data.incremental_ratio = settings.incremental_ratio;
      } catch (error) {
        console.error(error.response.data.message);
      }
    },
    async submitForm() {
      this.isWaitingRequest = true;
      const REQUEST_DATA = new FormData();
      REQUEST_DATA.append("key", "dashboard_settings");
      REQUEST_DATA.append("value[tax]", this.data.tax);
      REQUEST_DATA.append(
        "value[commission][reference_price]",
        this.data.reference_price
      );
      REQUEST_DATA.append(
        "value[commission][less_than_reference_price]",
        this.data.less_than_reference_price
      );
      REQUEST_DATA.append(
        "value[commission][greater_than_reference_price]",
        this.data.greater_than_reference_price
      );
      if (this.data.ratio_of_start_price){
        REQUEST_DATA.append(
          "value[ratio_of_start_price]",
          this.data.ratio_of_start_price
        );
      }
      if (this.data.incremental_ratio){
        REQUEST_DATA.append(
          "value[incremental_ratio]",
          this.data.incremental_ratio
        );
      }
      try {
        await this.$axios.post("settings", REQUEST_DATA);
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.savedSuccessfully"));
        this.getDataToEdit();
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },
    validateFormInputs() {
      // if (!this.data.tax) {
      //   this.$message.error(this.$t("VALIDATION.tax"));
      //   return;
      // }
      this.submitForm();
    },
  },
  created() {
    this.getDataToEdit();
  },
};
</script>
