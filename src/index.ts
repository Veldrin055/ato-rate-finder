import * as _ from 'lodash'
import { Tabletojson } from 'tabletojson'

type Rate = {
  [key: string]: string
}

Tabletojson.convertUrl(fy1920,
  { useFirstRowForHeadings: true }
)
.then((tableData: Rate[][]) => {
  const flat = _.flatten(tableData)
  const euro = _.filter(flat, (rate) => rate['Country'] === 'Europe' || rate['Country and currency'] === 'European euro')
  const rates: Rate[] = euro.map(rate => _.pickBy(rate, (value, key) => key.includes('Average')))
  console.log(Object.assign({}, ...rates))
})