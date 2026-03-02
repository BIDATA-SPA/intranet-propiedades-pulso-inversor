import axios from 'axios'

// UF
export type UFApiResponse = {
  UFs: {
    Valor: string
    Fecha: string
  }[]
}
export type UFQueryParams = {
  apiKey: string | number
}

//UTM
export type UTMApiResponse = {
  UTMs: {
    Valor: string
    Fecha: string
  }[]
}
export type UTMQueryParams = {
  apiKey: string | number
}

//Dolar
export type USDApiResponse = {
  Dolares: {
    Valor: string
    Fecha: string
  }[]
}
export type USDQueryParams = {
  apiKey: string | number
}

export async function getExchangeRate(
  apiKey: string | number
): Promise<UFApiResponse> {
  const url =
    'https://api.cmfchile.cl/api-sbifv3/recursos_api/uf?apikey=b3c682f4e4e29811fa1fd8d3781a463b59181fb7&formato=json' ||
    ''
  const params: UFQueryParams = {
    apiKey: apiKey,
  }
  try {
    const response = await axios.get<UFApiResponse>(url, { params })

    if (response.status !== 200) {
      throw new Error('La solicitud no se completó correctamente.')
    }

    return response.data
  } catch (error) {
    throw new Error('Error')
  }
}

export async function getExchangeRateUTM(
  apiKey: string | number
): Promise<UTMApiResponse> {
  const url =
    'https://api.cmfchile.cl/api-sbifv3/recursos_api/utm?apikey=b3c682f4e4e29811fa1fd8d3781a463b59181fb7&formato=json' ||
    ''
  const params: UTMQueryParams = {
    apiKey: apiKey,
  }
  try {
    const response = await axios.get<UTMApiResponse>(url, { params })

    if (response.status !== 200) {
      throw new Error('La solicitud no se completó correctamente.')
    }

    return response.data
  } catch (error) {
    throw new Error('Error')
  }
}

export async function getExchangeRateUSD(
  apiKey: string | number
): Promise<USDApiResponse> {
  const url =
    'https://api.cmfchile.cl/api-sbifv3/recursos_api/dolar?apikey=b3c682f4e4e29811fa1fd8d3781a463b59181fb7&formato=json' ||
    ''
  const params: USDQueryParams = {
    apiKey: apiKey,
  }
  try {
    const response = await axios.get<USDApiResponse>(url, { params })

    if (response.status !== 200) {
      throw new Error('La solicitud no se completó correctamente.')
    }

    return response.data
  } catch (error) {
    throw new Error('Error')
  }
}
