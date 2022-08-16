import S3 from '@/helpers/s3'

export default async function handler(req, res) {
  const s3 = new S3()
  const folders = await s3.getFolders(req.body.path)

  res.status(200).json(folders)
}
