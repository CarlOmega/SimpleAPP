interface Restaurant {
  id?: string,
  owner?: string,
  total?: number,
  avg?: number,
  ratings?: number
  name: string,
  description: string,
}

interface Review {
  id?: string,
  author?: string,
  owner?: string,
  rating: number,
  comment: string,
  dateOfVist: number,
  reply?: string
}