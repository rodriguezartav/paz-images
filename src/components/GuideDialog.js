import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon, PlayIcon } from "@heroicons/react/outline";
import SimpleImage from "../SimpleImage";
import SimpleVideo from "../SimpleVideo";
const urlEndpoint = "https://ik.imagekit.io/paz/";

export default function GuideDialog({ open, setOpen }) {
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowCheck(false);
    }, 3000);
  });

  function getLastPathPart(path) {
    path = trimEnd(path, "/");
    const lastIndex = path.lastIndexOf("/");
    return path.substr(lastIndex + 1);
  }

  const trimEnd = (s, ch) =>
    s[s.length - 1] === ch ? trimEnd(s.substr(0, s.length - 1), ch) : s;

  return (
    <Transition.Root show={open != null} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setOpen(null)}>
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

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-sm sm:w-full sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg pb-4 leading-6 font-medium text-indigo-700"
                    >
                      Image Download and Links
                    </Dialog.Title>

                    {open && (
                      <div className="mt-2 relative">
                        {showCheck && (
                          <CheckIcon
                            className="h-32 rounded-lg w-32 opacity-90 absolute top-28 left-28 text-green-600 bg-white"
                            aria-hidden="true"
                          />
                        )}

                        {open.media_type == "IMAGE" && (
                          <SimpleImage
                            width={300}
                            className="w-full h-full object-center object-cover sm:w-full sm:h-full"
                            transformations={[
                              {
                                cropMode: "cm_extract",
                                height: 200,
                                width: 200,
                              },
                            ]}
                            src={open.src}
                          />
                        )}

                        {open.media_type == "VIDEO" && (
                          <SimpleVideo
                            src={open.src}
                            className="w-full h-full object-center object-cover sm:w-full sm:h-full"
                          />
                        )}

                        {open.media_type == "AUDIO" && (
                          <SimpleVideo
                            src={open.src}
                            className="w-full h-full object-center object-cover sm:w-full sm:h-full"
                          />
                        )}

                        <p className="text-sm font-medium w-full truncate pt-3 text-left text-indigo-600 ">
                          Link
                        </p>
                        <div
                          className=" cursor-pointer "
                          onClick={() => {
                            setShowCheck(true);
                            navigator.clipboard.writeText(open.src);
                          }}
                        >
                          <p className="text-sm w-full truncate px-3 text-gray-500">
                            {urlEndpoint + open.src}
                          </p>
                          <p className="text-xs w-full truncate  text-gray-500">
                            click to copy
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    onClick={() => {
                      var anchor = document.createElement("a");
                      anchor.href = open.src;
                      anchor.target = "_blank";
                      anchor.download = getLastPathPart(open.src);
                      anchor.click();
                      setShowCheck(true);

                      setTimeout(() => {
                        setOpen(null);
                      }, 2000);
                    }}
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => {
                      setOpen(null);
                    }}
                    type="button"
                    className="inline-flex mt-5 justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-50 text-base font-medium text-indigo-400 hover:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
