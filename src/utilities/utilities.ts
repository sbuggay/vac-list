/**
 * Generic `this` binding decorator
 *
 * @export
 * @param {object} target
 * @param {string} propertyKey
 * @param {*} descriptor
 * @returns {(any | void)}
 */
export function bind(target: object, propertyKey: string, descriptor: any): any | void {
    if (!descriptor || (typeof descriptor.value !== "function")) {
        throw new TypeError(`Only methods can be decorated with @bind. <${propertyKey}> is not a method!`);
    }

    return {
        configurable: true,
        get(this) {
            const bound = descriptor.value!.bind(this);
            Object.defineProperty(this, propertyKey, {
                configurable: true,
                value: bound,
                writable: true
            });
            return bound;
        }
    };
}