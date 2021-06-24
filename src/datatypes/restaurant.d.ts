interface Restaurant {
  id: string,
  owner: string,
  name: string,
  description: string,
  total: number,
  ratings: number,
  avg: number
}

interface Review {
  id: string,
  restaurantId: string,
  author: string,
  owner: string,
  rating: number,
  comment: string,
  dateOfVisit: number,
  reply: string
}