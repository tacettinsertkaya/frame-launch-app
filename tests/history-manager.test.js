const assert = require('assert');
const { createDesignHistoryManager } = require('../history-manager');

function makeSnapshot(scale = 70, headline = 'Start') {
    return {
        background: {
            type: 'gradient',
            gradient: {
                angle: 135,
                stops: [
                    { color: '#111111', position: 0 },
                    { color: '#222222', position: 100 }
                ]
            }
        },
        screenshot: {
            scale,
            y: 60,
            x: 50,
            rotation: 0
        },
        text: {
            headlines: { en: headline },
            headlineSize: 100
        },
        elements: [{ id: 'badge', x: 12 }],
        popouts: []
    };
}

const history = createDesignHistoryManager({ limit: 3 });

history.reset(makeSnapshot(70, 'Start'));
assert.strictEqual(history.canUndo(), false);
assert.strictEqual(history.canRedo(), false);

history.capture(makeSnapshot(80, 'Start'));
history.capture(makeSnapshot(90, 'Second'));

const undoOne = history.undo(makeSnapshot(90, 'Second'));
assert.deepStrictEqual(undoOne.snapshot.screenshot.scale, 80);
assert.deepStrictEqual(undoOne.snapshot.text.headlines.en, 'Start');
assert.strictEqual(history.canRedo(), true);

const redoOne = history.redo(makeSnapshot(80, 'Start'));
assert.deepStrictEqual(redoOne.snapshot.screenshot.scale, 90);
assert.deepStrictEqual(redoOne.snapshot.text.headlines.en, 'Second');

history.capture(makeSnapshot(95, 'Third'));
assert.strictEqual(history.canRedo(), false);

const sameCapture = history.capture(makeSnapshot(95, 'Third'));
assert.strictEqual(sameCapture, false);

const typingHistory = createDesignHistoryManager({ limit: 10 });
typingHistory.reset(makeSnapshot(70, ''));
typingHistory.capture(makeSnapshot(70, 'S'), { groupKey: 'headline-text' });
typingHistory.capture(makeSnapshot(70, 'Se'), { groupKey: 'headline-text' });
typingHistory.capture(makeSnapshot(70, 'Set'), { groupKey: 'headline-text' });
typingHistory.capture(makeSnapshot(70, 'Settings'), { groupKey: 'headline-text' });

const undoTyping = typingHistory.undo(makeSnapshot(70, 'Settings'));
assert.deepStrictEqual(undoTyping.snapshot.text.headlines.en, '');

const redoTyping = typingHistory.redo(makeSnapshot(70, ''));
assert.deepStrictEqual(redoTyping.snapshot.text.headlines.en, 'Settings');

typingHistory.capture(makeSnapshot(80, 'Settings'));
const undoScaleOnly = typingHistory.undo(makeSnapshot(80, 'Settings'));
assert.deepStrictEqual(undoScaleOnly.snapshot.text.headlines.en, 'Settings');
assert.deepStrictEqual(undoScaleOnly.snapshot.screenshot.scale, 70);

console.log('history-manager tests passed');
