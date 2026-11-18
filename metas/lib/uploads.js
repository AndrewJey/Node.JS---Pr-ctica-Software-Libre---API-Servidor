'use strict';
const fs = require('node:fs/promises');
const path = require('node:path');
const {randomUUID} = require('node:crypto');
const {HttpError} = require('./http');
const uploadDir = path.resolve(process.env.METAS_UPLOAD_DIR || path.join(__dirname, '../var/uploads'));

async function savePicture(file) {
  if (!file) return null;
  if (Array.isArray(file) || !Buffer.isBuffer(file.data) || file.truncated || file.size > 5 * 1024 * 1024)
    throw new HttpError(400, 'Selecciona una sola imagen de hasta 5 MB.');
  const data = file.data;
  let extension;
  if (data.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) extension = 'png';
  else if (data.length > 3 && data[0] === 255 && data[1] === 216 && data[2] === 255) extension = 'jpg';
  else if (['GIF87a', 'GIF89a'].includes(data.subarray(0,6).toString())) extension = 'gif';
  else if (data.subarray(0,4).toString() === 'RIFF' && data.subarray(8,12).toString() === 'WEBP') extension = 'webp';
  if (!extension) throw new HttpError(400, 'La imagen debe ser PNG, JPEG, GIF o WebP.');
  const filename = `${randomUUID()}.${extension}`;
  await fs.mkdir(uploadDir, {recursive:true});
  await file.mv(path.join(uploadDir, filename));
  return '/images/uploads/' + filename;
}

async function removePicture(url, model) {
  if (!/^\/images\/uploads\/[a-f0-9-]+\.(png|jpg|gif|webp)$/.test(url || '')) return;
  if (model && await model.count({where:{picture:url}})) return;
  await fs.unlink(path.join(uploadDir, path.basename(url))).catch(error => {
    if (error.code !== 'ENOENT') console.warn('No se pudo limpiar una imagen de producto.');
  });
}
module.exports = {uploadDir, savePicture, removePicture};
