export function downloadBlob(blob, filename) {
  var a = document.createElement('a')
  a.download = filename
  a.href = blob
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export function downloadResource(url) {
  let filename = url.split('\\').pop().split('/').pop()
  fetch(url, {
    mode: 'no-cors',
  })
    .then((response) => response.blob())
    .then((blob) => {
      let blobUrl = window.URL.createObjectURL(blob)
      downloadBlob(blobUrl, filename)
    })
    .catch((e) => {
      console.error(e)
    })
}
