const imageValidation = (images) => {
    let imagesTable = []
    if (Array.isArray(images)) {
        imagesTable = images
    } else {
        imagesTable.push(images)
    }

    if (imagesTable.length > 3) {
        return { error: "A maximum of 3 images is allowed"}
    }
    for (let image of imagesTable) {
        if (image.size > 1048567) /*bytes*/ return { error: "Max allowed file size = 1MB" }
        
        const filetypes = /jpg|jpeg|png/
        const mimetype = filetypes.test(image.mimetype) //mimetype = extension type
        if (!mimetype) return {
            error: "Invalid mimetype(allowed types = .jpg, .jpeg or .png)"}
    }


    return {error: false} // there was no error in this case
}

module.exports = imageValidation