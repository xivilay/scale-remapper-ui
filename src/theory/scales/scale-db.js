const genScales = require('./combinations');
const Scale = require('./scale');
const namesDB = require('./heptatonic.json');

const cache = {};

const getNamesList = () => {
    return Object.keys(namesDB)
        .reduce((acc, val) => {
            const modes = namesDB[val];
            acc.push(...Object.values(modes));
            return acc;
        }, [])
        .sort();
};

const getScalesCount = (tones, length) => getScalesFromCache(tones, length).length;

const getModesCount = (tones, index, length) => getScale(tones, index, 0, length).generateIntervals().length;

const getScalesFromCache = (tones, length = 12) => {
    if (!cache[length]) cache[length] = {};
    if (!cache[length][tones]) cache[length][tones] = genScales(tones, length);

    return cache[length][tones];
};

const getScale = (tones, index, shift, length) => {
    const base = getScalesFromCache(tones, length)[index];
    if (!base) return;

    return getScaleByBase(base, shift);
};

const getScaleInfoByName = (name) => {
    const tones = 7; // heptatonicDB
    for (const index in namesDB) {
        const modes = namesDB[index];
        for (const shift in modes) {
            if (modes[shift] === name) return [tones, index, shift];
        }
    }
};

const getScaleByName = (name) => {
    const info = getScaleInfoByName(name);
    if (!info) return;
    return getScale(...info, 12);
};

const getScaleByIntervals = (scale) => {
    if (!(scale instanceof Scale)) scale = new Scale({ intervals: scale });
    const { base, tones, shift, length } = scale;
    const scales = getScalesFromCache(tones, length);
    const index = scales.findIndex((scale) => Scale.compare(scale, base));

    scale.baseIndex = index;
    scale.name = namesDB?.[index]?.[shift];
    return scale;
};

const getScaleByBase = (base, shift = 0) => {
    const scale = new Scale({ base, shift });
    const { tones, length } = scale;
    const scales = getScalesFromCache(tones, length);
    const index = scales.findIndex((scale) => Scale.compare(scale, base));

    scale.baseIndex = index;
    scale.name = namesDB?.[index]?.[shift];
    return scale;
}

module.exports = {
    getModesCount,
    getScaleByBase,
    getScaleByIntervals,
    getNamesList,
    getScale,
    getScaleByName,
    getScaleInfoByName,
    getScalesCount,
};
