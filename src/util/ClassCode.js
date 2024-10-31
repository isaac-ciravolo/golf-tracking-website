function generateClassCode() {
  const code = Math.random().toString(36).substring(2, 8); // 8-character alphanumeric code
  return code;
}

export default generateClassCode;
