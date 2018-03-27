chrome.storage.sync.get('apiKey', items => {
    const API_KEY = items.apiKey;
    const links = document.getElementsByTagName("a");
    if (links && links.length > 0) {
        let idMap = getIdMap(links);
        let idList = Object.keys(idMap);
        if (idList.length > 0) {
            let URL = getQuery(idList, API_KEY);
            window.fetch(URL).then(d => d.json()).then(d => {
                for (let item of d.items) {
                    let title = getTitle(item);
                    if (title) {
                        let ii = idMap[item.id];
                        links[ii].title = title;
                    }
                }
            }).catch(e => {
              console.log(`Failed to fetch info: ${idList}: ${e.message}`);
            });
        }
    }
});
