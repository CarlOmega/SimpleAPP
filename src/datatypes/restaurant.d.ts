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
  author: string,
  rating: number,
  comment: string,
  reply?: string
}