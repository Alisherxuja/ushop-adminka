import http from "@/plugins/Axios";

export function getErrorMessages(err) {
    if (err && err.response && err.response.data && err.response.data.errors) {
        return err.response.data.errors
    }
    return {}
}

export function fetchFileAndParseToDataUrl(url) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch(url);
            const blob = await res.blob()
            const dataUrl = await parseFileToDataUrl(blob)
            resolve({dataUrl, original: url})
        } catch (e) {
            reject(e)
        }
    })
}

export function parseFileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        if (!file) reject('File not defined')
        const reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onloadend = () => resolve(reader.result)
    })
}

export function dataURItoBlob(dataURI) {
    if (typeof dataURI !== 'string') {
        throw new Error('Invalid argument: dataURI must be a string')
    }
    dataURI = dataURI.split(',');
    let type = dataURI[0].split(':')[1].split(';')[0],
        byteString = atob(dataURI[1]),
        byteStringLength = byteString.length,
        arrayBuffer = new ArrayBuffer(byteStringLength),
        intArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteStringLength; i++) {
        intArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([intArray], {
        type: type
    })

}


export function validateFileType(file, type) {
    if (typeof type === "string") {
        return file.type === type
    } else if (Array.isArray(type)) {
        return type.some(type => file.type === type)
    }
    return false
}

export function uploadFileMaxSize(file, maxSize) {
    return (file.size / 1024) < maxSize
}

export function uploadImageMinSize(file, size) {
    return new Promise((resolve, reject) => {
        if (file) {
            parseFileToDataUrl(file).then(url => {
                const img = new Image();
                img.src = url;
                img.onload = () => {
                    const width = img.width
                    const height = img.height
                    resolve(width > size && height > size)
                }

            })
        } else {
            reject('file not defined')
        }
    })
}

export function debounce(callback, time) {
    let interval;
    return () => {
        clearTimeout(interval);
        interval = setTimeout(() => {
            interval = null;
            callback.apply(callback, arguments);
        }, time);
    };
}


export const fetchBlobByUrl = (url) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch(url)
            const blob = await res.blob()
            resolve(blob)
        } catch (e) {
            reject(e)
        }

    })
}


export const clearUploadInput = (el) => {
    el.setAttribute('type', 'text')
    el.setAttribute('type', 'file')
}


export const blobToDataUrl = (blob) => {
    return new Promise(resolve => {
        const fileReader = new FileReader()
        fileReader.onload = () => {
            resolve(fileReader.result)
        }
        fileReader.readAsDataURL(blob)
    })
}

