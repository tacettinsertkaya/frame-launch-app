(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.createDesignHistoryManager = factory().createDesignHistoryManager;
    }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    function defaultClone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function defaultEqual(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
    }

    function createDesignHistoryManager(options = {}) {
        const limit = options.limit || 50;
        const cloneSnapshot = options.cloneSnapshot || defaultClone;
        const isEqual = options.isEqual || defaultEqual;
        let currentSnapshot = null;
        let activeGroupKey = null;
        const undoStack = [];
        const redoStack = [];

        function trimUndoStack() {
            while (undoStack.length > limit) {
                undoStack.shift();
            }
        }

        function reset(snapshot = null) {
            currentSnapshot = snapshot ? cloneSnapshot(snapshot) : null;
            activeGroupKey = null;
            undoStack.length = 0;
            redoStack.length = 0;
        }

        function capture(snapshot, captureOptions = {}) {
            if (!snapshot) return false;
            const groupKey = captureOptions.groupKey || null;
            const nextSnapshot = cloneSnapshot(snapshot);
            if (!currentSnapshot) {
                currentSnapshot = nextSnapshot;
                activeGroupKey = groupKey;
                return false;
            }
            if (isEqual(currentSnapshot, nextSnapshot)) {
                return false;
            }

            if (groupKey && groupKey === activeGroupKey) {
                currentSnapshot = nextSnapshot;
                redoStack.length = 0;
                return true;
            }

            undoStack.push(cloneSnapshot(currentSnapshot));
            trimUndoStack();
            redoStack.length = 0;
            currentSnapshot = nextSnapshot;
            activeGroupKey = groupKey;
            return true;
        }

        function undo(snapshot) {
            if (!undoStack.length) return null;
            if (snapshot) {
                redoStack.push(cloneSnapshot(snapshot));
            } else if (currentSnapshot) {
                redoStack.push(cloneSnapshot(currentSnapshot));
            }
            currentSnapshot = undoStack.pop();
            activeGroupKey = null;
            return { snapshot: cloneSnapshot(currentSnapshot) };
        }

        function redo(snapshot) {
            if (!redoStack.length) return null;
            if (snapshot) {
                undoStack.push(cloneSnapshot(snapshot));
                trimUndoStack();
            } else if (currentSnapshot) {
                undoStack.push(cloneSnapshot(currentSnapshot));
                trimUndoStack();
            }
            currentSnapshot = redoStack.pop();
            activeGroupKey = null;
            return { snapshot: cloneSnapshot(currentSnapshot) };
        }

        return {
            reset,
            capture,
            undo,
            redo,
            canUndo: () => undoStack.length > 0,
            canRedo: () => redoStack.length > 0
        };
    }

    return { createDesignHistoryManager };
});
