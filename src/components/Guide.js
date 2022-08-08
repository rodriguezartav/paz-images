import { isValidElement, useEffect, useState } from 'react'

import { PlusSmIcon, PlayIcon } from '@heroicons/react/solid'
import SimpleImage from '@/components//SimpleImage'
import { useFetch } from '@/helpers/useFetch'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [checked, setChecked] = useState([])
  const [filteredImages, setFilteredImages] = useState([])
  const [tags, setTags] = useState([])
  const [open, setOpen] = useState()

  let {
    response: images,
    isLoading,
    error,
  } = useFetch(`${process.env.NEXT_PUBLIC_EXTERNAL_API_URL}/images`)

  let { response: folders } = useFetch(
    `${process.env.NEXT_PUBLIC_EXTERNAL_API_URL}/folders`
  )

  function togglePath(path) {
    let newChecked = checked

    let index = checked.indexOf(path)
    if (index == -1) newChecked = checked.concat(path)
    else {
      checked.splice(index, 1)
    }
    setChecked(newChecked)
    if (newChecked.length == 0) setFilteredImages(images)
    else
      setFilteredImages(
        images.filter((item) => {
          let path = getFirstPathPart(item.src)
          if (newChecked.indexOf(path) > -1) return true
          else return false
        })
      )
  }

  function renderChildren(folders, depth = 0) {
    let padding = 'pl-5'
    if (depth == 1) padding = 'pl-10'
    if (depth == 2) padding = 'pl-15'
    if (depth == 3) padding = 'pl-20'
    if (depth == 4) padding = 'pl-25'

    return folders.map((item) => {
      let name = getLastPathPart(item.name)

      return (
        <>
          {item.children.length == 0 &&
            renderOption(name, item.name, padding, 'mb-3')}
          {item.children.length > 0 && (
            <div>
              {renderOption(name, item.name, padding)}
              {renderChildren(item.children, depth + 1)}
            </div>
          )}
        </>
      )
    })
  }

  function renderOption(option, path, padding) {
    return (
      <div className={`flex items-center ${padding}`}>
        <input
          onChange={(e) => {
            togglePath(path)
          }}
          id={`${path}`}
          name={`${option}[]`}
          defaultValue={option}
          type="checkbox"
          checked={checked[path]}
          className={` focus:ring-indigo-500"  h-4 w-4 rounded border-gray-300 capitalize text-indigo-600`}
        />
        <label htmlFor={path} className="ml-2 text-sm text-gray-600">
          {option}
        </label>
      </div>
    )
  }

  useEffect(() => {
    let t_tags = []
    images && setFilteredImages(images.slice(0, 10))
    images &&
      images.forEach((image) => {
        image.tags_csv &&
          image.tags_csv.split(',').forEach((item) => {
            if (t_tags.indexOf(item) == -1) t_tags.push(item)
          })
      })

    setTags(t_tags)
    return true
  }, images)

  const trimEnd = (s, ch) =>
    s[s.length - 1] === ch ? trimEnd(s.substr(0, s.length - 1), ch) : s

  function getFirstPathPart(path) {
    path = trimEnd(path, '/')
    const lastIndex = path.lastIndexOf('/')
    return path.substr(0, lastIndex + 1)
  }

  function getLastPathPart(path) {
    path = trimEnd(path, '/')
    const lastIndex = path.lastIndexOf('/')
    return path.substr(lastIndex + 1)
  }

  return (
    <div className="bg-white">
      <GuideDialog open={open} setOpen={setOpen} />
      <div>
        <main className="mx-auto max-w-2xl px-4 lg:max-w-7xl lg:px-8">
          <div className="border-b border-gray-200 pt-14 pb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-indigo-500">
              Images @ Paz
            </h1>
            <p className="mt-4 text-base text-gray-500">
              Click on the images to download and on folders and tags to filter.
            </p>
            <p className="mt-1 max-w-xl text-xs text-indigo-700  ">
              Some images are licensed for single use, using them outside of Paz
              may result in legal fees for the unlicensed user.
            </p>
          </div>

          <div className="pt-12 pb-24 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
            <aside>
              <h2 className="sr-only">Filters</h2>

              <button
                type="button"
                className="inline-flex items-center lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="text-sm font-medium text-gray-700">
                  Filters
                </span>
                <PlusSmIcon
                  className="ml-1 h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
              </button>

              <div className="hidden lg:block">
                <form className="space-y-10 divide-y divide-gray-200">
                  <div className={'pt-10'}>
                    <fieldset>
                      <legend className="block text-sm font-medium text-gray-900">
                        Folders
                      </legend>

                      {folders && renderChildren(folders.children)}

                      <legend className="mt-5 block text-sm font-medium text-gray-900">
                        Tags
                      </legend>

                      <div className="space-y-3 pt-6">
                        {tags.map((option, optionIdx) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              id={`${optionIdx}`}
                              name={`${option}[]`}
                              defaultValue={option}
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                              htmlFor={optionIdx}
                              className="ml-3 text-sm text-gray-600"
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                </form>
              </div>
            </aside>

            <section
              aria-labelledby="product-heading"
              className="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3"
            >
              <h2 id="product-heading" className="sr-only">
                Products
              </h2>

              <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-5">
                {filteredImages &&
                  filteredImages.map((product) => {
                    let src = product.src
                    if (product.media_type == 'VIDEO') {
                      let type = getLastPathPart(src)
                      src = src.replace(type.split('.')[1], 'png')
                    }
                    if (product.media_type == 'AUDIO') {
                      src = 'raw/art/audio.jpg'
                    }
                    return (
                      <div
                        onClick={() => setOpen(product)}
                        key={product.id}
                        className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
                      >
                        {(product.media_type == 'AUDIO' ||
                          product.media_type == 'VIDEO') && (
                          <div className="absolute  top-12 left-12 rounded-lg bg-white opacity-70">
                            <PlayIcon
                              className="ml-1 h-14 w-14 flex-shrink-0 text-indigo-500"
                              aria-hidden="true"
                            />
                          </div>
                        )}
                        <div className="aspect-w-3 aspect-h-3 sm:aspect-none sm:h-54 bg-gray-200 group-hover:opacity-75">
                          <SimpleImage
                            width={300}
                            className="h-full w-full object-cover  object-center sm:h-full sm:w-full"
                            transformations={[
                              {
                                cropMode: 'cm_extract',
                                height: 200,
                                width: 200,
                              },
                            ]}
                            src={src}
                          />
                        </div>
                        <div className="flex flex-1 flex-col space-y-2 p-4">
                          <h3 className="text-sm font-medium text-gray-900">
                            <a>
                              <span
                                aria-hidden="true"
                                className="absolute inset-0"
                              />
                              {product.title}
                            </a>
                          </h3>

                          <div className="flex flex-1 flex-col justify-end">
                            <p className="text-sm italic text-gray-500">
                              {product.width} x{product.height} {product.type}
                            </p>
                            <p className="text-xs text-gray-900">
                              {getLastPathPart(product.src)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
