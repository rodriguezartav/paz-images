import {
  createThumbnails,
  createVersions,
  createAudioVersions,
} from '../helpers/coconut'
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
      let supportAudio = `audio_support/${item.src.replace(
        'audios/',
        ''
      )}/master.mp3`

      if (item.src.indexOf('audios/') != 0) return false
      //else if (!imageMap[supportAudio]) return true
      else return true
    })

    let index = 0
    while (index < filteredImages.length) {
      const result = await createAudioVersions({
        src: filteredImages[index].src.replace('audios/', ''),
      })
      console.log(result)
      index++
    }
  } catch (e) {
    console.log(e)
  }
}

execute()
