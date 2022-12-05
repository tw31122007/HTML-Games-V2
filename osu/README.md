# osw!
### a web clone of the popular rhythm game osu!
An in-development osu! clone designed to run on web browers
It is planned to emulate the osu! experience as closely as possible in the browser

Heavy development phase as the project heads closer to a release candidate

### Expected features
- [x] Local Beatmaps
- [x] Star rating (no online API)
- [x] Mods
- [ ] Custom skins (animated)
> Custom Skins checklist
[ ] Approach Circles
[ ] Hit Objects
[ ] Sliders
[x] Hp Bar
[ ] Spinner
[ ] Key Overlay
[x] Skin parser
[ ] Skin saving
[ ] Skin animation
- [ ] PP system (no online API)
- [ ] Keybinds
- [ ] Extensible rulsets
- [ ] Local scores
- [ ] Replays

### Optimisations
- [ ] Loading times
- [ ] Main menu
- [ ] Increase speed of beatmap cache generation
- [ ] Star rating
- [ ] Rendering (caches and overlays)
- [ ] Size of replays


### Where can I play?
You can play it by clicking on the link [here](https://joshua-usi.github.io/osw)
  
## FAQs
### Can you implement so and so or found a bug?
Have a feature request or found a bug? submit an issue report [here](https://github.com/Joshua-Usi/osw/issues/new/choose)

### Will you support _____ browser or device?
osw! will gaurantee support for Chrome, Firefox and Edge. All other browsers are subject to their own risks. Internet explorer is not supported at any version. Safari is planned to be supported

### Im experiencing poor performance on my device! pls fix game!
Sorry to hear that. Unfortunately theres not much I can do about it in the short term. While processing takes minimal cpu power. Rendering is horrendously slow on low powered devices. Though chromebooks have been tested with 45fps.

### Will you support tablets?
As of current browser specfications and to my knowledge. It is currently impossible to provide hardware tablet support for customisable area. However, tablets are currently supported as of osw! 0.7.10b

### Will the PP and star rating systems be accurate?
osw! currently only supports star rating and it is based on star rating system from [ojsama](https://github.com/Francesco149/ojsama) by [Francesco149](https://github.com/Francesco149), it is the most accurate implementation, however it is an old implementation and I have done my best to apply the newer star rating changes from [2021-11-09](https://osu.ppy.sh/home/news/2021-11-09-performance-points-star-rating-updates)
 
### So and so feature does not work exactly the same as osu!, will you fix it?
Some osu features are near impossible to emulate unless of course I were to deep dive into the lazer codebase, which I don't want to. Things such as HP and spinners work on custom algorithms that try to be as fair as possible
  
### Will the beatmap editor be supported?
Though there is a button there for the beatmap editor. It is highly unlikely to be supported unless there is a feature request with high enough demand

### So and so map does not work on the browser client
Over the years, many beatmap creators have tried their best to break osu in their own way. As osw! is coded with different algorithms, some of these beatmaps will work differently compared to osu!. Maps such as [Solice of Oblivion](https://osu.ppy.sh/s/594751) by Professional Box do not correctly display the distorted sliders