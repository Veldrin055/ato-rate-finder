import * as _ from 'lodash'

export const arrayWindow = <T>(array: T[], pivot: number, maxWindow: number, callback: (window: T[]) => void) => {
  for(let i = 1; i <= maxWindow; i++) {
    const windowStart = pivot - i + 1
    for(let x = 0; x < i; x++) {
      const slice = _.slice(array, windowStart + x, windowStart + x + i)
      callback(slice)
    }  
  }
}