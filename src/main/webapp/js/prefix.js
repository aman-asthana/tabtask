Ext.define('PrefixModel', {
    extend: 'Ext.data.Model',
    fields: ['id', 'prefix', 'name', 'gender', 'relation']
});

var entryStore = Ext.create('Ext.data.Store', {
    model: 'PrefixModel',
    data: []
});

function loadData() {
    PrefixService.listPrefixes({
        callback: function (data) {
            entryStore.loadData(data);
        },
        errorHandler: function (message, exception) {
            console.error('DWR listPrefixes error:', message, exception);
            Ext.Msg.alert('Error', 'Failed to load data: ' + message);
        }
    });
}

function editWindow(record) {
    Ext.create('Ext.window.Window', {
        title: 'Update record',
        width: 400,
        layout: 'fit',
        modal: true,

        items: [
            {
                xtype: 'form',
                padding: 20,

                items: [
                    {
                        xtype: 'combobox',
                        name: 'prefix',
                        fieldLabel: 'Prefix',
                        store: ['Mr.', 'Mrs.', 'Dr.', 'Sr.', 'Prof', 'Sir.'],
                        queryMode: 'local',
                        editable: false,
                        value: record.get('prefix'),
                        allowBlank: false
                    },
                    {
                        xtype: 'textfield',
                        name: 'name',
                        fieldLabel: 'Name',
                        allowBlank: false,
                        value: record.get('name'),
                    },
                    {
                        xtype: 'combobox',
                        name: 'gender',
                        fieldLabel: 'Gender',
                        store: ['Male', 'Female', 'Others'],
                        queryMode: 'local',
                        editable: false,
                        value: record.get('gender'),
                        allowBlank: false
                    },
                    {
                        xtype: 'combobox',
                        name: 'relation',
                        fieldLabel: 'PrefixOf',
                        store: ['S/O', 'D/O', 'M/O', 'W/O'],
                        queryMode: 'local',
                        editable: false,
                        value: record.get('relation'),
                        allowBlank: false
                    }

                ],
                buttons: [
                    {
                        text: 'Update',
                        handler: function (btn) {
                            var form = btn.up('form');
                            var values = form.getValues();

                            PrefixService.updatePrefix(
                                record.get('id'),
                                values.prefix,
                                values.name,
                                values.gender,
                                values.relation,
                                {
                                    callback: function () {
                                        loadData();
                                        Ext.toast('Entry updated successfully!', 'success');
                                        btn.up('window').close();
                                    },
                                    errorHandler: function (message, exception) {
                                        console.error('DWR updatePrefix error:', message, exception);
                                        Ext.Msg.alert('Error', 'Failed to update entry: ' + message);
                                    }
                                }
                            );
                        }
                    }
                ]
            }
        ]
    }).show();
}

var prefix = {
    title: 'Entry (DWR)',
    xtype: 'panel',
    padding: 15,
    layout: { type: 'vbox', align: 'stretch' },

    listeners: {
        activate: function () {
            loadData();
        }
    },

    items: [

        {
            xtype: 'form',
            layout: 'hbox',
            margin: '0 0 15 0',

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
                    store: ['Male', 'Female', 'Others'],
                    margin: '0 10 0 0'
                },
                {
                    xtype: 'combobox',
                    fieldLabel: 'Relation',
                    name: 'relation',
                    store: ['S/O', 'H/O', 'D/O'],
                    margin: '0 10 0 0'
                },
                {
                    xtype: 'button',
                    text: 'Add',
                    handler: function (btn) {

                        var form = btn.up('form');
                        var values = form.getValues();

                        if (!values.prefix || !values.name || !values.gender || !values.relation) {
                            Ext.Msg.alert('Error', 'Please fill in all fields.');
                            return;
                        }

                        PrefixService.addPrefix(
                            values.prefix,
                            values.name,
                            values.gender,
                            values.relation,
                            {
                                callback: function () {
                                    loadData();
                                    form.reset();
                                    Ext.toast('Entry added successfully!', 'success');
                                },
                                errorHandler: function (message, exception) {
                                    console.error('DWR addPrefix error:', message, exception);
                                    Ext.Msg.alert('Error', 'Failed to add entry: ' + message);
                                }
                            }
                        );
                    }
                }
            ]
        },

        {
            xtype: 'grid',
            store: entryStore,
            flex: 1,

            columns: [
                { text: 'ID', dataIndex: 'id', width: 80, align:'center' },
                { text: 'Prefix', dataIndex: 'prefix', width: 300, align:'center' },
                { text: 'Name', dataIndex: 'name', width: 300, align:'center' },
                { text: 'Gender', dataIndex: 'gender', width: 300, align:'center' },
                { text: 'Relation', dataIndex: 'relation', width: 300, align:'center' },
                {
                    xtype: 'actioncolumn',
                    text: 'Delete',
                    width: 80,
                    align: 'center',
                    items: [
                        {
                            iconCls: 'x-fa fa-trash',
                            tooltip: 'Delete',
                            align: 'center',

                            handler: function (grid, rowIndex) {
                                var record = entryStore.getAt(rowIndex);
                                Ext.Msg.confirm(
                                    'Confirm',
                                    'Are you sure you want to delete this entry?',
                                    function (choice) {
                                        if (choice === 'yes') {
                                            PrefixService.deletePrefix(
                                                record.get('id'),
                                                {
                                                    callback: function () {
                                                        loadData();
                                                        Ext.toast('Entry deleted successfully!', 'success');
                                                    },
                                                    errorHandler: function (message, exception) {
                                                        console.error('DWR deletePrefix error:', message, exception);
                                                        Ext.Msg.alert('Error', 'Failed to delete entry: ' + message);
                                                    }
                                                }
                                            );
                                        }
                                    });
                                }
                        }
                    ]
                },
                {
                    xtype: 'actioncolumn',
                    text: 'Edit',
                    width: 80,
                    align: 'center',
                    items: [
                        {
                            iconCls: 'x-fa fa-edit',
                            align: 'center',
                            tooltip: 'Edit',
                            handler: function (grid, rowIndex) {
                            var record = entryStore.getAt(rowIndex);
                            editWindow(record);
                                }
                        }
                    ]
                },
            ]
        }
    ]
};
