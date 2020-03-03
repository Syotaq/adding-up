'use strict';
const fs = require('fs')
const readline = require('readline')
const rs = fs.createReadStream('./popu-pref.csv')
const rl = readline.createInterface({ 'input': rs, 'output': {} })
const prefDataMap = new Map() // key: 都道府県， value: 集計データのオブジェクト
rl.on('line', (lineString) => {
    const columns = lineString.split(',')
    const year = parseInt(columns[0])
    const pref = columns[1]
    const popu = parseInt(columns[3])
    if (year === 2010 || year === 2015) {
        let value = prefDataMap.get(pref)
        if (!value) {
            value = {
                popu10: 0, popu15: 0, change: null
            }
        }
        if (year === 2010) {
            value.popu10 = popu
        }
        if (year === 2015) {
            value.popu15 = popu
        }
        prefDataMap.set(pref, value)
    }
})
rl.on('close', () => {
    for (const [k, v] of prefDataMap) {
        v.change = v.popu15 / v.popu10
    }
    const rankingArray = Array.from(prefDataMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change
    })
    const rankingStrings = rankingArray.map(([k, v]) => {
        return k + ': ' + v.popu10 + '=>' + v.popu15 + ' 変化率:' + v.change
    })
    console.log(rankingStrings)
})