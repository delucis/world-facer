# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.0.0](https://github.com/delucis/world-facer/compare/v2.0.0...v3.0.0) (2020-08-23)


### Features

* **box-classes:** Add intersect method to Box class ([2de731e](https://github.com/delucis/world-facer/commit/2de731e45c324367b41ffdd222a253170cfb621e))
* **canvas-utils:** Add noiseRect method for applying random noise ([ebaa517](https://github.com/delucis/world-facer/commit/ebaa5171d7a7748e6c00c16c84dfec69dd575e3a))
* **face-sketcher:** Add flickering words to cursor sketch ([efcb7f6](https://github.com/delucis/world-facer/commit/efcb7f6401b62e1ec2d49aeddebd14b2594660a0))
* **face-sketcher:** Add noise to blue fade sketch ([a2c983c](https://github.com/delucis/world-facer/commit/a2c983c03fe12263847c21184955c89bf8a84c17))
* **face-sketcher:** Don’t shift horizon vertically in word cloud sketch ([63ae155](https://github.com/delucis/world-facer/commit/63ae155106b4f2ed7533a4732d28f964e89edd5e))
* **face-sketcher:** Hard code image IDs into word cloud sketch ([039cd5c](https://github.com/delucis/world-facer/commit/039cd5cfcab9832dcad36c08ed4762901031b4bf))
* **face-sketcher:** Increase word size slightly at end of word cloud ([5b7a006](https://github.com/delucis/world-facer/commit/5b7a0061d3e8b037cde51adcaea00f0c7eeaff74))
* **face-sketcher:** Make blue fade fill screen ([8736fdf](https://github.com/delucis/world-facer/commit/8736fdf75bc16ab05484fad5b5c0087fc0fd42e7))
* **face-sketcher:** Make final word cloud area much bigger ([232d1d2](https://github.com/delucis/world-facer/commit/232d1d273971525cabbd212887137fff881e2e69))
* **face-sketcher:** Make split screens fill frame & center horizon ([5ec0114](https://github.com/delucis/world-facer/commit/5ec0114ebfd822033585589d78eb4c89387b96ac))
* **face-sketcher:** Make word cloud dimensions resolution dependent ([84c496c](https://github.com/delucis/world-facer/commit/84c496ce0c23b82fc9f94c1059a61799fff44bbf))
* **face-sketcher:** Remove vertical offset from word cloud ([e573722](https://github.com/delucis/world-facer/commit/e57372200eb155dd551c3e4a051e9520287abbea))
* **face-sketcher:** Remove vertical shift from word cloud ([bc844f5](https://github.com/delucis/world-facer/commit/bc844f5694f88fbd18301cfef95484b46781badb))
* **face-sketcher:** Show far more words at end of word cloud ([74d5227](https://github.com/delucis/world-facer/commit/74d5227dbe14abe4d0f55e7b4e89e482bad87644))
* **face-sketcher:** Tweak gradient position and color transitions ([c946aa2](https://github.com/delucis/world-facer/commit/c946aa2e64a227b7b27c87946016d5fe03db15fa))
* **news-maker:** Allow news cues to have intro audio at start ([c974df1](https://github.com/delucis/world-facer/commit/c974df1318b1e786490206bc57d2b336a03e531b))
* **news-server:** Improve a11y: ARIA roles, lang attr & color contrast ([0e902ac](https://github.com/delucis/world-facer/commit/0e902ac594601951e1bd9a6362298a0bf73f674b))
* **news-server:** Make ngrok subdomain configurable via environment ([7742da1](https://github.com/delucis/world-facer/commit/7742da13a72470b0fa5e0e268cf93266de9ec5dd))
* **say:** Allow attaching an audio file to the front of say output ([f5ca655](https://github.com/delucis/world-facer/commit/f5ca6551949b14944d6892b474e65092c65b8e3b))
* **similarity-matrix:** Limit concurrency of similarity calculations ([e2b46b7](https://github.com/delucis/world-facer/commit/e2b46b73bf8d380b70be2ebc439c1df5a4cb8b80))


### Bug Fixes

* **canvas-utils:** Limit pixel effects to the canvas extent ([3d80d3c](https://github.com/delucis/world-facer/commit/3d80d3cf17b4f085e859b60ca8c48b66fb8cbc45))

## [2.0.0](https://github.com/delucis/world-facer/compare/v1.0.0...v2.0.0) (2020-01-14)


### Features

* **bootstrap:** Scrape pictures one at a time to minimise bot detection ([2335b50](https://github.com/delucis/world-facer/commit/2335b507c6270cea5b75ac5d389313af9f31e1d8))
* **box-classes:** Add round method to Box to get box on integer grid ([57478f1](https://github.com/delucis/world-facer/commit/57478f167b1b1d222410a9b80a131fbc06fa7d6e))
* **box-classes:** Create Line class to work with Point collections ([51a483d](https://github.com/delucis/world-facer/commit/51a483d83699810970fd316f93c2f92af79af692))
* **canvas-utils:** Add `blurRect` method to blur canvas portions ([1626d00](https://github.com/delucis/world-facer/commit/1626d001db33bfd0f579cc32df615a7ae5063897)), closes [#16](https://github.com/delucis/world-facer/issues/16)
* **canvas-utils:** Add a vertical offset option to `drawHorizon` ([91d8599](https://github.com/delucis/world-facer/commit/91d8599a5986ff8d0e03028a582051f07f9a94ee))
* **canvas-utils:** Add drawHorizon convenience method ([4ee64da](https://github.com/delucis/world-facer/commit/4ee64da9fc614271eb4a3da809ef73837bdaffe1))
* **canvas-utils:** Add drawLine method ([64c0257](https://github.com/delucis/world-facer/commit/64c0257452ae0df44dd00fb75f2fecf8fdc2dd6e))
* **canvas-utils:** Add grayscale, invert, and saturate filters ([b3d7925](https://github.com/delucis/world-facer/commit/b3d792546a7ef2ac5f295e76f6e3e33a6578ada9))
* **canvas-utils:** Add span option to drawHorizon to control width ([bb53a8a](https://github.com/delucis/world-facer/commit/bb53a8aa30f3e61c2d44c08877c6215262cb336e))
* **canvas-utils:** Create brightness filter ([62bd35c](https://github.com/delucis/world-facer/commit/62bd35ce670e68c5e35980e9a6ca13b6dc01e9ae))
* **canvas-utils:** Create ImageDrawer method to simplify sketch drawing ([da64e5d](https://github.com/delucis/world-facer/commit/da64e5d5c798adb5758a8a190be7902b08ec2336))
* **canvas-utils:** Quickly enable drawRect to have a gradient background ([848e4b3](https://github.com/delucis/world-facer/commit/848e4b3237d914b7ccbcf60ac33c2adac359ee78))
* **face-sketcher:** Add 6 seconds of solid blue to start of fade ([1be7495](https://github.com/delucis/world-facer/commit/1be74959eee83b6ad1b90a7359d24cb3720cf97f))
* **face-sketcher:** Add sketch for fading final blue ([771ee7a](https://github.com/delucis/world-facer/commit/771ee7a74b9d781f7956140697bb3a078da17936))
* **face-sketcher:** Adjust cursor sketch to Paine Hall wall dimensions ([2ba594d](https://github.com/delucis/world-facer/commit/2ba594d1cdd9518b7256405a11f6f83071f44a85))
* **face-sketcher:** Adjustments for Paine Hall back wall (May 2019) ([2028710](https://github.com/delucis/world-facer/commit/2028710d4060f31a4a96e6dfeef4de685161eb34))
* **face-sketcher:** Allow definition of render endTime ([97f6a23](https://github.com/delucis/world-facer/commit/97f6a23309f424a6cb40608756ba2e0d9dfca360))
* **face-sketcher:** Ask if you want to render at low resolution ([e24b45a](https://github.com/delucis/world-facer/commit/e24b45a9aa9f4f371a997c2dd80cf881301c9950))
* **face-sketcher:** Break up split screen section and adapt for Paine ([ad11cc2](https://github.com/delucis/world-facer/commit/ad11cc27ef9cc09cf3102be9f4c681ade8f65691)), closes [#19](https://github.com/delucis/world-facer/issues/19)
* **face-sketcher:** Create cursor sketch ([03f50e9](https://github.com/delucis/world-facer/commit/03f50e9eb1d11104c2bf654e90ef93c71f37dfeb)), closes [#18](https://github.com/delucis/world-facer/issues/18)
* **face-sketcher:** Include full section duration in sketch definitions ([9ce2c43](https://github.com/delucis/world-facer/commit/9ce2c436c2f914ddd20d4ca5873d3b0203234de0))
* **face-sketcher:** Narrow cursor width and cycle throuhgh hues ([685829d](https://github.com/delucis/world-facer/commit/685829d2d79a8a26d50f0430fa2fcf27ec7d9837))
* **face-sketcher:** Reduce samplesPerFrame for cursor sketch ([9e9efd4](https://github.com/delucis/world-facer/commit/9e9efd4d4fb375b0a27af446035b892e3efd6705))
* **face-sketcher:** Scale blue screen for Paine Hall wall ([2506d7e](https://github.com/delucis/world-facer/commit/2506d7ee48bb801307264e0305e4362285216a8f))
* **face-sketcher:** Show render prompt and reload sketches as needed ([79de202](https://github.com/delucis/world-facer/commit/79de202ec2c0e7c188d9edb7fa116c9fd345209a))
* **face-sketcher:** Show render start and times in prompt when defined ([2fe3f4e](https://github.com/delucis/world-facer/commit/2fe3f4e3dbbd98691aa7b6420086e29f59a941e2))
* **face-sketcher:** Support sketches timed using `totalFrames` ([f875298](https://github.com/delucis/world-facer/commit/f8752985bce6e4e4ac3172760271878d66e340c2))
* **face-sketcher:** When aperture is closed blur with a single rect ([16a0186](https://github.com/delucis/world-facer/commit/16a0186d980ce9af4a315ccecbc076bd4ee73582))
* **news-maker:** Adapt `news-reader` for individual cue generation ([207828a](https://github.com/delucis/world-facer/commit/207828a589cb0dfa9cb7a8a00daa4d50acd9d0e6))
* **news-maker:** Add flag to pad cue with 8'15" of silence ([4676f1f](https://github.com/delucis/world-facer/commit/4676f1f5fd0f84781561a43d313ee452af872c14))
* **news-maker:** Increase minimum silence from 0 to 100ms ([089c4c4](https://github.com/delucis/world-facer/commit/089c4c423fcdd591ff23108b1b3bea44db545151))
* **news-maker:** Increase sentence count to match final section length ([2ab5790](https://github.com/delucis/world-facer/commit/2ab5790a8f464da9666c3cc0f9246e45d4446b03))
* **news-server:** Add direct download link for generated audio file ([27ecd38](https://github.com/delucis/world-facer/commit/27ecd385d05412f77fb701004cdd2b500be1722e))
* **news-server:** Add simple terminal logging ([23b1a9c](https://github.com/delucis/world-facer/commit/23b1a9c83fe8ccb98effb94a5401997a07958526))
* **news-server:** Add webfont to news-server styling ([0f18a71](https://github.com/delucis/world-facer/commit/0f18a7180ffd001194bbfaaf77af8d912b9c66e0))
* **news-server:** Create server for cue generation and browser playback ([517d800](https://github.com/delucis/world-facer/commit/517d80094892818cf9d267ee60c4441c66787ba4))
* **news-server:** Disable traffic inspection ([fbbda24](https://github.com/delucis/world-facer/commit/fbbda245b9894b3faae81df96aac725de90f8f8a))
* **news-server:** Improve index title and description ([ca26ab9](https://github.com/delucis/world-facer/commit/ca26ab95796b2ab19422cc035d87fbb0389ca537))
* **news-server:** Pad cues and enable serving of mp3 files ([a094ba9](https://github.com/delucis/world-facer/commit/a094ba9e669071889c5c88fe4ce03709b72d72e8))
* **news-server:** Prime the paper-words cache when launching the server ([3f19814](https://github.com/delucis/world-facer/commit/3f19814e95ee3105d7c35f200cabf4532ca60ea7))
* **news-server:** Serve to reserved ngrok URL ([c042bab](https://github.com/delucis/world-facer/commit/c042bab8ba4d1211266bcde46678871a6ae762c1)), closes [#20](https://github.com/delucis/world-facer/issues/20)
* **package:** Add npm script to launch news server ([71837a8](https://github.com/delucis/world-facer/commit/71837a893a9d0a2c584ffe5ef8486124282061b4))
* **paper-picture-scraper:** Use random User Agents for requests ([14f7764](https://github.com/delucis/world-facer/commit/14f77645b77bad07bb6794970c24dacf04d03f78))
* **paper-thumbs:** Skip thumbnail generation if already generated ([c058ffd](https://github.com/delucis/world-facer/commit/c058ffdb1f3e468d04c781784ca959a61830b7b4))
* **paper-words:** Increase cache expiry time to 24 hours ([0d79137](https://github.com/delucis/world-facer/commit/0d79137dd1d952e9865f72dd65d222ac5a8f348d))
* **say:** Add option for generating compressed audio files ([fced7d9](https://github.com/delucis/world-facer/commit/fced7d9c144f90b651dff5a0862db2b9ee1ca4f1))
* **say:** Add option to pad start of cue with silence (using sox) ([8c584d8](https://github.com/delucis/world-facer/commit/8c584d8e27e8d04df3b84134eeb0fa74c7bf0ff9))
* **validators:** Add HSL & HSLA validators to test CSS colour strings ([406caa1](https://github.com/delucis/world-facer/commit/406caa1a51d5c1e1f3e4b88c14283e89eefd1afb))
* **validators:** Add isInteger validator ([000151a](https://github.com/delucis/world-facer/commit/000151a7b1ee17fa2625a79ea60450654e97083c))
* Throttle disk reads in paper-words and paper-pictures with p-queue ([385a8db](https://github.com/delucis/world-facer/commit/385a8dbd8f52310ab7f42c1a09dfa30986cd0b1a))


### Bug Fixes

* **face-sketcher:** Remove extra closing curly brace ([558206b](https://github.com/delucis/world-facer/commit/558206b60732ff3ee4af1aa3a22b930b52a29964))
* **news-server:** Fix broken manifest link ([d5162f2](https://github.com/delucis/world-facer/commit/d5162f2b92e333d9606614eec414db8c2f87e8ce))
* **news-server:** Fix paths for generated audio ([00efe93](https://github.com/delucis/world-facer/commit/00efe932457035cbb9bbeb4c4ad148679ce7a5f7))
