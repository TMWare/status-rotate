## [1.2.1](https://github.com/TMWare/status-rotate/compare/v1.2.0...v1.2.1) (2021-03-24)


### Chores

* **git:** update .gitattributes ([399e557](https://github.com/TMWare/status-rotate/commit/399e557b39ed6de85567bff0f7b1338d9034aefd))
* **merge:** Merge pull request [#90](https://github.com/TMWare/status-rotate/issues/90) from TMWare/dev ([842f9ab](https://github.com/TMWare/status-rotate/commit/842f9ab06a1e11a65f11cc1c8d3909fd7fd9aa29))
* **node:** lock node version to 15.11.0 ([1f7fd4b](https://github.com/TMWare/status-rotate/commit/1f7fd4bcd715498486072a8d0888d2ec59d33941))
* **yarn:** enable offline cache ([b1c2feb](https://github.com/TMWare/status-rotate/commit/b1c2feb2f0f8e52c3eb0d3f23b297b6fb31df298))
* 🤖 update husky files ([d59406e](https://github.com/TMWare/status-rotate/commit/d59406e91dd16f52957aa030a74218b9cf4b7b09))
* 🤖 update packages (yarn.lock) ([d314cde](https://github.com/TMWare/status-rotate/commit/d314cde4c758281c0c3aaf56800ab7d8d37b51a5))
* remove unnecessary comment from eslintrc ([cd6ae7b](https://github.com/TMWare/status-rotate/commit/cd6ae7b0a9be1b54eb9f19d0b7e574fb00e8bfcb))


### Continuous Integration

* **dependabot:** define target branch: dev ([f5cc364](https://github.com/TMWare/status-rotate/commit/f5cc364cf6dabe0a3ac2f229e217d09c8a5918c8))
* **testing:** update node workflow ([c4ce6ab](https://github.com/TMWare/status-rotate/commit/c4ce6ab3af53eb1f6c388b2c051b5a868c4ce2a2))
* **workflow:** automerge dependency PRs ([3621065](https://github.com/TMWare/status-rotate/commit/36210653ee5c696d6070d5379624d379b5e26327))
* **workflow:** create automerge.yml ([cdb153a](https://github.com/TMWare/status-rotate/commit/cdb153aa8d8c11674e2cc4102929e46968c637d9))
* **workflow:** use semantic-release ([84c2212](https://github.com/TMWare/status-rotate/commit/84c22123e9a6b0479b4aa8fb9f6ba02825227069))
* 🎡 add semantic-release ([b7702c3](https://github.com/TMWare/status-rotate/commit/b7702c3af8d941d676653112b334b5e6263a421b))

### 1.2.0 / 22-02-2021

Features:

- Periodic status updates
- You can now set a remote status file url after initializing
- Remote status data can now be re-fetched

Auxillary:

- Improve package quality by adding `exports` and `files` fields to `package.json`
- Add a `funding` field to `package.json`

Dependencies:

- Bump `@tmware/eslint-config` from `1.1.1` to `1.1.2`
- Bump `@tmware/eslint-config-typescript` from `1.0.4` to `1.05`
- Bump `@types/node` from `14.14.22` to `14.14.31`
- Bump `eslint` from `7.18.0` to `7.20.0`
- Bump `husky` from `5.0.8` to `5.1.0`

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
