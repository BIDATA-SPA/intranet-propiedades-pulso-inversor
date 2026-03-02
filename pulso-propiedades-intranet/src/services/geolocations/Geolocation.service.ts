import axios from 'axios'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

const getGeolocation = {
    getGeocode: async (latitude: number, longitude: number) => {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_TOKEN}`

        try {
            const response = await axios.get(url)
            const places = response.data.features

            if (places.length > 0) {
                return [places]
            }
            return 'Ubicación desconocida'
        } catch (error) {
            return 'Error al obtener la dirección'
        }
    },
}

export default getGeolocation
