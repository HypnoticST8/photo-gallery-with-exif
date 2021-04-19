"use strict"

// CSS class names for gallery item elements
const parentStyle = 'gallery__item'
const thumbnailStyle = 'gallery__thumbnail'
const infoStyle = 'gallery__info'
const nameStyle = 'gallery__file-data'
const gpsCoordinatesStyle = 'gallery__file-data'
const deleteButtonStyle = 'gallery__delete-item'

const photoInput = document.querySelector('#photo')
const galleryRoot = document.querySelector('#gallery')
const template = document.querySelector('template')

const imageFileNotSelectedMassage = 'No image file selected'
const noEXIFLocationMassage = "Photo doesn't contain GPS data"


function addImageToGallery(event) {
  event.stopPropagation()

  if (!event.target.files[0]) {
    alert(imageFileNotSelectedMassage)
    return
  }

  const reader = new FileReader()
  const image = event.target.files[0]

  const clonedTemplate = document.importNode(template.content, true)
  const photoName = clonedTemplate.querySelector('#photo-name')
  const photoGPS = clonedTemplate.querySelector('#photo-gps')
  const photoThumbnail = clonedTemplate.querySelector(`.${thumbnailStyle}`)

  extractExifData(image, photoName, photoGPS)

  reader.readAsDataURL(image)
  reader.onload = () => {
    photoThumbnail.src = reader.result
    galleryRoot.appendChild(clonedTemplate)
  }
}

function removeGalleryItem(event) {
  event.stopPropagation()

  if (
    event.target.tagName == 'BUTTON' &&
    event.target.className == deleteButtonStyle &&
    event.target.closest('section').classList.contains(parentStyle)
  ) {
    event.target.closest('section').remove()
    return
  }
}

function extractExifData(image, name, GPScoordinates) {
  EXIF.getData(image, function() {
    if (EXIF.getTag(this, 'GPSLongitude') || EXIF.getTag(this, 'GPSLatitude')) {
      const longitude = EXIF.getTag(this, 'GPSLongitude')
      const longitudeRef = EXIF.getTag(this, 'GPSLongitudeRef')
      const latitude = EXIF.getTag(this, 'GPSLatitude')
      const latitudeRef = EXIF.getTag(this, 'GPSLatitudeRef')

      const formattedLongitude = `${longitude[0]}\xB0 ${longitude[1]}' ${longitude[2].toFixed(3)}'' ${longitudeRef}`
      const formattedLatitude = `${latitude[0]}\xB0 ${latitude[1]}' ${latitude[2].toFixed(3)}'' ${latitudeRef}`

      name.innerText = this.name
      GPScoordinates.innerText = `${formattedLongitude} / ${formattedLatitude}`
    } else {
      GPScoordinates.innerText = noEXIFLocationMassage
    }

    name.removeAttribute('id')
    GPScoordinates.removeAttribute('id')
  })
}

photoInput.addEventListener('change', addImageToGallery)
galleryRoot.addEventListener('click', removeGalleryItem)