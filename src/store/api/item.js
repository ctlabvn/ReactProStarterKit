import { apiGet, apiPost } from './common'

export default {
	getDetail(uuid){
    return apiGet(`/restaurant/items/${uuid}`, {uuid: uuid})
  }
}

