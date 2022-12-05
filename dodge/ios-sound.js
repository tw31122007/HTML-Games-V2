
(function() {
  // fetch original file name
  var s = document.scripts[document.scripts.length - 1]
  var file = s.getAttribute('data-original-file')
  if (!file) throw new Error('Missing data-original-file attribute.')

  // strip vendor prefixes
  window.AudioContext = window.AudioContext
    || window.webkitAudioContext
    || window.mozAudioContext
    || window.oAudioContext
    || window.msAudioContext

  // make AudioContext a singleton so we control it
  var ctx = new window.AudioContext
  window.AudioContext = function() { return ctx }

  // create overlay
  var o = document.createElement('div')
  o.style.cssText = [
    'position: fixed',
    'top: 0',
    'left: 0',
    'right: 0',
    'bottom: 0',
		'z-index: 99999999',
    'background: rgba(0, 0, 0, 1)',
    'background-image: url(play_icon.png)', /* https://artridgegames.github.io/games/play_btn.png */
    'background-repeat: no-repeat',
    'background-attachment: fixed',
    'background-position: 50% 30%',
    'color: white',
    'text-align: center',
  ].map(function(p) { return p + ';' }).join('')
  document.body.appendChild(o)

  // disable scrolling
  document.body.style.overflow = 'hidden'

  if(
    window.location.href.indexOf("?touch") !== -1     // to test on not-touch devices: add "?touch" to the URL
    ||window.location.href.indexOf("&touch") !== -1
    || navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)
  ) {
    var navIsMobile = true;
  } else {
    var navIsMobile = false;
  }
  
  if (!navIsMobile) {
    startGame();
  } else {
    /* startGame(); */
    o.ontouchstart = startGame;
  }
  
  function startGame() {

    if (navIsMobile) {
      updateBtns()
    }

    // ...until overlay is clicked
    document.body.style.overflow = ''

    // then unlock AudioContext on iOS
    var buffer = ctx.createBuffer(1, 1, 22050)
    var source = ctx.createBufferSource()
    source.connect(ctx.destination)
    if (source.noteOn) source.noteOn(0)
    else source.start(0)

    // dynamically load original script
    var s = document.createElement('script')

	  if(navIsMobile) {
	    file = "dodge-mobile.js"
	  } else {
	    file = "dodge.js"
	  }
    s.setAttribute('src', file)
    document.body.appendChild(s)

    // and delete overlay div
    document.body.removeChild(o)
  }
})()