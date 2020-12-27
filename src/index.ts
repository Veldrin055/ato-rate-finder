import prompts from 'prompts'

import { arrayWindow } from './arrayWindow'
import { getRates } from './ato'
import { formatDate } from './dates'

const selectDate = async (dates: DateRate[]) => {
  const response = await prompts({
    type: 'select',
    name: 'month',
    message: 'Select date to average over',
    choices: dates.map(({ date }, value) =>({ value, title: formatDate(date) }))  
  })

  return response.month
}

(async () => {
  console.log('Downloading rates from ATO...')
  const rates = await getRates()
  console.log('Done')
  const pivot = await selectDate(rates)

  let best = 0
  let msg = ''
  console.log(`selected date is ${rates[pivot].date}`)
  arrayWindow(rates, pivot, 12, (window) => {
    // console.log(`run ${i++}=${JSON.stringify(window)}, size=${window.length}`)
    const average = window.reduce((a, b) => (a + b.rate), 0) / window.length
    // console.log(`run=${i++}, avg=${average}, from ${window[0].date} to ${window[window.length - 1].date}`)
    if (average > best) {
      best = average
      msg = `best rate is ${best}, from ${formatDate(window[0].date)} to ${formatDate(window[window.length - 1].date)}`
    }
  })
  if (!best) {
    console.error('Could not find a valid rate')
  } else {
    console.log(msg)
  }
})()


