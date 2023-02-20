let BLACKLIST = [/.*linewize\.com$/, /.*linewize\.net$/, /.*linewize\.io$/, /.*block\.tools$/, /.*home\.tools$/, /.*work\.tools$/, /.*fzbox\.tools$/, /.*familyzone\.io$/, /.*familyzone\.com$/, /.*familyzone\.com\.au$/, /.*familyzone\.tools$/, /.*linewizereseller\.net$/, /.*sphirewall\.net$/, /.*webshrinker\.com$/, /.*ably\.io$/, /.*b.ably-realtime\.com$/, /.*xirsys\.com$/, /.*mdm\.sbunified\.org$/, /.*jamfcloud\.com$/, /.*jamf\.com$/, /.*jamfschool\.com$/, /whoami\.linewize\.net/];

function inBlacklist(url) {
    return BLACKLIST.some(function (item) {
        return item.test(url);
    });
}

module.exports = inBlacklist;