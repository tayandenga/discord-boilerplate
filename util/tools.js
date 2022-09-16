const unicodeNames = require('@unicode/unicode-12.1.0/Names');
const unicodeOverrides = Object.freeze({
    'ん': 'h',
    '乇': 'E',
    'ﾚ': 'l',
    '尺': 'r'
});

module.exports = {
    getUnixTime(txt) {
        let actualTime = Math.ceil(Date.now() / 1000)
        switch(txt[txt.length - 1]) {
            case 'd':
                return actualTime + Number(txt.slice(0, -1)) * 86400
            case 'h':
                return actualTime + Number(txt.slice(0, -1)) * 3600
            case 'm':
                return actualTime + Number(txt.slice(0, -1)) * 60
            default: break
        }
    },
    stripUnicode(xs) {
        if(typeof xs !== 'string') throw new TypeError('xs must be a string')
        return [ ...xs ].map(x => {
            let override = unicodeOverrides[x]
            if(override) return override
            let names = unicodeNames.get(x.codePointAt(0)).split(/\s+/)
            let isCapital = names.some(x => x == 'CAPITAL')
            if(!isCapital && !names.some(x => x == 'SMALL')) return x
            let c = names.some(x => x == 'WITH') ? names[names.length - 3] : names[names.length - 1]
            return isCapital ? c : c.toLowerCase()
        }).join('')
    }
}