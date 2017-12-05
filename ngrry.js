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
        let idMap = {};
        let id;
        for (let ii = 0; ii < links.length; ++ii) {
            let host = links[ii].host;
            if (host.endsWith('youtube.com')) {
                id = extractIdFromCom(links[ii]);
                idMap[id] = ii;
            } else if (host.endsWith('youtu.be')) {
                id = extractIdFromBe(links[ii]);
                idMap[id] = ii;
            }
        }
        let idList = Object.keys(idMap).join(',');
        if (idList.length > 0) {
            let URL = `https://www.googleapis.com/youtube/v3/videos?id=${idList}&key=${API_KEY}&fields=items(id,contentDetails(duration),snippet(title),statistics)&part=id,snippet,contentDetails,statistics`;
            window.fetch(URL).then(d => d.json()).then(d => {
                for (let item of d.items) {
                    try {
                        let {likeCount, dislikeCount} = item.statistics;
                        let title = item.snippet.title;
                        let duration = duration_string(item.contentDetails.duration);
                        let ii = idMap[item.id];
                        links[ii].title = `${title} ## ${duration} ## +${likeCount}/-${dislikeCount}`;
                    } catch(e) {
                        console.log(`Failed to fetch info: ${item.id}: ${e.message}`);
                    }
                }
            }).catch(e => {
              console.log(`Failed to fetch info: ${idList}: ${e.message}`);
            });
        }
    }
});
