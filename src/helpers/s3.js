const AWS = require('aws-sdk')

const s3ls = require('s3-ls')

const fs = require('fs')

const tinify = require('tinify')
tinify.key = process.env.TINY_PANDA_KEY

// Get by URL
const url = require('url')

const URL = 'http://images.paz.co.cr.s3-website-us-east-1.amazonaws.com'

import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'

AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_,
  },
  region: process.env.AWS_REGION_,
})
const stream = require('stream')

export default class S3 {
  constructor(keys) {
    this.s3 = new AWS.S3()
    this.s3client = new S3Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID_,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_,
      },
    })
  }

  get = async function get(bucket, key) {
    var params = {
      Bucket: bucket,
      Key: key,
    }

    try {
      const result = await this.s3.getObject(params).promise()
      return result.Body.toString('utf-8')
    } catch (e) {
      return null
    }
  }

  put = async function put(bucket, key, body, options = {}) {
    var params = {
      Body: body,
      Bucket: bucket,
      Key: key,
      ...options,
    }
    return this.s3.putObject(params).promise()
  }

  upload = async function put(bucket, key, body, options = {}) {
    var params = {
      Body: body,
      Bucket: bucket,
      Key: key,
      ...options,
    }
    return this.s3.upload(params).promise()
  }

  uploadStream = ({ Bucket, Key }) => {
    const pass = new stream.PassThrough()
    return {
      writeStream: pass,
      promise: this.s3.upload({ Bucket, Key, Body: pass }).promise(),
    }
  }

  getFolders = async (path) => {
    let files = await this.getImages()
    files = files.filter((file) => {
      return file.src.indexOf('.DS_Store') == -1
    })

    let folders = { home: { name: 'home', children: {}, files: [] } }

    files.forEach((file) => {
      let fileName = getLastPathPart(file.src)
      let folderName = file.src.replace('/' + fileName, '')

      let parts = folderName.split('/')
      if (
        parts[0] == '' ||
        parts[0] == '/' ||
        parts[0].indexOf('_support') > -1
      )
        return

      let lastFolder = folders.home
      parts.forEach((part) => {
        if (part.length > 0) {
          if (!lastFolder.children[part])
            lastFolder.children[part] = { name: part, children: {}, files: [] }
          lastFolder = lastFolder.children[part]
        }
      })
      lastFolder.files.push(this.getFileObject(fileName, file.src))
    })

    return folders
  }

  getFileObject = function (name, path) {
    let imageObj = {
      src: path,
      name: name.split('.')[0],
      media_type: 'IMAGE',
      title: name.split('.')[0],
      type: name.split('.')[1],
    }

    if (name.indexOf('.mov') > -1 || name.indexOf('.mp4') > -1)
      imageObj.media_type = 'VIDEO'
    if (
      name.indexOf('.mp3') > -1 ||
      name.indexOf('.wav') > -1 ||
      name.indexOf('.m4a') > -1
    )
      imageObj.media_type = 'AUDIO'

    if (name.indexOf('.json') > -1) imageObj.media_type = 'MAP'

    return imageObj
  }

  getImages = async () => {
    const client = this.s3client

    let listCommand = new ListObjectsV2Command({
      Bucket: 'images.paz.co.cr',
    })

    let contents = []
    let lastContinuationToken = null
    let response = await client.send(listCommand)
    contents = contents.concat(response.Contents)
    lastContinuationToken = response.ContinuationToken

    while (lastContinuationToken != null) {
      let continuationCommand = new ListObjectsV2Command({
        Bucket: 'images.paz.co.cr',
        ContinuationToken: lastContinuationToken,
      })
      response = await client.send(continuationCommand)
      contents = contents.concat(response.Contents)
      lastContinuationToken = response.ContinuationToken
    }

    let items = contents.filter(
      (item) =>
        item.Key.indexOf('raw') == -1 &&
        item.Size > 0 &&
        item.Key.indexOf('.DS_Store') == -1
    )

    return items.map((item) => {
      let parts = item.Key.split('/')
      let name = parts.pop()

      let imageObj = {
        src: item.Key,
        media_type: 'IMAGE',
        title: name.split('.')[0],
        type: name.split('.')[1],
      }

      if (name.indexOf('.mov') > -1 || name.indexOf('.mp4') > -1)
        imageObj.media_type = 'VIDEO'
      if (
        name.indexOf('.mp3') > -1 ||
        name.indexOf('.wav') > -1 ||
        name.indexOf('.m4a') > -1
      )
        imageObj.media_type = 'AUDIO'

      if (name.indexOf('.json') > -1) imageObj.media_type = 'MAP'

      return imageObj
    })
  }
}

module.exports = S3

const trimEnd = (s, ch) =>
  s[s.length - 1] === ch ? trimEnd(s.substr(0, s.length - 1), ch) : s

const toSafeDepth = (n) => {
  n = Number(n)
  n = Number.isNaN(n) ? Number.MAX_SAFE_INTEGER : n
  return n < 0 ? Number.MAX_SAFE_INTEGER : n
}

function getLastPathPart(path) {
  path = trimEnd(path, '/')
  const lastIndex = path.lastIndexOf('/')
  return path.substr(lastIndex + 1)
}

function FolderList(options) {
  const lister = s3ls(options)

  async function generate(folder, depth) {
    depth = 8

    let data = await lister.ls(folder)

    let tree = { name: folder, children: [] }

    if (data.folders && data.folders.length) {
      await Promise.all(
        data.folders.map(async (path) => {
          return tree.children.push(
            depth > 0 ? await generate(path, depth - 1) : {}
          )
        })
      )
    }

    tree.children &&
      tree.children.sort((a, b) => {
        let aa = getLastPathPart(a.name)
        let bb = getLastPathPart(b.name)
        if (aa > bb) return 1
        else if (bb > aa) return -1
        else return 0
      })
    return tree
  }

  return { generate }
}
