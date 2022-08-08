import { IKImage } from 'imagekitio-react'
import React, { useState, useEffect, useRef } from 'react'

import SimpleImage from './SimpleImage'

const urlEndpoint = 'https://ik.imagekit.io/paz/'
const s3Endpoint = 'https://s3.amazonaws.com/images.paz.co.cr/'

export default function MyImage(props) {
  let {
    src,
    width,
    height,
    transformations,
    thumbnailIndex,
    showPlayIcon = true,
    className,
    useGif,
  } = props

  let newSrc = src.replace('videos/', 'video_support/') + '/master.mp4'
  let kitSrc = src + '?tr=w-600'

  return (
    <div className="relative mx-auto w-full lg:max-w-6xl">
      <video
        style={{ maxHeight: '80vh' }}
        className={className + '  w-full'}
        controls="true"
        autoPlay="true"
        src={urlEndpoint + kitSrc}
      />
    </div>
  )
}
