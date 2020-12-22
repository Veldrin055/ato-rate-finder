import fetch from 'fetch'

const urls = [
  'https://www.ato.gov.au/Tax-professionals/TP/Monthly-exchange-rates-for-1-July-2019-to-30-June-2020/',
  'https://www.ato.gov.au/Tax-professionals/TP/1-July-2018-to-30-June-2019/',
  'https://www.ato.gov.au/Tax-professionals/TP/1-July-2017-to-30-June-2018/',
  'https://www.ato.gov.au/Tax-professionals/TP/1-July-2016-to-30-June-2017/',
]

export const getHtml = () => {
  Promise.all(urls.map(fetch))
}

