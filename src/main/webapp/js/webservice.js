var webservice = {
    title: "Web Service",
    xtype: "panel",
    layout: "fit",
    padding: 20,

    items:[
    {
        xtype: "textarea",
        itemId: "jsonArea",
        readOnly: true,

    }],

    tbar: [
    {
        text: 'JSON call',
        handler: function(btn){
            var panel = btn.up('panel');
            var jsonArea = panel.down('#jsonArea');

            Ext.Ajax.request({
                url: 'api/prefix',
                method: 'GET',
                success: function(response){
                    var formatted = JSON.stringify(JSON.parse(response.responseText), null, 6)
                    jsonArea.setValue(formatted);
                },
                failure: function() {
                    Ext.Msg.alert("Error", "Failed to load JSON data")
                }
            });
        }
    }]
}