import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import WaveSurfer from 'wavesurfer.js'

const Waveform = ({ audio }) => {
  const containerRef = useRef()

  useEffect(() => {
    const waveSurfer = WaveSurfer.create({
      container: containerRef.current,
    })
    waveSurfer.load(audio)

    return () => {
      waveSurfer.destroy()
    }
  }, [audio])

  return <div ref={containerRef} />
}

Waveform.propTypes = {
  audio: PropTypes.string.isRequired,
}

export default Waveform
