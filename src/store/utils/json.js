export const parseJsonToObject = (str, defaultValueIfFalse = {}) => {
	if(!str) {
		return defaultValueIfFalse;
	}

	// we will have maximum 2 parse turns
	try{
		const result = JSON.parse(str);
		return typeof result === 'object' ? result : JSON.parse(result);
	} catch(e){
		return defaultValueIfFalse;
	}
}