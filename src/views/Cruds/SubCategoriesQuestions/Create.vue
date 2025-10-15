<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("PLACEHOLDERS.sub_categories_questions_create") }}</h4>
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
          
          <!-- Start:: Main Section Select -->
          <base-select-input
            col="6"
            :optionsList="allMainCategories"
            :placeholder="$t('PLACEHOLDERS.mainSection')"
            v-model="main_section"
            @input="onMainCategoryChange"
            required
          />
          <!-- End:: Main Section Select -->

          <!-- Start:: Sub Section Select -->
          <base-select-input
            col="6"
            :optionsList="allSubCategories"
            :placeholder="$t('PLACEHOLDERS.sub_section')"
            v-model="sub_section"
            :disabled="!main_section"
            required
          />
          <!-- End:: Sub Section Select -->

          <!-- Start:: Question Text Input -->
          <base-input
            col="12"
            type="textarea"
            :placeholder="$t('PLACEHOLDERS.questionText')"
            v-model.trim="data.question"
            required
          />
          <!-- End:: Question Text Input -->

          <!-- Start:: Question Type Select -->
          <base-select-input
            col="6"
            :optionsList="questionTypes"
            :placeholder="$t('PLACEHOLDERS.questionType')"
            v-model="data.type"
            required
          />
          <!-- End:: Question Type Select -->

          <!-- Start:: Multiple Choice Options (shown only if type is mcq) -->
          <div v-if="data?.type && data.type?.id === 'mcq'" class="col-12">
            <div class="options_wrapper mb-4">
              <label class="form-label">{{ $t('PLACEHOLDERS.choices') }}</label>
              
              <div v-for="(option, index) in data?.options" :key="index" class="option_item d-flex gap-2 mb-2">
                <base-input
                  col="10"
                  type="text"
                  :placeholder="$t('PLACEHOLDERS.option') + ' ' + (index + 1)"
                  v-model.trim="data?.options[index]"
                  required
                />
                <button 
                  type="button" 
                  style="border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; border: 1px solid red; color: red;"
                  @click="removeOption(index)"
                  v-if="data?.options.length > 2"
                >
                 -
                </button>
              </div>

              <button 
                type="button" 
                class="btn btn-secondary btn-sm mt-2"
                @click="addOption"
              >
                <i class="mdi mdi-plus"></i> {{ $t('BUTTONS.addOption') }}
              </button>
            </div>
          </div>
          <!-- End:: Multiple Choice Options -->

          <!-- Start:: Active Switch Input -->
          <div class="input_wrapper switch_wrapper my-5">
            <v-switch
              color="green"
              :label="
                data?.is_active
                  ? $t('PLACEHOLDERS.active')
                  : $t('PLACEHOLDERS.notActive')
              "
              v-model="data.is_active"
              hide-details
            ></v-switch>
          </div>
          <!-- End:: Active Switch Input -->

          <!-- Start:: Submit Button Wrapper -->
          <div class="btn_wrapper">
            <base-button
              class="mt-2"
              styleType="primary_btn"
              :btnText="$t('BUTTONS.save')"
              :isLoading="isWaitingRequest"
              :disabled="isWaitingRequest"
            />
          </div>
          <!-- End:: Submit Button Wrapper -->
        </div>
      </form>
    </div>
    <!-- END:: Single Step Form Content -->
  </div>
</template>

<script>
export default {
  name: "CreateQuestion",

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      loading: false,
      // End:: Loader Control Data

      // Start:: Data Collection To Send
      data: {
        question: null,
        type: null,
        is_active: true,
        options: ['', ''], // Default two empty options for multiple choice
      },
      main_section: null,
      sub_section: null,
      allMainCategories: [],
      allSubCategories: [],
      // End:: Data Collection To Send

      // Start:: Question Types
      questionTypes: [
        {
          id: 'written_question',
          name: this.$t('PLACEHOLDERS.writtenQuestion') || 'سؤال مقالي (نصي)',
        },
        {
          id: 'mcq',
          name: this.$t('PLACEHOLDERS.multipleChoice') || 'اختيار من متعدد',
        },
      ],
      // End:: Question Types
    };
  },

  methods: {
    // Start:: Handle Main Category Change
    async onMainCategoryChange() {
      this.sub_section = null;
      this.allSubCategories = [];
      if (this.main_section) {
        await this.getSubCategories(this.main_section.id);
      }
    },
    // End:: Handle Main Category Change

    // Start:: Add Option
    addOption() {
      this.data?.options.push('');
    },
    // End:: Add Option

    // Start:: Remove Option
    removeOption(index) {
      if (this.data?.options.length > 2) {
        this.data?.options.splice(index, 1);
      }
    },
    // End:: Remove Option

    // Start:: validate Form Inputs
    validateFormInputs() {
      this.isWaitingRequest = true;

      if (!this.main_section) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.main_section"));
        return;
      } else if (!this.sub_section) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.sub_section"));
        return;
      } else if (!this.data.question) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.question"));
        return;
      } else if (!this.data.type) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.questionType"));
        return;
      } else if (this.data.type.id === 'mcq') {
        // Validate options for multiple choice
        const filledOptions = this.data.options.filter(opt => opt.trim() !== '');
        if (filledOptions.length < 2) {
          this.isWaitingRequest = false;
          this.$message.error(this.$t("VALIDATION.minTwoOptions"));
          return;
        }
      }
      
      this.submitForm();
      return;
    },
    // End:: validate Form Inputs

    // Start:: Submit Form
    async submitForm() {
      const REQUEST_DATA = new FormData();

      // Start:: Append Request Data
      if (this.sub_section?.id) {
        REQUEST_DATA.append("sub_category_id", this.sub_section?.id);
      }
      if (this.data?.type?.id) {
        REQUEST_DATA.append("type", this.data?.type?.id);
      }
      if (this.data?.question) {
        REQUEST_DATA.append("question", this.data?.question);
      }
      if (this.data?.is_active) {
        REQUEST_DATA.append("is_active", +this.data?.is_active);
      }

      // Append options if question type is mcq
      if (this.data?.type?.id === 'mcq') {
        const filledOptions = this.data?.options.filter(opt => opt.trim() !== '');
        filledOptions.forEach((option, index) => {
          REQUEST_DATA.append(`options[${index}]`, option);
        });
      }
      // End:: Append Request Data

      try {
        await this.$axios({
          method: "POST",
          url: `sub-categorys-questions`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.addedSuccessfully"));
        this.$router.push({ path: "/sub-categories-questions/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Submit Form

    // Start:: Get Main Categories
    async getMainCategories() {
      this.loading = true;
      try {
        let res = await this.$axios({
          method: "GET",
          url: `categories?page=0&limit=0&is_active=1`,
        });
        this.allMainCategories = res.data.data?.data;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    // End:: Get Main Categories

    // Start:: Get Sub Categories
    async getSubCategories(categoryId) {
      this.loading = true;
      try {
        let res = await this.$axios({
          method: "GET",
          url: `sub-categories?page=0&limit=0&is_active=1&category_id=${categoryId}`,
        });
        this.allSubCategories = res.data.data?.data;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    // End:: Get Sub Categories
  },

  async created() {
    await this.getMainCategories();
  },
};
</script>

<style scoped>
.options_wrapper {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.option_item {
  align-items: center;
}

.form-label {
  font-weight: 600;
  margin-bottom: 10px;
  display: block;
}
</style>