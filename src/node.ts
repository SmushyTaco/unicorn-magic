import {
    execFileSync as execFileSyncOriginal,
    ExecFileOptions,
    type ExecFileSyncOptionsWithStringEncoding
} from 'node:child_process';
import {
    ChildProcessPromise,
    execFile as execFileOriginal
} from 'promisify-child-process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
export * from './default.js';

/**
 * Converts a `URL` or path to a file system path.
 *
 * __Not available in browsers.__
 *
 * @param urlOrPath - The input to convert.
 * @returns A file system path.
 *
 * @example
 * ```
 * import { toPath } from './index';
 *
 * const getUnicornPath = cwd => path.join(toPath(cwd), 'unicorn');
 * ```
 */
export function toPath(urlOrPath: URL | string): string {
    return urlOrPath instanceof URL ? fileURLToPath(urlOrPath) : urlOrPath;
}

// noinspection JSUnusedGlobalSymbols
/**
 * Finds the root directory of the given path.
 *
 * __Not available in browsers.__
 *
 * On Unix-based systems, the root is always `'/'`.
 * On Windows, the root varies and includes the drive letter (e.g., `'C:\\'`).
 *
 * This function operates purely on paths and does not interact with the file system.
 *
 * @param pathInput - The path or URL to check.
 * @returns The root directory of the path.
 *
 * @example
 * ```
 * import { rootDirectory } from './index';
 *
 * console.log(rootDirectory('/Users/x/y/z'));
 * //=> '/'
 *
 * console.log(rootDirectory('C:\\Users\\x\\y\\z'));
 * //=> 'C:\\'
 * ```
 */
export function rootDirectory(pathInput: string | URL): string {
    return path.parse(toPath(pathInput)).root;
}

// noinspection JSUnusedGlobalSymbols
/**
 * Creates an iterable for traversing from a given start path up to the root directory.
 *
 * __Not available in browsers.__
 *
 * This function operates purely on paths and does not interact with the file system.
 *
 * @param startPath - The starting path. Can be relative.
 * @returns An iterable that iterates over each parent directory up to the root.
 *
 * @example
 * ```
 * import { traversePathUp } from './index';
 *
 * for (const directory of traversePathUp('/Users/x/y/z')) {
 *   console.log(directory);
 *   //=> '/Users/x/y/z'
 *   //=> '/Users/x/y'
 *   //=> '/Users/x'
 *   //=> '/Users'
 *   //=> '/'
 * }
 * ```
 */
export function traversePathUp(startPath: string | URL): Iterable<string> {
    return {
        *[Symbol.iterator]() {
            let currentPath = path.resolve(toPath(startPath));
            let previousPath;

            while (previousPath !== currentPath) {
                yield currentPath;
                previousPath = currentPath;
                currentPath = path.resolve(currentPath, '..');
            }
        }
    };
}

const TEN_MEGABYTES_IN_BYTES = 10 * 1024 * 1024;

// noinspection JSUnusedGlobalSymbols
/**
 * Executes a file.
 *
 * Same as the built-in `execFile` but with:
 * - Promise API
 * - 10 MB `maxBuffer` instead of 1 MB
 *
 * __Not available in browsers.__
 *
 * @param file - The file to execute.
 * @param arguments_ - Arguments for the execution.
 * @param options - Execution options.
 * @returns The stdout and stderr of the executed file.
 *
 * @example
 * ```
 * import { execFile } from './index';
 *
 * console.log(await execFile('ls', ['-l']));
 * ```
 */
export function execFile(
    file: string,
    arguments_: string[],
    options?: ExecFileOptions
): ChildProcessPromise {
    return execFileOriginal(file, arguments_, {
        maxBuffer: TEN_MEGABYTES_IN_BYTES,
        ...options
    });
}
// noinspection JSUnusedGlobalSymbols
/**
 * Executes a file synchronously.
 *
 * Same as the built-in `execFileSync` but with:
 * - String output instead of buffer (same as `execFile`)
 * - Does not output `stderr` to the terminal by default (same as `execFile`)
 * - 10 MB `maxBuffer` instead of 1 MB
 *
 * __Not available in browsers.__
 *
 * @param file - The file to execute.
 * @param arguments_ - Arguments for the execution.
 * @param options - Execution options.
 * @returns The stdout of the executed file.
 *
 * @example
 * ```
 * import { execFileSync } from './index';
 *
 * console.log(execFileSync('ls', ['-l']));
 * ```
 */
export function execFileSync(
    file: string,
    arguments_: readonly string[] = [],
    options?: ExecFileSyncOptionsWithStringEncoding
): string {
    return execFileSyncOriginal(file, arguments_, {
        maxBuffer: TEN_MEGABYTES_IN_BYTES,
        encoding: 'utf8',
        stdio: 'pipe',
        ...options
    });
}
