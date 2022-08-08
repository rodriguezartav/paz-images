import S3 from '@/helpers/s3'

export default async function handler(req, res) {
  const s3 = new S3()
  const images = await s3.getImages()

  res.status(200).json(images)
}
