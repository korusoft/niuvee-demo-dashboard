import { generateLatest } from '../_lib/mockAgriculture.js'

export default async function handler(req, res) {
  res.status(200).json(generateLatest())
}
