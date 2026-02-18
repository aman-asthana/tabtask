Ext.onReady(function() {
    Ext.create('Ext.tab.Panel', {
        renderTo: 'tabs',
        width: '100%',
        height: 600,
        items: [
            dropdown,
            popup,
            paging,
            prefix,
            excel,
            webservice,
            pdf,
            cronJob
        ]
    })
})