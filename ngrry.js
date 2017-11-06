const duration_fragment = (val, unit) => {
    val = val || 0;
    return val === 0 ? '' : '' + val + ' ' + unit + (val > 1 ? 's' : '');
}

const duration_string = coded_str => {
    // Parse a duration string, e.g. PT8M45S -> 8 minutes, 45 seconds
    const DURATION_RE = /^P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
    let m = DURATION_RE.exec(coded_str);
    return [
        duration_fragment(m[1], 'day'),
        duration_fragment(m[2], 'hour'),
        duration_fragment(m[3], 'minute'),
        duration_fragment(m[4], 'second')
    ].filter(e => !!e).join(', ');
};

const extractIdFromCom = link => {
    let q = link.search.substr(1);
    return q.split('&').filter(e => e.startsWith('v=')).map(e => e.substr(2))[0];
};

const extractIdFromBe = link => link.pathname.substr(1);

chrome.storage.sync.get('apiKey', items => {
    const API_KEY = items.apiKey;
    const links = document.getElementsByTagName("a");
    if (links && links.length > 0) {
      for (let ii = 0; ii < links.length; ++ii) {
          try {
              let host = links[ii].host;
              let id;
              if (host.endsWith('youtube.com')) {
                  id = extractIdFromCom(links[ii]);
              } else if (host.endsWith('youtu.be')) {
                  id = extractIdFromBe(links[ii]);
              } else {
                  continue;
              }
              let URL = `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${API_KEY}&fields=items(contentDetails(duration),snippet(title),statistics)&part=snippet,contentDetails,statistics`;
              window.fetch(URL).then(d => d.json()).then(d => {
                  let {likeCount, dislikeCount} = d.items[0].statistics;
                  let title = d.items[0].snippet.title;
                  let duration = duration_string(d.items[0].contentDetails.duration);
                  links[ii].title = `${title} ## ${duration} ## +${likeCount}/-${dislikeCount}`;
              }).catch(e => {
                  links[ii].title = "Failed to fetch info: " + e.message;
              });
          } catch(e) {
              links[ii].title = "Failed to fetch info: " + e.message;
          }
      }
    }
});
