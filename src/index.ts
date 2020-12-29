#!/usr/bin/env node
import prompts from 'prompts'
import c from 'ansi-colors'

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

const continuePrompt = async () => {
  const toggle = await prompts({
    type: 'toggle',
    name: 'value',
    initial: false,
    message: 'Do another one?',
    active: 'Yes',
    inactive: 'No',
  })

  return toggle.value
}

const findOptimalAverage = async (rates: DateRate[]) => {
  const pivot = await selectDate(rates)

  let best = 0
  let msg = ''
  console.log(`Selected date is ${rates[pivot].date}`)
  arrayWindow(rates, pivot, 12, (window) => {
    // console.log(`run ${i++}=${JSON.stringify(window)}, size=${window.length}`)
    const average = window.reduce((a, b) => (a + b.rate), 0) / window.length
    // console.log(`run=${i++}, avg=${average}, from ${window[0].date} to ${window[window.length - 1].date}`)
    if (average > best) {
      best = average
      msg = `Best rate is ${c.bold.green(best.toFixed(4))}, from ${c.bold.yellow(formatDate(window[0].date))} to ${c.bold.magenta(formatDate(window[window.length - 1].date))}`
    }
  })
  if (!best) {
    console.error(c.red('Could not find a valid rate'))
  } else {
    console.log(msg)
  }
}

(async () => {
  console.log('Downloading rates from ATO...')
  const rates = await getRates()
  console.log(c.green('Done'))
  let cont = true
  while (cont) {
    await findOptimalAverage(rates)
    cont = await continuePrompt()
  }
  
})()


