function svgTo (type, svg, filename) {
  return fetch(`http://manuelgc.eu:3002/${type}`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      // px: 666,
      svg: svg,
    })
  })
  .then(function (res) { return res.blob() })
  .then(function (blob) {
    const a = document.createElement("a")
    const objectUrl = URL.createObjectURL(blob)
    a.href = objectUrl
    a.download = filename
    a.click()
    return objectUrl
  })
  .then(function (ou) {
    URL.revokeObjectURL(ou)
  })
  .catch(console.error)
}

function svgToPng (svg, filename) {
  return svgTo("png", svg, filename)
}

/*
function svgToPdf (svg, filename) {
  return svgTo("pdf", svg, filename)
}
*/

function getDownloadViewBox () {
  var viewBoxValue
  var cameraViewContainer = document.querySelector('.camera-view input:checked + label svg')
  if (cameraViewContainer) {
    viewBoxValue = cameraViewContainer.getAttribute('viewBox')
  } else {
    viewBoxValue = '10 10 540 540'
  }
  return viewBoxValue
}

function getSVG () {
  var viewBoxValue = getDownloadViewBox()
  var text = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  id="character" width="560" height="560" viewBox="' + viewBoxValue + '">\n'
  text+='<defs> Copyright (c) 2014-2020 Frederic Guimont, all rights reserved \n <a href="https://creativecommons.org/licenses/by-nc/2.0/">Distributed under the Creative Commons CC-BY-NC license</a> \n Commercial license available to patrons on https://www.patreon.com/charactercreator \n You can recreate this character using this URL: <!--'+window.location.href+'--></defs> \n'
  var svgRaw = document.getElementById('svg1').childNodes
  var svgNodes
  var svgString
  var event

  purgeHiddenLayers()

  // This previous version of the text contains all svg files shown and hidden
  // It will need to be filtered to keep only the layers needed for our purpose
  if (currentUser && currentUser.cc.personnageActuel !== '') {
    filename = currentUser.cc.personnageActuel + '.svg'
  }

  svgNodes = Array.prototype.slice.call(svgRaw)

  svgNodes.forEach(function (item) {
    // This removes only useless layers and allows us to o the next test.
    if (item.innerHTML && (!item.style || !item.style.opacity || item.style.opacity != 0)) {
      svgString = '<g id="' + item.id + '">' + item.innerHTML + '</g>'
      text += svgString
    }
  })

  text += '</svg>'
  return text
}

function getSVGDone () {
  var viewBoxValue = getDownloadViewBox()
  var header1 = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  id="character" width="560" height="560" viewBox="10 10 540 540">\n'
  var header2 = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  id="character" width="560" height="560" viewBox="136 73 290 290">\n'
  var header3 = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  id="character" width="560" height="560" viewBox="242.6 97 80 80">\n'
  var text = '<defs> Copyright (c) 2014-2020 Frederic Guimont, all rights reserved \n <a href="https://creativecommons.org/licenses/by-nc/2.0/">Distributed under the Creative Commons CC-BY-NC license</a> \n Commercial license available to patrons on https://www.patreon.com/charactercreator \n You can recreate this character using this URL: <!--'+window.location.href+'--></defs> \n'
  var svgRaw = document.getElementById('svg1').childNodes
  var svgNodes
  var svgString
  var event

  purgeHiddenLayers()

  // This previous version of the text contains all svg files shown and hidden
  // It will need to be filtered to keep only the layers needed for our purpose
  if (currentUser && currentUser.cc.personnageActuel !== '') {
    filename = currentUser.cc.personnageActuel + '.svg'
  }

  svgNodes = Array.prototype.slice.call(svgRaw)

  svgNodes.forEach(function (item) {
    // This removes only useless layers and allows us to o the next test.
    if (item.innerHTML && (!item.style || !item.style.opacity || item.style.opacity != 0)) {
      svgString = '<g id="' + item.id + '">' + item.innerHTML + '</g>'
      text += svgString
    }
  })

  text += '</svg>'
  return [header1 + text, header2 + text, header3 + text]
}

function download (ev) {
  ev.preventDefault()

  gaga('send', 'event', { eventCategory: 'Navigation', eventAction: 'Download', eventLabel: 'Download SVG file of character' })
  // TODO make the filename the character's name if possible.
  var filename = c.choices.name || 'my_character.svg'
  var pom
  var text = getSVG()
  // TODO Copy the URL before it is erased by the download function.

  const format = document.querySelector("input[name=download-format]:checked").value

  if (format === "png") {
    filename = c.choices.name || 'my_character.png'
    return svgToPng(text, filename)
      .then(function () {
        caboose()
      })
  }

  /*
  if (format === "pdf") {
    filename = c.choices.name || 'my_character.pdf'
    return svgToPdf(text, filename)
      .then(function () {
        caboose()
      })
  }
  */

  pom = document.createElement('a')
  pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
  pom.setAttribute('download', filename)

  if (document.createEvent) {
    event = document.createEvent('MouseEvents')
    event.initEvent('click', true, true)
    pom.dispatchEvent(event)
  } else {
    pom.click()
  }
  caboose()
}

function downloadDone (ev) {
  ev.preventDefault()

  gaga('send', 'event', { eventCategory: 'Navigation', eventAction: 'Download', eventLabel: 'Download SVG file of character' })
  // TODO make the filename the character's name if possible.
  var filename = c.choices.name || 'my_character.svg'
  var pom
  var text = getSVGDone()
  // TODO Copy the URL before it is erased by the download function.

// parent.postMessage('Information from iframe','*');
parent.postMessage({source: 'charactercreator1', payload: text}, 'http://localhost:3500');
parent.postMessage({source: 'charactercreator2', payload: text}, 'http://manuelgc.eu');
parent.postMessage({source: 'charactercreator3', payload: text}, 'https://manuelgc.eu');
//  const format = document.querySelector("input[name=download-format]:checked").value

//  if (format === "png") {
//    filename = c.choices.name || 'my_character.png'
//    return svgToPng(text, filename)
//      .then(function () {
//        caboose()
//      })
//  }

  /*
  if (format === "pdf") {
    filename = c.choices.name || 'my_character.pdf'
    return svgToPdf(text, filename)
      .then(function () {
        caboose()
      })
  }
  */

//  pom = document.createElement('a')
//  pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
//  pom.setAttribute('download', filename)

//  if (document.createEvent) {
//    event = document.createEvent('MouseEvents')
//    event.initEvent('click', true, true)
//    pom.dispatchEvent(event)
//  } else {
//    pom.click()
//  }
//  caboose()
}
