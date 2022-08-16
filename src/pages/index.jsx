import Head from 'next/head'
import MapCardModal from '@/components/MapCardModal'

import { SideMenu } from '@/components/SideMenu'

import { isValidElement, useEffect, useState } from 'react'

import { useFetch, useMutate } from '@/helpers/useFetch'

import { ImageCard } from '@/components/ImageCard'
import { AudioCard } from '@/components/AudioCard'
import { VideoCard } from '@/components/VideoCard'

const s3Endpoint = 'https://s3.amazonaws.com/images.paz.co.cr'

export default function AppIndex() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [checked, setChecked] = useState([])
  const [filteredImages, setFilteredImages] = useState([])

  const [selectedFolder, setSelectedFolder] = useState({
    name: 'home',
    path: '/',
    files: [],
    children: {},
  })

  let { mutate: loadFolder, response: folders } = useMutate('/api/s3/folders')

  let { response: mapJson } = useFetch(s3Endpoint + '/map.json')

  let { mutate: mutate } = useMutate('/api/s3/updateMap')

  useEffect(() => {
    loadFolder({ path: '' })
  }, [])

  useEffect(() => {
    debugger
    if (selectedFolder) setFilteredImages(selectedFolder.files)
  }, [selectedFolder])

  /*
  useEffect(() => {
    function getLastPathPart(path) {
      path = trimEnd(path, '/')
      const lastIndex = path.lastIndexOf('/')
      return path.substr(lastIndex + 1)
    }

    const trimEnd = (s, ch) =>
      s[s.length - 1] === ch ? trimEnd(s.substr(0, s.length - 1), ch) : s

    if (folders) {
      setOrderedFolders(folders)
    }
    return () => {}
  }, [folders])

  */

  function onSave(key, value) {
    let newMap = {
      items: { ...mapJson.items, [key]: value },
    }
    mutate({
      bucket: 'images.paz.co.cr',
      key: '/map.json',
      body: JSON.stringify(newMap),
    })
  }

  const trimEnd = (s, ch) =>
    s[s.length - 1] === ch ? trimEnd(s.substr(0, s.length - 1), ch) : s

  function getFirstPathPart(path) {
    path = trimEnd(path, '/')
    const lastIndex = path.lastIndexOf('/')
    return path.substr(0, lastIndex + 1)
  }

  return (
    <>
      <Head>
        <title>Paz - Costa Rican retreats</title>
        <meta
          name="description"
          content="Paz's approach to Wellness is to have lots of fun adventures in paradise. Osa Peninsula, Costa Rica"
        />
      </Head>

      <div>
        <div>
          <nav className="bg-gray-800 py-6 px-6 lg:hidden">
            <div className="flex items-center justify-between">
              <a className="text-2xl font-semibold text-white" href="#">
                <img
                  className="h-10"
                  src="artemis-assets/logos/artemis-logo.svg"
                  alt=""
                  width="auto"
                />
              </a>
              <button className="navbar-burger flex items-center rounded focus:outline-none">
                <svg
                  className="block h-8 w-8 rounded bg-indigo-500 p-2 text-white hover:bg-indigo-600"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                >
                  <title>Mobile menu</title>
                  <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                </svg>
              </button>
            </div>
          </nav>

          {folders && (
            <SideMenu
              selectedFolder={selectedFolder}
              folders={folders['home']}
              setSelectedFolder={setSelectedFolder}
            />
          )}

          <div className="mx-auto lg:ml-64">
            <section className="py-8">
              <div className="container mx-auto px-4">
                <div className="-m-4 flex flex-wrap">
                  {filteredImages.map((image, index) => {
                    if (image.media_type == 'IMAGE')
                      return (
                        <ImageCard
                          mutate={mutate}
                          map={mapJson}
                          key={image.name}
                          image={image}
                          onSave={onSave}
                        />
                      )
                    else if (image.media_type == 'VIDEO')
                      return (
                        <VideoCard
                          mutate={mutate}
                          map={mapJson}
                          key={image.name}
                          image={image}
                          onSave={onSave}
                        />
                      )
                    else if (image.media_type == 'AUDIO')
                      return (
                        <AudioCard
                          mutate={mutate}
                          map={mapJson}
                          key={image.name}
                          image={image}
                          onSave={onSave}
                        />
                      )
                    else return <div key={index} />
                  })}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
