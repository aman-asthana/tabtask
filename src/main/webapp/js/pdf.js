var pdf = {
    title: 'PDF',
    xtype: 'panel',
    padding: 10,

    items: [
    {
        xtype: 'button',
        text: 'Download PDF',
        handler: function() {
            window.location = 'api/pdf/export'
        }
    }]
}