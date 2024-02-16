var use_storage;
var lock_after_idle_seconds;
var lock_url;
var lock_url_takes_focus;

chrome.runtime.getPlatformInfo(function(platform_info) {
    if ( platform_info.os == 'cros' ) {
      console.log('This extension doesn\'t run on Chrome OS');
      return;
    }
    console.log('OS is ' + platform_info.os);
    chrome.management.getSelf(function (exinfo) {
        if ( exinfo.installType == 'admin' ) {
            use_storage = chrome.storage.managed;
            console.log('Using managed storage.');
        } else {
            use_storage = chrome.storage.sync;
            console.log('Using unmanaged Chrome sync storage');
        }
        use_storage.get('lock_after_idle_seconds', function(values) {
            lock_after_idle_seconds = values.lock_after_idle_seconds;
            if ( ! lock_after_idle_seconds || lock_after_idle_seconds === undefined ) {
                console.log('using default idle secs');
                lock_after_idle_seconds = 1800;
            }
            lock_after_idle_seconds = Number(lock_after_idle_seconds);
            console.log('locking after idle for ' + lock_after_idle_seconds + ' seconds');
            chrome.idle.setDetectionInterval(lock_after_idle_seconds);
            chrome.idle.onStateChanged.addListener(onIdleStateChange);
            });
        });
    });

function onIdleStateChange(state) {
  console.log("we are now in state " + state);
  if (state == "idle") {
    chrome.identity.getAuthToken({"interactive": false}, function(token) {
      if (chrome.runtime.lastError) {
          if ( chrome.runtime.lastError.message == 'OAuth2 request failed: Invalid credentials (credentials rejected by client).' ) {
              console.log('We are already logged out, doing nothing.')
              return
          }
      }
      use_storage.get(null, function(values) {
          lock_url = values.lock_url;
          if ( ! lock_url ) {
              lock_url = 'https://accounts.google.com/Logout';
          }
          lock_url_takes_focus = values.lock_url_takes_focus;
          if ( ! lock_url_takes_focus) {
              lock_url_takes_focus = false;
          }
          console.log('lock URL is ' + lock_url);
          console.log('lock URL takes focus is ' + lock_url_takes_focus)
          chrome.tabs.create({url: lock_url, active: lock_url_takes_focus});
      });
    });
  }
}