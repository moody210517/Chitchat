self.addEventListener('install',function(e){})

self.addEventListener('notificationclick',function(e){
    var n=e.notification, pageUrl='', resetHash=false;
    if(n.data){
        if (n.data['pageUrl']) {
            pageUrl=n.data['pageUrl'];
        }
        if (n.data['resetHash']) {
            resetHash=n.data['resetHash'];
        }
    }
    n.close();
    console.log('ServiceWorker - notificationclick', pageUrl, n.tag);
    e.waitUntil(
        self.clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then(function(clientList) {
            console.log('ServiceWorker - clientList', clientList);
            for(var cl in clientList) {
                var client=clientList[cl];
                if (client['url'] === pageUrl && 'focus' in client) {
                    client.focus();
                    if (resetHash) {
                        //self.clients.get(client['id']).then(function(cl){
                            //console.log(11111,cl);
                        //})

                       // setTimeout(function(){
                            //console.log(client, client.location.href, client.history);
                            //var path=client.location.href.split('#');
                            // var data={doc_h:0, x:0, y:0, gallery:0, im:0, upload_file:'', mobile_menu_open:0};
                            //client.history.replaceState(data, document.title, path[0])
                        //},100)
                    }
                    return client;
                }
            }
            if('openWindow' in self.clients) {
                return self.clients.openWindow(pageUrl);
            }
        })
    )
})