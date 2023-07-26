export const capitalizeFirstLetter = (
  str: string | undefined,
): string | undefined => {
  if (str) {
    if (str.length === 0) {
      return str
    }

    const firstLetter = str.charAt(0).toUpperCase()
    const remainingLetters = str.slice(1)

    return firstLetter + remainingLetters
  }
}