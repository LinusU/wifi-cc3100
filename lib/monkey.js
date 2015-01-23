
Buffer.prototype.readUInt32TI = function (offset) {
  offset = offset >>> 0;

  return ((this[offset + 2]) |
  (this[offset + 3] << 8) |
  (this[offset + 0] << 16)) +
  (this[offset + 1] * 0x1000000);
};

Buffer.prototype.writeUInt32TI = function (value, offset) {
  value = +value;
  offset = offset >>> 0;

  this[offset + 1] = (value >>> 24);
  this[offset + 0] = (value >>> 16);
  this[offset + 3] = (value >>> 8);
  this[offset + 2] = value;
  return offset + 4;
};
