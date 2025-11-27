import ApiService from '@/services/ApiService'

export async function createReview(formData: FormData) {
  return ApiService.fetchData({
    url: 'review',
    method: 'post',
    data: formData,
  })
}

export default { createReview }
