import Head from 'next/head'

import { SideMenu } from '@/components/SideMenu'

import { isValidElement, useEffect, useState } from 'react'

import { useFetch } from '@/helpers/useFetch'

import { ImageCard } from '@/components/ImageCard'
import { AudioCard } from '@/components/AudioCard'
import { VideoCard } from '@/components/VideoCard'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [checked, setChecked] = useState([])
  const [filteredImages, setFilteredImages] = useState([])
  const [orderedFolders, setOrderedFolders] = useState([])
  const [selectedItem, setSelectedItem] = useState()

  let { response: images, isLoading, error } = useFetch(`/api/s3/images`)

  let { response: folders } = useFetch(`/api/s3/folders`)

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

  const trimEnd = (s, ch) =>
    s[s.length - 1] === ch ? trimEnd(s.substr(0, s.length - 1), ch) : s

  function getFirstPathPart(path) {
    path = trimEnd(path, '/')
    const lastIndex = path.lastIndexOf('/')
    return path.substr(0, lastIndex + 1)
  }

  function filterImages(item) {
    setSelectedItem(item)
    setFilteredImages(
      images.filter((image) => {
        let imagePath = getFirstPathPart(image.src)
        let path = item.name

        return imagePath == path
      })
    )
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

          <SideMenu
            selectedItem={selectedItem}
            orderedFolders={orderedFolders}
            filterImages={filterImages}
          />

          <div className="mx-auto lg:ml-64">
            <section className="py-8">
              <div className="container mx-auto px-4">
                <div className="-m-4 flex flex-wrap">
                  {filteredImages.map((image, index) => {
                    if (image.media_type == 'IMAGE')
                      return <ImageCard key={image.name} image={image} />
                    else if (image.media_type == 'VIDEO')
                      return <VideoCard key={image.name} image={image} />
                    else if (image.media_type == 'AUDIO')
                      return <AudioCard key={image.name} image={image} />
                    return <></>
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
