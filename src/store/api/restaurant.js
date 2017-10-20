import { apiGet, apiPost } from './common'

export default {
  getOutlets(page = 1){
    return apiGet('/restaurant/outlets', {page: page, pagination: 20})
  },

  getOutlet(uuid){
    return apiGet(`/restaurant/outlets/${uuid}`)
  },

  getProductByCategory(category_uuid){
    return apiGet('/restaurant/items', {category_uuid: category_uuid, pagination: 100})
  },

	getFeatureItem(outlet_uuid) {
		return apiGet('/restaurant/featured/items', {outlet_uuid: outlet_uuid, featured: 1})
  },

  getRestaurantTag(outlet_uuid) {
    return apiGet('/restaurant/tags', {outlet_uuid: outlet_uuid})
  }

}

