export const parseJsonToresult = (str, defaultValueIfFalse = {}) => {
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
	
	if(typeof result === 'object') {
		return result;
	} else if(typeof result === 'string') {
		return parseJsonToresult(result);
	} else {
		return defaultValueIfFalse;
	}
}