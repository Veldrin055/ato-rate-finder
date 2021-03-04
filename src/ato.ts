import * as _ from 'lodash'
import { Tabletojson } from 'tabletojson'
import { dateFromMY } from './dates'

export const getRates = async () => {

  const urls = [
    'https://www.ato.gov.au/Tax-professionals/TP/Monthly-exchange-rates-for-1-July-2020-to-30-June-2021/',
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

      const date = dateFromMY(month, year)
      const rate = Number.parseFloat(value) || 0.0

      return { date, rate }
    }
  )))

  return r.sort((a, b) => {
    return a.date.getTime() - b.date.getTime()
  })
}
