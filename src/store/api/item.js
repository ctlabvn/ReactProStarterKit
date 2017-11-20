/* eslint-disable */
import { apiGet, apiPost } from './common'
import { isUUID } from "~/utils";

export default {
	getDetail(slug_or_uuid, outlet_slug){
    return isUUID(slug_or_uuid)      
      ? apiGet(`/restaurant/items/${slug_or_uuid}`)
      : apiGet(`/restaurant/items/${outlet_slug}/${slug_or_uuid}`);
  }
}

