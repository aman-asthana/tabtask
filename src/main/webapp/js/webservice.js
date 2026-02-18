var contextPath = window.location.pathname.split('/')[1];
var baseUrl = window.location.origin + '/' + contextPath;

var apiStore = Ext.create('Ext.data.Store', {
    fields: ['id', 'prefix', 'name', 'gender', 'relation'],
    data: []
});

function loadApiData() {

    Ext.Ajax.request({
        url: baseUrl + '/api/prefix',
        method: 'GET',

        success: function (response) {

            var data = JSON.parse(response.responseText);

            apiStore.removeAll();
            apiStore.loadData(data);

            var grid = Ext.ComponentQuery.query('#apiGrid')[0];
            if (grid) grid.getView().refresh();

            var area = Ext.ComponentQuery.query('#jsonArea')[0];
            if (area)
                area.setValue(JSON.stringify(data, null, 4));
        }
    });
}

function openUpdateWindow(record) {

    Ext.create('Ext.window.Window', {

        title: 'Update Prefix',
        width: 400,
        modal: true,
        layout: 'fit',

        items: [{
            xtype: 'form',
            padding: 20,

            items: [

                {
                    xtype: 'combobox',
                    fieldLabel: 'Prefix',
                    name: 'prefix',
                    store: ['Mr.', 'Mrs.'],
                    value: record.get('prefix')
                },

                {
                    xtype: 'textfield',
                    fieldLabel: 'Name',
                    name: 'name',
                },

                {
                    xtype: 'combobox',
                    fieldLabel: 'Gender',
                    name: 'gender',
                    store: ['Male', 'Female', 'Other'],
                    value: record.get('gender')
                },

                {
                    xtype: 'combobox',
                    fieldLabel: 'relation',
                    store: ['S/O', 'D/O', 'H/O'],
                    value: record.get('prefOf')
                }

            ],

            buttons: [{
                text: 'Update',
                handler: function (btn) {

                    var values = btn.up('form').getValues();

                    Ext.Ajax.request({
                        url: baseUrl + '/api/prefix/' + record.get('id'),
                        method: 'PUT',
                        jsonData: values,

                        success: function () {

                            loadApiData();
                            btn.up('window').close();
                            Ext.toast('Updated successfully!');
                        }
                    });
                }
            }]
        }]
    }).show();
}

var webservice = {

    title: 'Web Service',
    xtype: 'panel',
    padding: 15,
    layout: { type: 'vbox', align: 'stretch' },

    listeners: {
        activate: loadApiData
    },

    items: [

        {
            xtype: 'form',
            layout: 'hbox',
            margin: '0 0 10 0',

            items: [

                {
                    xtype: 'combobox',
                    fieldLabel: 'Prefix',
                    name: 'prefix',
                    store: ['Mr.', 'Mrs.'],
                    margin: '0 10 0 0'
                },

                {
                    xtype: 'textfield',
                    fieldLabel: 'Name',
                    name: 'name',
                    margin: '0 10 0 0'
                },

                {
                    xtype: 'combobox',
                    fieldLabel: 'Gender',
                    name: 'gender',
                    store: ['Male', 'Female', 'Other'],
                    margin: '0 10 0 10'
                },

                {
                    xtype: 'combobox',
                    fieldLabel: 'Prefix Of',
                    name: 'prefOf',
                    store: ['S/O', 'D/O', 'H/O']
                },

                {
                    xtype: 'button',
                    text: 'Add',
                    margin: '0 0 0 10',

                    handler: function (btn) {

                        var values = btn.up('form').getValues();

                        Ext.Ajax.request({
                            url: baseUrl + '/api/prefix',
                            method: 'POST',
                            jsonData: values,

                            success: function () {

                                loadApiData();
                                btn.up('form').reset();
                                Ext.toast('Added successfully!');
                            }
                        });
                    }
                }
            ]
        },



        {
            xtype: 'textarea',
            itemId: 'jsonArea',
            flex: 1,
            readOnly: true,

        }
    ]
};