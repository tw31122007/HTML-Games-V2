/**
 * SWF Embed: Embed flash items in a page.
 *
 * This code is licensed under the GPL v2.
 *
 * Usage: $('some.selector').swfEmbed(objectPath [, options])
 *
 * Options are:
 *  - width: width of object
 *  - height: height of object
 *  - params: An object containing name/value pairs for params.
 *  - flashvars: Flash varaiables (flashvars), as an object of name/value pairs.
 *  - version: Required version of flash player. If set, this will require a specific
 *    flash player version. By default, no version checking is done.
 *  - expressInstall: express install version.
 *
 * @author Matt Butcher <butcher@palantir.net>
 * @version 1.0
 */
(function ($) {
  var playerVersion = []; // Version of installed player stored here.
  var isInstalling = false; // Flag for Express Install.
  
  /**
   * Embed an SWF object.
   * @param swfObject The URL to an swf object file.
   * @param options An (optional) object containing configuration parameters.
   * @return jQuery The current jQuery object.
   */
  $.fn.swfEmbed = function (swfObject) {
    
    var opts = (arguments.length > 1) ? $.extend({}, $.fn.swfEmbed.defaults, arguments[1]) : $.fn.swfEmbed.defaults;
    
    if (!flashEnabled()) {
      // No flash. Added embedObject for no-flash message.
      embedObject(swfObject, opts, this);
      return this;
    }
    
    if (opts.version && !checkFlashVersion(opts.version)) {
      var i=0;
      while(i<opts.fallbackSwfs.length) {
          if(checkFlashVersion(opts.fallbackSwfs[i].version)) {
              embedObject(opts.fallbackSwfs[i].file);
              return this;
          }
          i++;
      }
      if (opts.expressInstall == null)
        expressInstall(opts, this);
      return this;
    }
    
    embedObject(swfObject, opts, this);
    return this;
  }
  
  /**
   * Default settings. You can override these globally, but the preferred way
   * is to pass in an options object in $().swfEmbed().
   */
  $.fn.swfEmbed.defaults = {
    width: 1,
    height: 1,
    mimeType: "application/x-shockwave-flash",
    params: {},
    flashvars: {},
    fallbackSwfs: [],
    version: null,
    expressInstall: null,
    pluginspage: "http://www.adobe.com/go/getflashplayer"
  };

  ////////// PRIVATE FUNCTIONS //////////
  
  // Format and embed an object.
  embedObject = function (swfObject, opts, jq) {
    jq.each(function () {
      var obj = '<object';
      
      if (opts.params == '') {
        opts.params = {};
      }
      
      // Do browser conditional code.
      if ($.browser.msie) {
        // If IE, then add class ID and extra movie param
        opts.params.movie = swfObject;
        obj += ' classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"';
      }
      else {
        obj += ' data="'+ swfObject +'"';
        obj += ' type="'+ opts.mimeType +'"';
      }
      
      // Set attributes
      obj += ' width="'+ opts.width +'"';
      obj += ' height="'+ opts.height +'"';
      
      obj += '>';
      
      // Build the params
      opts.params['flashvars'] = formatVars(opts.flashvars);
      
      $.each(opts.params, function (name, val) {
        obj += '<param name="'+ name +'" value="'+ val +'"/>';
      });
      obj += '<br><br><br><div style="color: #f5e61f;font-size: 1.867em;"><p>Hey! You need Flash to play this game.</p><p><a style="background-color:#31a2db;border-radius: 20px;color: #000;display: inline-block;font-size: 1.16em;padding: 15px 8px;text-transform: capitalize;vertical-align: middle;font-weight:bold;" href="https://get.adobe.com/flashplayer/" target="_blank">Get Adobe Flash Player</a><br><br></p></div><br><br><br>';
      obj += '</object>';
      
      // Insert the element.  (comment out this for to display preroll video ad on game page)
      //hide_preroll_ads is set to true/false in admin/config/development/adsconfig
      if(hide_preroll_ads) {
	      $(this).html(obj);
      } else {
	      //$(this).html(obj);
      }
     
    });
  };
  
  // Private function for formatting variable string.
  formatVars = function (flashvars) {
    var vars = '';
    $.each(flashvars, function (name, value) {
      if (vars.length > 0) 
        vars += '&';
      vars += name + '=' + value;
    });
    return vars;
  };
  
  // Private function for checking version compatibility
  checkFlashVersion = function(version) {
    parts = version.split('.');
    
    // If there is a minor patch level (which there NEVER should be),
    // then skip it.
    partsCount = parts.length > 3 ? 3 : parts.length;
    
    if (playerVersion.length < 3)
      return false;
    
    // This allows imprecise version checking, e.g. 7, 7.0, 7.0.124
    for (i = 0; i < partsCount; ++i) {
      player = parseInt(playerVersion[i]);
      part = parseInt(parts[i])
      if (player > part)
        return true;
      else if (player < part)
        return false;
      // else we keep looping.
    }
    return true;
  };
  
  // Check to see if flash is enabled.
  // This function is largely inspired by swfobject's flash snooping.
  flashEnabled = function() {
    if ($.browser.msie) {
      // Get ActiveX Info
      var flashAX = 'ShockwaveFlash.ShockwaveFlash';
      try {
        test = new ActiveXObject(flashAX + '.7');
        getIEFlashVersion(test.GetVariable('$version'));
        return true;
      }
      catch (e) { /* Error. Keep trying. */}
      
      try {
        // Try 6:
        test = new ActiveXObject(flashAX + '.6');
        try {
          // Get around bug in 6.0.21/23/29 that prevented
          // GetVariable('$version') from working.
          test.AllowScriptAccess = 'always';
        }
        catch (e) {
          playerVersion = [6,0,21];
          return true;
        }
        getIEFlashVersion(test.GetVariable('$version'));
        return true;
      } 
      catch (e) {}
      
      try {
        // Try generic:
        test = new ActiveXObject(flashAX);
        getIEFlashVersion(test.GetVariable('$version'));
        return true;
      }
      catch (e) {}
      
      return false; // No Flash found.
    }
    else {
      // Get info from plugins (Mozilla, Safari... Opera?)
      if (navigator.plugins['Shockwave Flash']) {
        var regex = /Shockwave\sFlash\s(\d+)\.(\d+)\sr(\d+)/;
        var verStr = navigator.plugins['Shockwave Flash'].description.match(regex);
        verStr.shift(); // Shift the main match off the array.
        playerVersion = verStr;
        
        // Safari might have flash disabled:
        if ($.browser.safari && navigator.mimeTypes["application/x-shockwave-flash"] && !navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin) {
          return false; // Plugin is disabled.
        }
        return true; // Plugin exists and is enabled.
      }
      return false; // No plugin found.
    }
  };
  
  // Get version for an ActiveX object.
  getIEFlashVersion = function (versionString) {
    playerVersion = versionString.split(' ')[1].split(',');
  };
  
  // Handle express install. This mostly comes from here:
  // http://www.adobe.com/products/flashplayer/download/detection_kit/
  expressInstall = function (options, jq) {
    if (checkFlashVersion('6.0.65') && !isInstalling) {
      isInstalling = true;
      document.title = document.title.slice(0, 47) + " - Flash Player Installation";
      opts = {
        width: 310,
        height: 137,
        flashvars: {
          MMredirectURL: window.location, 
          MMplayerType: $.browser.msie ? 'ActiveX' : 'PlugIn',
          MMdoctitle: document.title
        },
        params: {}
      };
      embedObject(options.expressInstall, opts, jq);
    }
  };
})(jQuery);
