async function compressImage(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
    return new Promise<Blob>((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(blob => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error("Failed to create blob."));
                    }
                }, file.type);
            } else {
                reject(new Error("Canvas context is not available."));
            }
        };

        img.onerror = () => {
            reject(new Error("Image loading error."));
        };
    });
}

export default compressImage;