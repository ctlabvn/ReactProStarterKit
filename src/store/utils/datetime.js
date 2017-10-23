import moment from "moment";

// return monday, tuesday ...
export const getTodayString = () => {
	return moment().format('dddd');
};

export const parseJsonToObject = (str) => {
	const loopTimes = 10;
	const loopCounter = 0;
	while(typeof str !== 'object') {
		str = JSON.parse(str);
		this.loopCounter++;
		if(loopCounter > loopTimes) {
			return {};
		}
	}
	return str;
}