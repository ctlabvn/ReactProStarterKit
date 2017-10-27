export const parseJsonToObject = (str, defaultValueIfFalse = {}) => {
	if(!str) {
		return defaultValueIfFalse;
	}

	// we will have maximum 2 parse turns
	let result;
	try{
		result = JSON.parse(str);
	} catch(e){
		return defaultValueIfFalse;
	}

	if(typeof result == 'object') {
		return result;
	}

	try{
		return JSON.parse(result);
	} catch(e){
		return defaultValueIfFalse;
	}
}