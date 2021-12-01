const Scale = require('./scale');

const getScaleTransform = (scale, base) => {
    if (scale instanceof Scale) scale = scale.intervals;
    if (base instanceof Scale) base = base.intervals;

    const length = Scale.getSum(base);

    let scaleN = 0;
    let nextBaseNoteIndex = 0;
    let nextNoteIndex = 0;
    const mapped = [...Array(length).keys()].reduce((acc, n) => {
        if (n !== nextBaseNoteIndex) {
            return acc;
        }
        const returnValue = nextNoteIndex - nextBaseNoteIndex;

        const nextIntervalBase = parseInt(base[scaleN]);
        const nextInterval = parseInt(scale[scaleN]);

        if (!nextIntervalBase || !nextInterval) return acc;

        nextBaseNoteIndex += nextIntervalBase;
        nextNoteIndex += nextInterval;
        scaleN++;
        acc.push(returnValue);
        return acc;
    }, []);
    if (scale.length <= base.length) return mapped;
    // TODO add cases when scale tonics > base
};

// octave - octave number
// tonics - number of tonics in scale
// shiftMap [0, -1, -1, 0, -1, -1, -1];
const getNotesMapping = (octave, tonics, scaleTransform = []) => {
    const whites = [0, 2, 4, 5, 7, 9, 11];
    const keysCount = 12
    return [...Array(128).keys()].filter(note => whites.includes(note % keysCount)).map((val, i, acc) => {
        const base = octave * keysCount;
        const num = i - acc.indexOf(base);
        const whiteKeyIndex = num >= 0 ? num % tonics : Math.abs(Math.abs(num + 1) % tonics - tonics + 1);
        const whiteKeyShift = whites[whiteKeyIndex];
        const octaveShift = Math.floor(num / tonics);
        let shift = base + keysCount * octaveShift;
        shift = shift + whiteKeyShift + (scaleTransform[whiteKeyIndex] || 0);
        return [val, shift];
    }).filter(([i, n]) => n >= 0 && n < 128).reduce((acc, [i, n]) => {
        acc[i] = n;
        return acc;
    }, {});
}

const makeGetTransformedNotes = (scale) => (noteIndex) => {
    const scaleTransformation = getScaleTransform(scale);
    const getTransformedNote = (noteIndex) => {
        const noteInOctaveIndex = noteIndex % scaleTransformation.length;
        const noteTransformation = scaleTransformation[noteInOctaveIndex];
        if (noteTransformation === null) return null;
        return noteIndex + noteTransformation;
    };
};

module.exports = {
    getScaleTransform,
    getNotesMapping,
    makeGetTransformedNotes,
};
