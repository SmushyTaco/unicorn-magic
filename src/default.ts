// noinspection JSUnusedGlobalSymbols
/**
 * Delays the promise for the given duration.
 *
 * @param duration - An object specifying the delay duration in either seconds or milliseconds.
 * @returns A promise that resolves after the specified duration.
 *
 * @example
 * ```
 * import { delay } from './index';
 *
 * await delay({ seconds: 1 });
 *
 * console.log('1 second later');
 * ```
 */
export async function delay(
    duration: { seconds: number } | { milliseconds: number }
): Promise<void> {
    let delayDuration: number;

    if ('seconds' in duration) {
        delayDuration = duration.seconds * 1000;
    } else if ('milliseconds' in duration) {
        delayDuration = duration.milliseconds;
    } else {
        throw new TypeError(
            'Expected an object with either `seconds` or `milliseconds`.'
        );
    }

    return new Promise((resolve) => {
        setTimeout(resolve, delayDuration);
    });
}
