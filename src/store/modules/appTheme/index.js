import AppThemeMutations from "./mutations";
import AppThemeActions from "./actions.js";
import AppThemeGetters from "./getters.js";

export default {
  namespaced: true,

  state: {
    // START:: THEME DATA
    bonian_admin_dashboard_theme: localStorage.getItem(
      "bonian_admin_dashboard_theme"
    ),
    // END:: THEME DATA
  },

  mutations: AppThemeMutations,
  actions: AppThemeActions,
  getters: AppThemeGetters,
};
