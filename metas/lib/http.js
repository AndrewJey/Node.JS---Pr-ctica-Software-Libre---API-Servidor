'use strict';

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
const wantsJSON = req => req.accepts(['json', 'html']) !== 'html';
function id(value) {
  if (!/^[1-9]\d{0,9}$/.test(String(value)) || Number(value) > 2147483647)
    throw new HttpError(400, 'El identificador no es válido.');
  return Number(value);
}
function text(value, label, maximum = 255) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maximum)
    throw new HttpError(400, `${label} es obligatorio y admite hasta ${maximum} caracteres.`);
  return value.trim();
}
async function record(model, value) {
  const row = await model.findByPk(id(value));
  if (!row) throw new HttpError(404, 'El registro no existe.');
  return row;
}
module.exports = {HttpError, wantsJSON, id, text, record};
