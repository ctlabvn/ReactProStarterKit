export const parseJsonToObject = (str, defaultValueIfFalse = {}) => {
	if(!str) {
		return defaultValueIfFalse;
	}

	const loopTimes = 10;
	const loopCounter = 0;

	console.log(str);
	if(str.indexOf('\\')) {
		str = str.replace(/\\/g, '');
		console.log(str);
	}

	while(typeof str !== 'object') {
		str = JSON.parse(str);
		this.loopCounter++;
		if(loopCounter > loopTimes) {
			return defaultValueIfFalse;
		}
	}
	return str;
}