import axios from 'axios'

const DataService = {
  getData: function (url) {
    return axios.get(url)
  },
  postData: (url, requestBody) => {
    return axios.post(url, requestBody)
  },
  postDataV1: (url, requestBody, config) => {
    return axios.post(url, requestBody, config)
  },
  getDataV1: (url, config) => {
    return axios.get(url, config)
  }
}

export default DataService
