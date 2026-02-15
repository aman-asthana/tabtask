var popup = {
    title: 'Popup',
    xtype: 'panel',
    padding: 20,

    items: [
        {
            xtype: 'button',
            text: 'HTML editor',
            handler: function(){
                Ext.create('Ext.window.Window', {
                    title: 'Editor',
                    width: 900,
                    height: 600,
                    modal: true,
                    layout: 'fit',
                    items: [
                        {
                            xtype: 'htmleditor',
                            fieldLabel: 'Content',
                            lebleAlign: 'top'
                        }
                    ]
                }).show();
            }
        }
    ]
}