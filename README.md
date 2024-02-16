## Chrome Idle
Logs user out of Chrome after a set period of inactivity.

<a target="_blank" href="https://chrome.google.com/webstore/detail/ngldgdloflfmfcnefhnkoodnbidemldm"><img alt="Try it now" src="https://github.com/jay0lee/cros-info/raw/master/cws.png" title="Click here to install this sample from the Chrome Web Store"></img></a>

## Quick Start
Install the extension from above. By default the extension will log you out of Chrome after 30 minutes of inactivity.

## Known issues and limitations
- Chrome OS is not supported. Admins can configure Chrome OS to lock on idle.
- A locked device (screensaver, sleep) is NOT considered idle. If your device locks quicker than this extension then this extension will do nothing.
- The attempt to log the user off is best effort and assumes the user is not actively trying to block logout. It's precautionary and not guaranteed.

## Extension options
Right click on the extension lock icon and choose Options to configure:
- Number of idle seconds before locking (range 15 - 1209600). 1,209,600 is two weeks :-)
- URL to open to trigger the user logout. `https://accounts.google.com/Logout` is the default and will log the user out of Google accounts.
- Whether the new tab opened to the logout URL should take focus.

## Admin force install
Workspace, Cloud Identity and GCP admins can force install the extension for their users.

1. Manually install the extension in your user profile.
1. Customize the extension options as you'd prefer.
1. Once you're happy with your options, click "Download policy" and save the file locally.
1. [Force install the extension for your users](https://support.google.com/chrome/a/answer/6306504?hl=en).
1. [Set policy for the app by uploading the file you downloaded above.](https://support.google.com/chrome/a/answer/6177447#custom)
