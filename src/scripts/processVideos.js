import { createThumbnails, createVersions } from '../helpers/coconut'
import S3 from '../helpers/s3'

export default async function execute() {
  try {
    const s3 = new S3()
    const images = await s3.getImages()

    let imageMap = {}
    images.forEach((item) => {
      imageMap[item.src] = item
    })

    let filteredImages = images.filter((item) => {
      let supportVideo = `video_support/${item.src.replace(
        'videos/',
        ''
      )}/master.mp4`

      if (item.src.indexOf('videos/') != 0) return false
      //else if (!imageMap[supportVideo]) return true
      else return true
    })

    let index = 0
    while (index < filteredImages.length) {
      const result = await createVersions({
        src: filteredImages[index].src.replace('videos/', ''),
      })
      console.log(result)
      index++
    }
  } catch (e) {
    console.log(e)
  }
}

execute()
