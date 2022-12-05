Changelog format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
---
## [v0.13.0b-dev] - 2021-12-30
### Added
- Partial skin support (Switched to vaxei skin)
- Close confirmation window when loading beatmaps [#16](https://github.com/Joshua-Usi/osw/issues/16)
### Fixed
- Being able to affect auto using keyboard buttons [#15](https://github.com/Joshua-Usi/osw/issues/15)
### Changed
- Reduced approach circle size
- Settings tray closes when opening beatmap selector [#18](https://github.com/Joshua-Usi/osw/issues/18)
### Code Quality
- Refactored rendering in standardGameplay.js and moved to hitObjectRenderer.js
### Issues
---
## [v0.12.1b-dev] - 2021-11-28
### Added
- Checks and auto-updates whenever the database changes or star rating
- Break Periods (no HP drain) now occur based on the map break periods
### Changed
- Star rating is now no longer limited to 330bpm streams (matching [osu!'s 2021-11-09 changes](https://osu.ppy.sh/home/news/2021-11-09-performance-points-star-rating-updates))
- Star rating extreme scaling factor has been changed, Maps with more of 1 skill decreases in star rating (Matching changes specified [here](https://docs.google.com/document/d/10DZGYYSsT_yjz2Mtp6yIJld0Rqx4E-vVHupCqiM4TNI/edit))
- README to better reflect the state of star rating
- Reduced the size of combo numbers slightly
### Code Quality
- Refactored animatedEventsManager.js
- Refactored introSequence.js
- Moved cacheManager.js into beatmapFetcher.js
---
## [v0.12.0b-dev] - 2021-11-25
### Removed
-	Dependency on require.js
### Fixed
- Score update rate not working for "Every frame" option
- An error with beatmap uploading
### Code Quality
- All scripts now use javascript standardised modules
---
## [v0.11.1b-dev] - 23-11-2021
### Added
- Notifications side nav (Useful for debugging errors)
### Changed
- Mobile devices have audio visualiser effects disabled for performance and compatibility
- Increased width of options side nav from 25% to 27.5%
### Optimised
- Beatmap uploading even more
- Performance when saving settings by preventing some buttons from saving settings twice
### Fixed
- When exiting with settings open: settings GUI now closes as well [#9](https://github.com/Joshua-Usi/osw/issues/9)
- Pressing the back button while the mods menu is open will close the mods menu and does not go back to main menu [#9](https://github.com/Joshua-Usi/osw/issues/9)
- Prevented the ability to move the mouse whenever an using the Auto mod or watching a replay
- Cursor is now no longer locked when using Auto mod or watching a replay
### Removed
- Volume warning on splash screen
---
## [v0.11.0b-dev] - 1-09-2021
### Added
- Capability to view replays
- Notelock (unfortunately)
- Mod Incompatibilities (such as being able to choose both easy and hard rock at the same time)
- Screen so user can tell if a beatmap is currently loading
### Changed
- README.MD FAQs
### Optimised
- Beatmap uploading speed
### Removed
- Star rating tests (no longer relevant thanks to ojsama)
### Fixed
- An issue where the approach circle size would continue to lower in size
- Typos in README.MD
- Pressing deselect all mods wouldn't update the score multiplier text
- Auto experiencing notelock
- Sliders having different velocities for diffferent segments depending on the segments of the slider
### Code Quality
- options.js to have a more consistent API
- introsequence.js to be more modular
- Added animatedEventsManager.js
- Removed quickParseMap from parser.js
- Optimised ModsUI.js API
- Moved, setDifficultyBars and setStatisticValues to utils.js
- Slightly cleaned program main line
- Removed reliance of utils.js by formulas.js
---
## [v0.9.2b] - 21-06-2021
### Added
- Sudden death now automatically retries the map when you break combo
- Perfect now automatically retries the map whenever accuracy drops below 100%
- Spinner bonus spins now tell you how many bonus points were gained
### Changed
- Judgement animations to be more smooth and match osu!
- Better miss animation (random position and rotation)
- Average hit error is now based on a weighted recent average (more recent hits will influence it more)
- Average hit error is also animated
### Fixed
- Circle sliders being in the incorrect position
- Spinners not working in both directions
### Code Quality
- Used Math.min and Math.max instead of if statements
- Created an emperical formula to map slider resolution to pixel resolution
---
## [v0.9.1b] - 17-06-2021
### Added
- A message to users when running offline to use a web browser
- Shuffle button in the menu so users can pick songs
- Mouse feedback for clickable icons
### Changed
- When searching for maps and choosing random maps, the random algorithm only considers visible maps
- Improved the searching algorithm by ignoring punctuation
### Fixed
- A database issue using wrong keys
- When pressing tab, the mod menu would glitch, and the only way to fix would be a reload
- Background path errors (difference in the way web server and github handle files)
---
## [v0.9.0b] - 16-06-2021
### Changed
- Star rating is now correct as of 16-06-2021. it is an osw! compatible rewrite of [ojsama]https://github.com/Francesco149/ojsama
- Circle size now uses the correct formula rather than an empirical formula
---
## [v0.8.1b] - 7-06-2021
### Changed
- Misses to now have their own animation
### Optimised
- Cleaner codebase for developer sakes
---
## [v0.8.0b] - 3-06-2021
### Added
- Left side of beatmap selection (map details)
- Ability to search through your beatmaps (uses exact equality search)
- Developer mode
- Deleting beatmaps (albeit all beatmaps)
- Background dimming
- Background support
- **NOT FULLY SUPPORTED** If there is no background, added text saying "Deleting backgrounds makes osu! ANGGGGGGGRRRRRRRRRRYYYYYYYYYYYYYYYY! Please use the "Background Dim" setting instead." (keep a legacy going because of this [snowflake](https://github.com/ppy/osu-stable-issues/issues/688))
### Changed
- Star rating slightly (will probably work on in v0.9.0b)
- Combined Gameplay and GameplayRendering options to just Gameplay
- Some function names to make more sense (for my sake)
- Consistent captialisation
- Beatmap parser to include storyboards
### Optimised
- Beatmap loading by adding a cache after first load (when loading 329 beatmaps it went from 229ms to 45ms)
- Tested with over 500 beatmaps now, works like a charm
- Memory usage by only loading maps as necessary (reduced memory usage when loading 500 beatmaps from 100mb --> 20mb)
### Removed
- Circles.mp3 and Aureole.mp3
- Ability to choose certain menu sequence intros
### Fixed
- Hardrock now flips the playfield like in osu!
- Correctly centerised text in select boxes
- Spun out mod not spinning automatically
- Beatmap uploading not being deterministic and causing unreachable files to be generated (due to the nature of async)
- Logo centering issue
---
## [v0.7.10b] - 2021-05-23
### Added
- Tablet support (must be enabled via settings)
- Ability to skip the beginning of the map by pressing the space bar
### Optimised
- Reduced total event listeners using event delegation (when loading 329 beatmaps, went down from 502 -> 144)
---
## [v0.7.9b] - 2021-05-19
### Added
- Multiple beatmap uploads at the same time (tried with 300 at once, works like a charm)
### Optimised
- Beatmap loading (further inspection showed that beatmaps would often try to load twice)
- Beatmap loading again by concatenating all beatmaps in a string and adding it to the DOM in one go (reduced the lag in the intro sequence)
- More beatmap loading by allowing you to choose maps while a beatmap is pending to load
- Separated beatmap loading from audio loading to optimise performance
- Removed excess stars (optimised DOM tree ALOT)
- Optimised DOM tree (when loading 329 beatmaps, went down from 7055 -> 4111)
### Fixed
- Issue with [Sound Chimera](https://osu.ppy.sh/beatmapsets/813569#osu/1706210) and file type endings (by converting to lower case before checking)
- Issue with the main logo not shrinking when being clicked on or on reset
- When songs restart, the beats of the logo being off-beat
- Issue when maps ending on sliders not ending at the correct time
- README.md markdown errors
- Slider tick algorithm (matching osu!)
- Moved hit events to process on same frame (instead of 1 frame delay)
- Moved timingPoint processing to happen before hitObject addition and processing
- Score to more closely match osu!
---
## [v0.7.8b] - 2021-05-15
### Added
- Skip intro sequence if circles theme is selected
### Fixed
- Songs not playing when map is selected
- Songs not looping when ended
- Issue where sliders when slider resolution is not "Full" not ending properly 
- Checkboxes having the wrong sound effect
- Menu logo not being in the correct position
- Maps ending with long sliders not ending at the correct time
---
## [v0.7.7b] - 2021-05-14
### Added
- most options now work such as max framerate and mouse sensitivity
- Started adding replay support
### Changed
- Playdetails to only include essential details. all others are derived
### Optimised
- Beatmap saving to now save the parsed map instead of raw map data to increase performance
- Improved database upgrade algorithm
### Removed
- Cinema mod (will not support)
- Excess options
### Fixed
- Show the correct grade when using hidden or flashlight mods
---
## [v0.7.6b] - 2021-05-06
### Added
- Detection if browser lacks LocalStorage (no error handling yet)
- Bar to tell how far you are in a map
- Nightcore support
### Changed
- Options API to be more friendly
- Gameplay API to use less memory
- Improved Auto accuracy by making auto hit earlier
- Mouse trails to look nicer
### Optimised
- accumulator.js into utils.js, less file loads
### Removed
- Loading loop in gameplay that costs unnecessary processing power
### Fixed
- Auto bug that causes misses
- Sliders with infinite radius causing errors (replaced with straight sliders) (caused by [Flying Out to the Sky](https://osu.ppy.sh/beatmapsets/1212452#osu/2534559) - ENDGAME)
- Hit errors showing the correct errors (it showed first 40, it should show last 40)
- Certain maps not ending due to audio ending before the song ends
- Audio playing back too fast in the main menu
---
## [v0.7.5b] - 2021-05-02
### Optimised
- CSS codebase cleanup
### Fixed
- A z-index bug preventing beatmap uploading
---
## [v0.7.4b] - 2021-05-02
### Changed
- Bug report issue file
### Optimised
- Page loading by only loading sounds after page load
### Fixed
- Flashlight not having the correct sizes
---
## [v0.7.3b] - 2021-05-02
### Added
- New Audio API to simplify audio
### Changed
- menuHit.wav to menu-hit.wav
### Optimised
- Sound effects (still problematic as browser requests every time)
### Removed
- attachAudio.js file and API
---
## [v0.7.2b] - 2021-05-01
### Optimised
- Page loading in the HTML
### Removed
- defaultSkin.js
### Fixed
- A huge bug preventing proper restarting of maps
- A bug preventing doubleTime and halfTime from working properly
- Flashlight not going off screen when flashlight mod is off
---
## [v0.7.1b] - 2021-05-01
### Added
- Basic flashlight
---
## [v0.7.0b] - 2021-04-30
### Added
- Mods
- Volume warning on splash screen
### Optimised
- HTML loading (500 lines of html typically took over 4 seconds, now at < 2 seconds)
### Removed
- Text "many things can change at any moment"
---
## [v0.6.5b] - 2021-04-29
### Added
- Mods UI
---
## [v0.6.4b] - 2021-04-26
### Changed
- Menu screen now pulses to the beat!
- Mod icons upscaled to twice the size (75 * 50 -> 150 * 100))
### Optimised
- Beatmap selection generator to only calculate star rating once
### Fixed
- Settings menu blocking gameplay [#2](https://github.com/Joshua-Usi/osw/issues/2)
- Opening links in new tab using target="_blank"[#6](https://github.com/Joshua-Usi/osw/issues/6)
---
## [0.6.3b] - 2021-04-25
### Changed
- New hexagon background
- Spiced audio visualiser effects
- Slight performance optimisations (main menu and slider generation)
### Removed
- hitEvents.js, now merged with hitObjects.js
---
## [v0.6.2] - 2021-04-24
### Changed
- Star rating to more closely match classical osu!
---
## [v0.6.1b] - 2021-04-22
### Changed
- Adjusted a few animations to feel more lazer-like
### Removed
- Menu blurring (massively increased performance)
---
## [v0.6.0b] - 2021-04-21 - UNSTABLE
### Added
- Ability to upload and save osz files for later
- Ability to play and save maps locally on the user file system
### Changed
- Star rating to now consider jumps and streams more impressive
### Deprecated
- Old maps
### Removed
- Old maps that were fetched via javascript fetch calls
### Fixed
- A small issue where spinners would not spin
- An issue when ending a beatmaps, the back button (and the bar it sits on) will disappear
---
## [v0.5.0b] - 2021-04-04
### Added
- Results screen
- Rank icon images (custom-made)
### Removed
- Unecessary module references
### Fixed
- Restarting, continuing and moving onto another beatmap
- Restarting beatmaps causing sliders to instantly end, fixed by creating clones instead of referencing objects
---
## [v0.4.1b] - 2021-04-02
### Changed
- Star rating now considers the angle between jumps
- Star rating now considers jumps less impressive (moving galaxy collapse [Galactic] from 13.05* to just under 10* )
---
## [v0.4.0b] - 2021-04-01 - Refactor update
### Added
- Combo Numbers
- Combo Colours
- Combo support for beatmap parser
- Custom osw background
### Changed
*From https://github.com/jylescoad-ward
- Warning text when running without web server
### Removed
- Unnecessary Audio Files
- More official osu! files
---
## [0.3.1b] - 2021-03-29
### Added
- HP now only starts draining 2 seconds before the first note
### Changed
- Smoother Auto (less jumpy)
- Auto now spins on spinners
---
## [0.3.0b] - 2021-03-23
### Changed
- rebranded to osw! due to copyright and trademark issues
- New octagonal logo
- changed and removed most osu! copyrighted images
- New intro supports new logo
---
## [0.2.1b] - 2021-03-18
### Added
- When pressing play, a beatmap is randomly selected for you to play! presuming you have any
- Brightening filter whenever a beat is detected
- Added beat bars (near edges of screen that alternate every beat)
### Fixed
- Logo beats from flashing in the wrong spot sometimes
---
## [0.2.0b] - 2021-03-11
### Added
- Automatic beat detection via audio analyser (not perfect but good enough)
### Removed
- Song API (now succeeded by automatic beat detection)
- Reliance on wave.js
---
## [0.2.4b] - 2021-03-11
### Changed
- Mouse sensitivity slider to be more precise
### Fixed
- Slider resolution and mouse sensitivity sliders from not saving properly
---
## [0.2.3b] - 2021-03-08
### Added
*Based off https://github.com/ppy/osu/issues/7048*
- snaking in sliders
- hit effects
### Changed
- Follow circle size from 2.4x to 2.0x (still feels too large)
---
## [0.2.2b] - 2021-03-06
### Added
- Splash screen text to denote heavy developement
- Notelock styles
---
## [0.2.1b] - 2021-02-23
### Changed
- Approach circle minimium size to match osu!
---
## [0.2.0b] - 2021-02-22
### Added
- Added more default maps
### Changed
- Beatmaps are now loaded via fetch calls, instead of specialised javascript files
### Deprecated
- Loading beatmaps using the require.js template
### Removed
- beatmap template
### Fixed
- Slider heads and ends having the correct symbols
---
## [0.1.2b] - 2021-02-16
### Added
- Pause Menu UI functionality
- Continue, Retry and Quit functions for mapss
### Fixed
- Going in and out of maps causing multiple beatmap instances to run
---
## [0.1.1b] - 2021-02-15
### Added
- Pause Menu UI (currently inaccessible)
### Changed
- Doubled triangle-background speed
---
## [0.1.0b] - 2021-02-14
### Moved into Beta
### Added
- Gameplay
- Selecting beatmaps through the beatmap selection screen
### Changed
- Renamed experimental.js to gameplay.js
- Moved gameplay.js to src/scripts
### Removed
- Old gameplay files
- experimental.js
- experimental.html
### Fixed
- Dependency references in gameplay.js
- Audio in the main menu playing while playing a beatmap
- Centerised audio visualiser
- Fixed backup time (when audio fails to load) from referencing when page first loads
---
## [0.1.2a] - 2021-02-13
### Added
- Horizontal device support, ensures that devices are horizontal to be compatible
- Disabled mobile device scrolling
### Changed
- Separated css into files based on their respective sections
- Stars in beatmap star rating have 100% opacity
- Moved event listeners from html into javascript
- Massively reduced image sizes to reduce image load times and project size
- Moved stylesheets other than style.css from root to src/stylesheet
- Moved inline css to external stylesheets
- Renamed utils.replaceAll to utils.removeInstances
- Increased osu!logo size from 50% of screen height to 70%
### Removed
- Beatmap.js (beatmap testing file)
### Fixed
- Audio visualiser responsiveness
---
## [0.1.1a] - 2021-02-12
### Changed
- Scalability of beatmap loading was improved (generated on the fly)
---
## [0.1.0a] - 2021-02-10
### Changed
- Standardised changelog