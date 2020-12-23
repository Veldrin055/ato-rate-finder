import * as _ from 'lodash'
import { Tabletojson } from 'tabletojson'

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',]

type TableRate = {
  [key: string]: string
}

type DateRate = {
  date: Date,
  rate: number,
}

const runner = async () => {

  const urls = [
    'https://www.ato.gov.au/Tax-professionals/TP/Monthly-exchange-rates-for-1-July-2019-to-30-June-2020/',
    'https://www.ato.gov.au/Tax-professionals/TP/1-July-2018-to-30-June-2019/',
    'https://www.ato.gov.au/Tax-professionals/TP/1-July-2017-to-30-June-2018/',
    'https://www.ato.gov.au/Tax-professionals/TP/1-July-2016-to-30-June-2017/',
  ]


  const tables: TableRate[][] = await Promise.all(urls.map(url => Tabletojson.convertUrl(url, { useFirstRowForHeadings: true })))

  const flat = _.flattenDeep(tables)
  const euro = _.filter(flat, (rate) => rate['Country'] === 'Europe' || rate['Country and currency'] === 'European euro')
  const rates: TableRate[] = euro.map(rate => _.pickBy(rate, (_value, key) => key.includes('Average')))
  const r: DateRate[] = _.flatten(rates.map(obj => Object.entries(obj).map(
    ([key, value]) => {
      const repl = encodeURI(key).replace(/%C2%A0/g, ' ')
      const [month, year] = decodeURI(repl).split(' ')

      const date = new Date()
      date.setFullYear(Number.parseInt(year), months.indexOf(month), 1)
      date.setHours(0, 1, 0, 0)
      const rate = Number.parseFloat(value) || 0.0

      return { date, rate }
    }
  )))

  return r.sort((a, b) => {
    return b.date.getTime() - a.date.getTime()
  })
}

runner()
.then(rates => {
  const best = _.maxBy(rates, 'rate')
  if (!best) {
    console.error('Could not find a valid rate')
  } else {
    console.log(`best rate is ${best.rate} on ${best.date}`)
  }
})
.catch(err => console.error(err))

