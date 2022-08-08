const Coconut = require('coconutjs')

function getCoconut() {
  const coconut = new Coconut.Client(process.env.COCONUT_API)

  coconut.notification = {
    type: 'http',
    url: `${process.env.API_URL}/api/coconut/webhook`,
  }

  coconut.storage = {
    service: 's3',
    bucket: 'images.paz.co.cr',
    region: 'us-east-1',
    credentials: {
      access_key_id: process.env.AWS_ACCESS_KEY_ID_,
      secret_access_key: process.env.AWS_SECRET_ACCESS_KEY_,
    },
  }
  return coconut
}

export async function createThumbnails({ src }) {
  const coconut = getCoconut()

  try {
    let promise = new Promise((resolve, reject) => {
      {
        coconut.Job.create(
          {
            input: {
              url: `https://s3.amazonaws.com/images.paz.co.cr/videos/${src}`,
            },
            outputs: {
              'jpg:960x': {
                key: 'jpg:large',
                path: `/video_support/${src}/master_%.2d.jpg`,
                number: 10,
              },
              'jpg:160x84': {
                key: 'jpg:medium',
                path: `/video_support/${src}/thumbs_%.2d.jpg`,
                number: 10,
                square: true,
              },
              'gif:160x84': {
                key: 'gif:preview',
                path: `/video_support/${src}/mobile.gif`,
                scene: {
                  number: 4,
                  duration: 1,
                },
                square: true,
              },
            },
          },
          function (job, err) {
            if (err) reject(err)
            else resolve(job)
          }
        )
      }
    })
    let result = await promise

    return { result: result }
  } catch (e) {
    console.log(e)
    return { error: e }
  }
}

export async function movToMp4({ src }) {
  const coconut = getCoconut()

  try {
    let promise = new Promise((resolve, reject) => {
      {
        coconut.Job.create(
          {
            input: {
              url: `https://s3.amazonaws.com/images.paz.co.cr/videos/${src}`,
            },
            outputs: {
              'jpg:960x': {
                key: 'jpg:large',
                path: `/video_support/${src}/master_%.2d.jpg`,
                number: 10,
              },
              'jpg:240x120': {
                key: 'jpg:medium',
                path: `/video_support/${src}/thumbs_%.2d.jpg`,
                number: 10,
                square: true,
              },
              'gif:240x120': {
                key: 'gif:preview',
                path: `/video_support/${src}/mobile.gif`,
                scene: {
                  number: 4,
                  duration: 1,
                },
                square: true,
              },
            },
          },
          function (job, err) {
            if (err) reject(err)
            else resolve(job)
          }
        )
      }
    })
    let result = await promise

    return { result: result }
  } catch (e) {
    console.log(e)
    return { error: e }
  }
}

export async function createVersions({ src }) {
  const coconut = getCoconut()

  try {
    let promise = new Promise((resolve, reject) => {
      {
        coconut.Job.create(
          {
            input: {
              url: `https://s3.amazonaws.com/images.paz.co.cr/videos/${src}`,
            },
            outputs: {
              'mp4:240p::quality=2': {
                path: `/video_support/${src}/master_240.mp4`,
              },
              'mp4:1080p::quality=5': {
                path: `/video_support/${src}/master.mp4`,
                if: '{{ input.width }} >= 720',
              },
              'jpg:960x': {
                key: 'jpg:large',
                path: `/video_support/${src}/master_%.2d.jpg`,
                number: 10,
              },
              'jpg:240x120': {
                key: 'jpg:medium',
                path: `/video_support/${src}/thumbs_%.2d.jpg`,
                number: 10,
                square: true,
              },
            },
          },
          function (job, err) {
            if (err) reject(err)
            else resolve(job)
          }
        )
      }
    })
    let result = await promise

    return { result: result }
  } catch (e) {
    console.log(e)
    return { error: e }
  }
}
