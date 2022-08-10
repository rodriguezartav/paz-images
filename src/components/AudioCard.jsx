import { useState } from 'react'
import { useFetch } from '../helpers/useFetch'

import { downloadResource } from '@/helpers/dowload'

const s3Endpoint = 'https://s3.amazonaws.com/images.paz.co.cr/'

export function AudioCard(props) {
  let audio = props.image
  let audioSrc =
    s3Endpoint + `audio_support/${audio.src.replace('audios/', '')}/master.mp3`

  return (
    <div key={audio.name} className="w-full p-4 md:w-1/2 lg:w-1/5">
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

          <div className="flex items-center">
            <span className="mr-2 inline-block rounded-full bg-indigo-50 py-1 px-2 text-xs text-indigo-500">
              {audio.type}
            </span>

            <a
              onClick={() => downloadResource(audioSrc)}
              className={`cursor-pointer text-xs font-medium text-gray-500 `}
            >
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
