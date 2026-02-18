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
                                success: function(form, action) {
                                    var msg = action.result && action.result.message ? action.result.message : 'File Uploaded Successfully';
                                    Ext.toast(msg, 'Success');
                                    // Refresh prefix grid if exists
                                    if (typeof prefixStore !== 'undefined') {
                                        prefixStore.load();
                                    }
                                },
                                failure: function(form, action){
                                    var msg = action.result && action.result.message ? action.result.message : 'Upload failed';
                                    Ext.Msg.alert('Error', msg);
                                }
                            })
                        }
                    }
                }
            ]
        }
    ]
}