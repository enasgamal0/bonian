<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("TITLES.showClient") }}</h4>
    </div>
    <div class="col-12 text-end">
      <v-btn @click="$router.go(-1)" style="color: #1b706f">
        <i class="fas fa-backward"></i>
      </v-btn>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <!-- ==== Start:: Status Badges ==== -->
      <!-- <div class="badges_wrapper d-flex justify-content-between">
        <div class="wrapper">
          <v-chip color="amber darken-2" text-color="white">
            {{ $t("TITLES.numberOfVisits", { number: data.numberOfVisits }) }}
          </v-chip>
          <v-chip color="amber darken-2 mx-2" text-color="white">
            {{ $t("TITLES.lastVisit", { date: data.lastVisit }) }}
          </v-chip>
        </div>

        <v-chip :color="data.active ? 'green' : 'red'" text-color="white">
          {{ data.active ? $t("STATUS.active") : $t("STATUS.notActive") }}
        </v-chip>
      </div> -->
      <!-- ==== End:: Status Badges ==== -->
      <form>
        <div class="row">
          <div class="preview-container text-center my-3">
            <img
              v-if="data.image.path"
              col="12"
              :src="data.image.path"
              :alt="$t('PLACEHOLDERS.section_image')"
            />
          </div>

          <!-- Start:: Name Input -->
          <base-input
            col="12"
            type="text"
            :placeholder="$t('PLACEHOLDERS.email')"
            v-model.trim="data.email"
            disabled
          />
          <base-phone-input
            col="12"
            disabled
            dir="ltr"
            v-model="data.phone"
            @dialCode="dialCode"
            :placeholder="$t('PLACEHOLDERS.phone')"
            :defaultCountry="data.dial_code"
            :key="key"
          />
          <!-- Start:: WhatsApp Checkbox -->
          <div class="col-12" v-if="isWhatsappSame">
            <input
              type="checkbox"
              id="whatsappCheckbox"
              v-model="isWhatsappSame"
              disabled
            />
            <label
              style="font-size: 16px; color: #1b706f"
              for="whatsappCheckbox"
              class="mx-3"
              >{{ $t("PLACEHOLDERS.whatsappCheckbox") }}</label
            >
          </div>
          <!-- End:: WhatsApp Checkbox -->

          <!-- Start:: WhatsApp Input -->
          <base-phone-input
            v-if="!isWhatsappSame"
            col="12"
            dir="ltr"
            v-model="data.whatsapp"
            @dialCode="dialCodeWhatsapp"
            :placeholder="$t('PLACEHOLDERS.whatsapp')"
            :defaultCountry="data.dial_code_whatsapp"
            :key="key"
            disabled
          />
          <!-- End:: WhatsApp Input -->
          <!-- End:: Name Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.client_name')"
            v-model.trim="data.client_name"
            disabled
          />
          <!-- <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.user_name')"
            v-model.trim="data.user_name"
            disabled
          /> -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.company_name')"
            v-model.trim="data.company_name"
            disabled
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.country')"
            v-model.trim="data.country"
            disabled
          />
          <!-- <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.natonalty')"
            v-model.trim="data.natonalty"
            disabled
          /> -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.country_section')"
            v-model.trim="data.country_section"
            disabled
          />
          <!-- Start:: Phone Input -->
          <base-input
            ref="phoneInput"
            col="12"
            type="text"
            :placeholder="$t('PLACEHOLDERS.address')"
            v-model.trim="data.address"
            disabled
          />
          <!-- End:: Phone Input -->
          <!-- Start:: Email Input -->
          <!-- End:: Email Input -->
          <!-- Start:: Password Input -->
          <!-- <base-input
            col="6"
            type="password"
            :placeholder="$t('PLACEHOLDERS.password')"
            v-model.trim="data.password"
            disabled
          /> -->
          <!-- End:: Password Input -->

          <!-- Start:: Confirm Password Input -->
          <!-- <base-input
            col="6"
            type="password"
            :placeholder="$t('PLACEHOLDERS.confirmPassword')"
            v-model.trim="data.passwordConfirmation"
            disabled
          /> -->
          <!-- End:: Deactivate Switch Input -->
          <hr v-if="data.fields?.length > 0" style="width: 97%" class="my-5" />
          <label
            v-if="data.fields?.length > 0"
            class="font-weight-bold"
            style="font-size: 16px; color: #1b706f"
            >{{ $t("PLACEHOLDERS.social_media_accounts") }}</label
          >
          <div class="row justify-content-center">
            <div
              class="col-12"
              v-for="(item, index) in data.fields"
              :key="'l' + index"
            >
              <div class="row">
                <base-input
                  type="text"
                  col="6"
                  :placeholder="$t('PLACEHOLDERS.platform')"
                  v-model.trim="item.socialType.name"
                  disabled
                />
                <base-input
                  col="6"
                  type="text"
                  :placeholder="$t('PLACEHOLDERS.account_name')"
                  v-model.trim="item.account_name"
                  disabled
                />
                <base-input
                  v-if="item.account_url"
                  col="4"
                  type="text"
                  :placeholder="$t('PLACEHOLDERS.account_url')"
                  v-model.trim="item.account_url"
                  disabled
                />
              </div>
            </div>
            <div class="col-12">
              <!-- <div class="input_wrapper switch_wrapper my-5">
                <v-switch
                  color="green"
                  :label="$t('SIDENAV.Clients.is_vip')"
                  v-model="data.is_vip"
                  hide-details
                  disabled
                ></v-switch>
              </div> -->
            </div>
          </div>

        </div>
      </form>
    </div>
    <!-- END:: Single Step Form Content -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import BasePhoneInput from "@/components/formInputs/BasePhoneInput.vue";

export default {
  name: "ShowClients",
  components: {
    BasePhoneInput,
  },
  data() {
    return {
      key: null,
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data
      isWhatsappSame: false,
      // Start:: Data Collection To Send
      data: {
        image: {
          path: null,
          file: null,
        },
        email: null,
        is_vip: false,
        client_name: null,
        company_name: null,
        country: null,
        country_section: null,
        address: null,
        // natonalty: null,
        password: null,
        passwordConfirmation: null,
        phone: null,
        // user_name: null,
        areas: [],
        active: true,
        fields: [],
        iban: null,
        dial_code: null,
        dial_code_whatsapp: null,
      },
      socials: [],
      // End:: Data Collection To Send
    };
  },

  methods: {
    // start show data
    async showClient() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `clients/${this.$route.params?.id}`,
        });
        this.data.client_name = res.data.data.Client.name;
        this.data.image.path = res.data.data.Client.image;
        this.data.email = res.data.data.Client.email;
        this.data.is_vip = res.data.data.Client.is_vip;
        this.data.phone = res.data.data.Client.mobile;
        // this.data.user_name = res.data.data.Client.user_name;
        this.data.country = res.data.data.Client.country_id?.name;
        this.data.country_section = res.data.data.Client.section_id?.name;
        // this.data.natonalty = res.data.data.Client.nationality_id?.name;
        this.data.company_name = res.data.data.Client.company_name;
        this.data.address = res.data.data.Client.address;
        this.data.dial_code = res.data.data.Client.country_code;
        this.data.dial_code_whatsapp =
          res.data.data.Client.whatsapp_country_code;
        this.data.whatsapp = res.data.data.Client.whatsapp_number;
        this.data.iso_code = res.data.data.Client.iso_code;
        this.data.whatsapp_iso_code = res.data.data.Client.whatsapp_iso_code;
        this.isWhatsappSame = res.data.data.Client.is_whatsapp_same;
        this.data.fields =
          res.data.data.Client.social_media_accounts?.map((acc) => ({
            socialType: acc.platform
              ? this.socialTypes?.find((s) => s.value === acc.platform)
              : null,
            account_id: acc.id,
            account_name: acc.account_name || "",
            account_url: acc.account_url || "",
          })) || [];
      } catch (error) {
        this.loading = false;
        console.log(error?.response?.data?.message);
      }
    },
    // end show data
    dialCode(dialCode) {
      this.data.dial_code = dialCode;
    },

    dialCodeWhatsapp(dialCode) {
      this.data.dial_code_whatsapp = dialCode;
    },
  },

  computed: {
    socialTypes() {
      return [
        { id: 1, name: this.$t("PLACEHOLDERS.x"), value: "x" },
        { id: 2, name: this.$t("PLACEHOLDERS.facebook"), value: "facebook" },
        { id: 3, name: this.$t("PLACEHOLDERS.tiktok"), value: "tiktok" },
        { id: 4, name: this.$t("PLACEHOLDERS.snapchat"), value: "snapchat" },
        { id: 5, name: this.$t("PLACEHOLDERS.youtube"), value: "youtube" },
        { id: 6, name: this.$t("PLACEHOLDERS.instagram"), value: "instagram" },
      ];
    },
  },

  async created() {
    // Start:: Fire Methods
    this.showClient();
    // End:: Fire Methods;
  },
};
</script>
