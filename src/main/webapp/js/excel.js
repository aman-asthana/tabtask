var excel = {
    title: 'Excel',
    xtype: 'panel',
    padding: 20,
    layout: 'vbox',

    items: [
        {
            xtype: 'button',
            text: 'Download Excel',
            margin: '0 0 10 0',
            handler: function() {
                window.location = 'api/excel/export'
            },
        },
        {
            xtype: 'button',
            text: "Download Template",
            margin: '0 0 10 0',
            handler: function() {
                window.location = 'api/excel/export?type=template';
            }
        },
        {
            xtype: 'form',
            enctype: 'multipart/form-data',
            items:[
                {
                    xtype: 'filefield',
                    fieldLabel: 'Upload Excel',
                    name: 'file',
                    buttonText: 'Choose File',
                    allowBlank: false,
                }
            ],
            buttons: [
                {
                    text: 'Upload',
                    handler: function (btn){
                        var form = btn.up('form').getForm();
                        if(form.isValid()){
                            form.submit({
                                url: 'api/excel/upload',
                                waitMsg: 'Uploading file...',
                                success: function() {
                                    Ext.toast('File Uploaded Successfully', 'success');
                                },
                                failure: function(form, action){
                                    Ext.Msg.alert('Error', action.response.responseText)
                                }
                            })
                        }
                    }
                }
            ]
        }
    ]
}