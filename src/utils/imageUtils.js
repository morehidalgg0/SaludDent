// Reads an image File and returns a compressed JPEG data URL.
// Images are resized so their longest side is at most `maxDim` and re-encoded as JPEG,
// keeping the payload small enough to persist inside the medical record's JSON attachments.
export function fileToCompressedImage(file, { maxDim = 1600, quality = 0.82 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('El archivo seleccionado no es una imagen.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('No se pudo procesar la imagen.'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const scale = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// Rough byte size of a base64 data URL.
export function dataUrlByteSize(dataUrl) {
  if (!dataUrl) return 0;
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
  return Math.round(base64.length * 0.75);
}

// Builds the attachment object stored on a medical record.
export async function buildImageAttachment(file) {
  const dataUrl = await fileToCompressedImage(file);
  return {
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: file.name || 'imagen.jpg',
    type: 'image/jpeg',
    size: dataUrlByteSize(dataUrl),
    dataUrl,
    createdAt: new Date().toISOString()
  };
}
