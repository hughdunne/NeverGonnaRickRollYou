#!/usr/bin/env node
const N = require('./ngrry');

const makeLink = URL => {
    const RE = /^((\w+):)?(\/\/((\w+)?(:(\w+))?@)?([^\/\?:]+)(:(\d+))?)?(\/?([^\/\?#][^\?#]*)?)?(\?([^#]+))?(#(\w*))?/;
    let m = RE.exec(URL);
    return m ? {host: m[8], pathname: m[11], search: m[13]} :
                {host: '', pathname: '', search: ''};
};

console.assert (N.duration_fragment(0, 'hour') === '');
console.assert (N.duration_fragment(1, 'hour') === '1 hour');
console.assert (N.duration_fragment(2, 'hour') === '2 hours');

console.assert(N.duration_string('PT8M45S') === '8 minutes, 45 seconds');
console.assert(N.duration_string('P1DT8M45S') === '1 day, 8 minutes, 45 seconds');
console.assert(N.duration_string('P1DT3H8M') === '1 day, 3 hours, 8 minutes');

const links = [makeLink('https://www.youtube.com/watch?v=MenIhT7umeM'), makeLink('https://www.youtu.be/mpgyTl8yqbw')];

console.assert(N.extractIdFromCom(links[0]) === 'MenIhT7umeM');
console.assert(N.extractIdFromBe(links[1]) === 'mpgyTl8yqbw');

console.assert(N.getQuery(['MenIhT7umeM'], 'FAKE_KEY') === 'https://www.googleapis.com/youtube/v3/videos?id=MenIhT7umeM&key=FAKE_KEY&fields=items(id,contentDetails(duration),snippet(title),statistics)&part=id,snippet,contentDetails,statistics')

const idMap = N.getIdMap(links);
console.assert(Object.keys(idMap).length === 2);
console.assert(idMap['MenIhT7umeM'] === 0);
console.assert(idMap['mpgyTl8yqbw'] === 1);

const item = {
    "id": "JOJtqENVX7A",
    "snippet": {
        "title": "What the Most Northern Town in America is Like (Barrow)"
    },
    "contentDetails": {
        "duration": "PT5M50S"
    },
    "statistics": {
        "viewCount": "923704",
        "likeCount": "46202",
        "dislikeCount": "913",
        "favoriteCount": "0",
        "commentCount": "6595"
    }
};

console.assert(N.getTitle(item) === 'What the Most Northern Town in America is Like (Barrow) ## 5 minutes, 50 seconds ## +46202/-913');

console.log("All tests passed!");
