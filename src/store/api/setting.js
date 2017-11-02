import { apiGet } from "./common";

export default {

	getSettingCurrencies() {
		return apiGet("/setting/currencies");
	},

	getSettingLanguages() {
		return apiGet("/setting/languages");
	},

	getSettingTags() {
		return apiGet("/setting/tags");
	},

	getSettingCountries() {
		return apiGet("/setting/countries");
	},

	getSettingCities(country_code) {
		return apiGet("/setting/cities", {country_code: country_code});
	},

	/*
	type: 1. filter, 2. payment, 3. system
	 */
	getSettingOptions(type = 1) {
		return apiGet("/setting/options", {type: type});
	},
}