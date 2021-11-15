const Scale = require('./scale');

const getScaleTransform = (scale, base) => {
    if (scale instanceof Scale) scale = scale.intervals;
    if (base instanceof Scale) base = base.intervals;

    const length = Scale.getSum(base);

    let scaleN = 0;
    let nextBaseNoteIndex = 0;
    let nextNoteIndex = 0;
    return [...Array(length).keys()].map((n) => {
        if (n !== nextBaseNoteIndex) {
            return null;
        }
        const returnValue = nextNoteIndex - nextBaseNoteIndex;

        const nextIntervalBase = parseInt(base[scaleN]);
        const nextInterval = parseInt(scale[scaleN]);

        if (!nextIntervalBase || !nextInterval) return null;

        nextBaseNoteIndex += nextIntervalBase;
        nextNoteIndex += nextInterval;
        scaleN++;
        return returnValue;
    });
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
