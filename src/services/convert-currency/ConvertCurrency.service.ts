import axios from 'axios'

const apikey = import.meta.env.VITE_API_URL_EXCHANGE_RATE_UF_API_KEY

const ExchangeRateServices = {
  getExchangeRateUF: async () => {
    try {
      const response = await axios.get(
        `https://api.cmfchile.cl/api-sbifv3/recursos_api/uf?apikey=${apikey}&formato=json`
      )
      return response.data
    } catch (error) {
      throw new Error(error)
    }
  },
}

export default ExchangeRateServices
