default_settings = {
  lock_after_idle_seconds: 1800,
  lock_url: 'https://accounts.google.com/Logout',
  lock_url_takes_focus: false
};

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
document.getElementById('defaults').addEventListener('click',
    restore_defaults);
document.getElementById('dlpolicy').addEventListener('click',
    gen_policy);

function save_options() {
  var settings = {
    lock_after_idle_seconds: Number(document.getElementById('lock_after_idle_seconds').value),
    lock_url: document.getElementById('lock_url').value,
    lock_url_takes_focus: document.getElementById('lock_url_takes_focus').value === "true" ? true : false,
  };
  if( isNaN(settings.lock_after_idle_seconds) ||
      settings.lock_after_idle_seconds < 15 ||
      settings.lock_after_idle_seconds > 1209600 ) {
        console.log(settings.lock_after_idle_seconds);
        var status = document.getElementById('status');
        status.textContent = "INVALID: Seconds should be between 15 and 1209600";
        setTimeout(function() {
            status.textContent = '';
        }, 7500);
      return
  }
  use_storage.set(settings, function() {
    chrome.idle.setDetectionInterval(settings.lock_after_idle_seconds);
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 7500);
  });
}

function restore_defaults() {
  use_storage.set(default_settings, function() {
    restore_options();
    var status = document.getElementById('status');
    status.textContent = "Defaults restored.";
    setTimeout(function() {
      status.textContent = '';
    }, 7500);
  });
}

function restore_options() {
  chrome.management.getSelf(function (exinfo) {
    if ( exinfo.installType == 'admin' ) {
      use_storage = chrome.storage.managed;
      document.getElementById("save").disabled = true;
      document.getElementById("defaults").disabled = true;
    } else {
      use_storage = chrome.storage.sync;
    }
    use_storage.get(default_settings, function(items) {
      document.getElementById('lock_after_idle_seconds').value = items.lock_after_idle_seconds;
      document.getElementById('lock_url').value = items.lock_url;
      document.getElementById('lock_url_takes_focus').value = items.lock_url_takes_focus;
    });
  });
}

function gen_policy() {
  use_storage.get(default_settings, function(settings) {
    policy = {}
    Object.keys(settings).forEach(function(key) {
      value = settings[key];
      policy[key] = {Value: value};
    });
    policy_str = JSON.stringify(policy, null, 2);
    download(policy_str, 'chrome-idle.json', 'application/json');
  });
}

function download(data, filename, type) { // thanks to https://stackoverflow.com/a/30832210
  var file = new Blob([data], {type: type});
  var a = document.createElement("a"),
  url = URL.createObjectURL(file);
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(function() {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
}