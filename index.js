function toRawType(target) {
    let _toString = Object.prototype.toString;
    let str = _toString.call(target);
    return str.slice(8, -1);
}

function cloneReg(target) {
    const reFlags = /\w*$/;
    const result = new target.constructor(target.source, reFlags.exec(target));
    result.lastIndex = target.lastIndex;
    return result;
}

function cloneSymbol(target) {
    return Object(Symbol.prototype.valueOf.call(target));
}

function cloneOtherType(target) {
    const constrFun = target.constructor;
    switch (toRawType(target)) {
        case 'Boolean':
        case 'Number':
        case 'String':
        case 'Error':
        case 'Date':
            return new constrFun(target);
        case 'RegExp':
            return cloneReg(target);
        case 'Symbol':
            return cloneSymbol(target);
        case 'Function':
            return target;
        default:
            return null;
    }
}

function forEach(array, iteratee) {
    let index = -1;
    const length = array.length;
    while(++index < length) {
        iteratee(array[index], index);
    }
    return array;
}

function clone(target, map = new WeakMap()) {

    // clone primitive types
    if (typeof target !== "object" || target === null) {
        return target;
    }

    const type = toRawType(target);
    let cloneTarget = null;

    if (map.get(target)) {
        return map.get(target);
    }
    map.set(target, cloneTarget);

    if (type !== 'Set' && type !== 'Map' && type !== 'Array' && type !== 'Object') {
        return cloneOtherType(target);
    }

    // Clone Set
    if (type === 'Set') {
        cloneTarget = new Set();
        target.forEach(value => {
            cloneTarget.add(clone(value, map));
        });
        return cloneTarget;
    }

    // Clone Map
    if (type === 'Map') {
        cloneTarget = new Map();
        forEach(target, (value, index) => {
            cloneTarget[index] = clone(value, map);
        });
    }

    // Clone Object
    if (type === 'Object') {
        cloneTarget = new Object();
        forEach(Object.keys(target), (key, index) => {
            cloneTarget[key] = clone(target[key], map);
        });
    }

    return cloneTarget;
}
