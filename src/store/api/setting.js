import { apiGet } from "./common";

export default {
	/*
	type: 1. filter, 2. payment, 3. system
	 */
	getSettingOptions(type = 1) {
		return apiGet("/setting/options", {type: type});
	},

	getSettingTags() {
		return apiGet("/setting/tags");
	}
}