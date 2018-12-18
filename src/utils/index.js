function countObjPropertiesLength(obj) {
  if (typeof obj === 'object') {
    return Object.keys(obj).length
  }

  return 0
}

export { countObjPropertiesLength }
