import { downloadResource } from '@/helpers/dowload'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'

/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/outline'

const s3Endpoint = 'https://s3.amazonaws.com/images.paz.co.cr/'

export function AudioCard(props) {
  const [open, setOpen] = useState(false)
  let audio = props.image
  let audioSrc =
    s3Endpoint + `audio_support/${audio.src.replace('audios/', '')}/master.mp3`

  return (
    <div key={audio.name} className="w-full p-4 md:w-1/2 lg:w-1/5">
      {open && (
        <Modal
          mapItem={
            props.map[audio.src] || {
              src: audio.src,
              name: audio.title || audio.name,
            }
          }
          onSave={props.onSave}
          item={audio}
          setOpen={setOpen}
          open={open}
        />
      )}
      <div className="rounded bg-white p-6">
        <div className="mb-2 flex items-center">
          <span className="mr-3 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-500">
            <svg
              width={10}
              height={10}
              viewBox="0 0 18 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.8335 2.58333H9.60014L9.33348 1.75C9.1606 1.26102 8.83993 0.837918 8.41589 0.539299C7.99185 0.24068 7.48544 0.0813322 6.96681 0.0833316H3.16681C2.50377 0.0833316 1.86788 0.346724 1.39904 0.815565C0.930201 1.28441 0.666809 1.92029 0.666809 2.58333V13.4167C0.666809 14.0797 0.930201 14.7156 1.39904 15.1844C1.86788 15.6533 2.50377 15.9167 3.16681 15.9167H14.8335C15.4965 15.9167 16.1324 15.6533 16.6012 15.1844C17.0701 14.7156 17.3335 14.0797 17.3335 13.4167V5.08333C17.3335 4.42029 17.0701 3.78441 16.6012 3.31557C16.1324 2.84672 15.4965 2.58333 14.8335 2.58333ZM15.6668 13.4167C15.6668 13.6377 15.579 13.8496 15.4227 14.0059C15.2665 14.1622 15.0545 14.25 14.8335 14.25H3.16681C2.9458 14.25 2.73383 14.1622 2.57755 14.0059C2.42127 13.8496 2.33348 13.6377 2.33348 13.4167V2.58333C2.33348 2.36232 2.42127 2.15036 2.57755 1.99408C2.73383 1.8378 2.9458 1.75 3.16681 1.75H6.96681C7.14151 1.74955 7.31194 1.80401 7.454 1.9057C7.59606 2.00739 7.70257 2.15115 7.75848 2.31667L8.20848 3.68333C8.26438 3.84885 8.37089 3.99261 8.51295 4.0943C8.65501 4.19598 8.82544 4.25045 9.00014 4.25H14.8335C15.0545 4.25 15.2665 4.3378 15.4227 4.49408C15.579 4.65036 15.6668 4.86232 15.6668 5.08333V13.4167Z"
                fill="#E6D4F8"
              />
            </svg>
          </span>
          <div>
            <p className="text-xs font-bold">{audio.title}</p>
          </div>
        </div>
        <div>
          <div className="mb-3 flex items-center justify-between">
            <audio controls className=" w-full rounded-md" src={audioSrc} />
          </div>

          <div className="flex items-center justify-between">
            <span className="mr-2 inline-block rounded-full bg-indigo-50 py-1 px-2 text-xs text-indigo-500">
              {audio.type}
            </span>

            <button
              onClick={() => downloadResource(videoSrc)}
              className=' bg-indigo-200" flex h-6 w-8 items-center justify-center  rounded-lg border-2 border-white'
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="{2}"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </button>

            <button
              onClick={() => setOpen(true)}
              className="  flex h-6 w-8 items-center justify-center rounded-lg  border-2 border-white"
              aria-hidden="true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-indigo-500"
                fill="#fff"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Modal({ open, onSave, setOpen, item, mapItem }) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative ml-80 transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-6xl sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <div className="mt-2">
                      <Form
                        mapItem={mapItem}
                        item={item}
                        onSave={onSave}
                        onClose={() => setOpen(false)}
                      />
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

function Form(props) {
  let { item, mapItem } = props

  function onSave(e) {
    let id = e.currentTarget.value
    let key = mapItem.src

    props.onSave(key, { name: item.title, src: item.src, descript_id: id })
  }

  return (
    <div className=" space-y-8 divide-y divide-gray-200 ">
      <div className="space-y-8 divide-y divide-gray-200">
        <div>
          <div className="mx-auto   grid max-w-lg  ">
            <div>
              <h3 className="leading-6  text-lg font-medium text-gray-900">
                Edit audio settings
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Fill in the optional information
              </p>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* 
              <div className="sm:col-span-3">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  First name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

           
              <div className="sm:col-span-3">
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    autoComplete="family-name"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

               */}
              <div className="sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-left text-sm font-medium text-gray-700"
                >
                  Descript Id
                </label>
                <div className="mt-1">
                  <input
                    value={mapItem.descriptId}
                    onChange={onSave}
                    type="text"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* 
              <div className="sm:col-span-3">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country
                </label>
                <div className="mt-1">
                  <select
                    id="country"
                    name="country"
                    autoComplete="country-name"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>Mexico</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="postal-code"
                  className="block text-sm font-medium text-gray-700"
                >
                  ZIP / Postal code
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="postal-code"
                    id="postal-code"
                    autoComplete="postal-code"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
          */}
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              onClick={props.onClose}
              type="button"
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              onClick={props.onSave}
              type="submit"
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
