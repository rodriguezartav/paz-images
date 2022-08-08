import { createThumbnails } from '@/helpers/coconut'

export default async function handler(req, res) {
  try {
    const result = await createThumbnails({ src: 'danta/IMG_4281.MOV' })
    return res.send({ result: result })
  } catch (e) {
    return res.send({ error: e })
  }
}
