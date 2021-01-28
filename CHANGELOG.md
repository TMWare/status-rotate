### 1.1.1 / 28-01-2021

Definitions:

- Finally fix up those typedefs
- - Fixed breaking error that failed building typescript packages

Auxillary:

- Fix linting scripts
- Updated husky hooks to be more efficient
- Update to new @tmware eslint config ecosystem

Dependencies:

- Add `@tmware/eslint-config-typescript` v`1.0.4`
- Bump `@tmware/eslint-config` from `1.0.1` to `1.1.1`
- Bump `@types/node` from `14.14.21` to `14.14.22`
- Bump `husky` from `5.0.6` to `5.0.8`
- Bump `pinst` from `2.1.1` to `2.1.4`

### 1.1.0 / 18-01-2021

Features:

- Filter Bots from user count

Simplifications:

- Make status file downloads one line
- `get statuses()` no longer checks `this.isReady`, instead checks whether `this._statuses` has content
- Use `Jitsuyo.arrayHelper.pickRandom()` to choose a random activity
- Turn `getSafeActivity` into a regular function (was an arrow function) for consistency

Definitions:

- Fix TypeScript definitions

Style:

- Apply new `eslint` rules from updated config package (see below)

Scripts:

- Update scripts for `husky` v5
- - Extend `prepublishOnly` by a `pinst` call to disable the `postinstall` script for the published package
- - Add a `postinstall` script to install `husky` hooks
- - Add a `postpublish` script to re-enable the `postinstall` script after publishing

- Migrate `husky` scripts for linting to v5 (now located in `.husky/`)

Dependencies:

- Bump `@tmware/eslint-config` from `1.0.0` to `1.0.1`
- Bump `@types/node` from `14.14.19` to `14.14.21`
- Bump `eslint` from `7.17.0` to `7.18.0`
- Bump `husky` from `4.3.6` to `5.0.6` (BREAKING)
- Add `pint` version `2.1.1` (to take care of postinstall script for published package)
- Remove `@tmware/prettier-config` (no longer wanted)

Additionally, source code is now included in published package

### 1.0.8 / 04-01-2021

Dependencies: (a8bdfc9)

- Bump `@tmware/jitsuyo` from `1.4.0` to `1.4.1`
- Bump `axios` from `0.19.2` to `0.21.1` (security fix)
- Bump `@tmuniversal/ts` from `1.1.1` to `1.1.2` (ce1f70d)
- Bump `@types/node` from `14.14.13` to `14.14.19`
- Bump `eslint` from `7.15.0` to `7.17.0`
- Removed `cz-conventional-changelog`
- Removed `optionalDependencies`

### 1.0.7 / 15-12-2020

Documentation:

- Create "Features" section in README.md (a098fc4)

Dependencies: (8a3179c)

- Bump `discord.js` from `12.4.1` to `12.5.1`
- Bump `@tmware/jitsuyo` from `1.1.0` to `1.4.0`
- Bump `@tmware/variable-parser` from `1.1.1` to `1.1.2`
- Bump `@types/node` from `14.14.7` to `14.14.13`
- Bump `eslint` from `7.13.0` to `7.15.0`
- Bump `husky` from `4.3.0` to `4.3.6`

### 1.0.6 / 11-11-2020

Dependencies:

- Bump `discord.js` from `12.3.1` to `12.4.1`
- Bump `@tmuniversal/ts` from `1.1.0` to `1.1.1`
- Bump `@types/node` from `14.11.5` to `14.14.7`
- Bump `eslint` from `7.10.0` to `7.13.0`
- Bump `@types/node` from `14.11.5` to `14.14.7`
- Remove extraneous dev dependency `@types/lodash`
- Remove extraneous dev dependency `tslib`
- Remove extraneous dev dependency `typescript`

### 1.0.5 / 06-10-2020

Documentation:

- Update README.md to include (59d0811)
  - usage instructions
  - examples
  - advanced techniques and examples
  - further reading
- Add `discord.js` to tags
- Re-order tags

Chores:

- Introduce this Changelog
- Remove unnecessarily cluttering `commit` script

CI:

- Add build-testing workflow

Dependencies:

- Move `discord-akairo` to optional dependencies
- Bump `@types/node` from `14.11.4` to `14.11.5`
- Remove unused `jest`

Style:

- Apply prettier code style
