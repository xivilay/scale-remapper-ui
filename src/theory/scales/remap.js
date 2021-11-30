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
    makeGetTransformedNotes,
};
