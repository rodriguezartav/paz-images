import { Fragment, useState } from 'react'

import { DotsVerticalIcon } from '@heroicons/react/solid'
import { useMutate } from '@/helpers/useFetch'

const s3Endpoint = 'https://s3.amazonaws.com/images.paz.co.cr/'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function MapCardModalItem({ item, map, mapKey }) {
  let mapItem = map && map[item.title] ? map[item.title] : {}

  let {
    mutate: mutate,
    isSuccess,
    response,
    error,
  } = useMutate('/api/s3/updateMap')

  function onChangeDescriptId(e) {
    let id = e.currentTarget.value
    let key = map[item.title]
    let newMap = {
      items: { ...map, [key]: { name: item.title, descript_id: id } },
    }
    mutate({
      bucket: 'images.paz.co.cr',
      key: mapKey,
      body: JSON.stringify(newMap),
    })
  }

  return (
    <li key={item.name} className="col-span-1 flex rounded-md shadow-sm">
      <div
        className={classNames(
          mapItem.descript_id ? 'bg-indigo-600' : 'bg-red-500',
          'flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white'
        )}
      >
        {mapItem.descript_id ? 'DN' : 'PN'}
      </div>
      <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white">
        <div className="flex-1 truncate px-4 py-2 text-sm">
          <a
            href={item.href}
            className="font-medium text-gray-900 hover:text-gray-600"
          >
            {item.title}
          </a>
          <div className="mt-1">
            <input
              type="text"
              value={mapItem.descript_id}
              onChange={onChangeDescriptId}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Descript Id"
            />
          </div>
        </div>
        <div className="flex-shrink-0 pr-2">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span className="sr-only">Open options</span>
            <DotsVerticalIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </li>
  )
}
