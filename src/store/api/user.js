import { fetchJson, fetchJsonWithToken } from './common'

export default {
  toggleBlockUser(token, id) {
    return fetchJsonWithToken(token, `/api/user/block/${id}`,
    {
      method: 'PUT',
    })      
  },

  getUser(id){
    return fetchJson(`/api/user/index/${id}`)
  },
  
  getUsers(page, limit=10, where={}){
    const whereParam = Object.keys(where).map(k => k + '=' + encodeURIComponent(where[k])).join('&')
    return fetchJson(`/api/user?page=${page}&limit=${limit}&${whereParam}`)
  },  

  notiUser(token, id, message) {
    return fetchJsonWithToken(token, '/api/user/notiNewUser',
    {
      method: 'POST',
      body: JSON.stringify({ id, message }),
    })      
  },

  updateUser(token, id, item) {
    return fetchJsonWithToken(token, '/api/user/update',
    {
      method: 'POST',
      body: JSON.stringify({ id, item }),
    })      
  },

  deleteUser(token, id){
    return fetchJsonWithToken(token, `/api/user/delete/${id}`,
    {
      method: 'DELETE',
    }) 
  }
}