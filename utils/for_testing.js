const palindrome = (string) => {

  if(string === undefined) return undefined
    return string
      .split('')
      .reverse()
      .join('')
  }
  
  const average = (array) => {
    if(array === undefined || array === null || array.length ===0) return 0
    const reducer = (sum, item) => {
      return sum + item
    }
  
    return array.reduce(reducer, 0) / array.length
  }
  
  module.exports = {
    palindrome,
    average,
  }