
var listStore = Ext.create('Ext.data.Store', {
    pageSize: 5,
    fields: ['prefix', 'name', 'gender', 'relation'],
    data: [
        {"prefix":"Mr.","name":"Aman","gender":"Male","relation":"S/O"},
        {"prefix":"Ms.","name":"Riya","gender":"Female","relation":"D/O"},
        {"prefix":"Mrs.","name":"Neha","gender":"Female","relation":"W/O"},
        {"prefix":"Mr.","name":"Rahul","gender":"Male","relation":"S/O"},
        {"prefix":"Ms.","name":"Pooja","gender":"Female","relation":"D/O"},
        {"prefix":"Mr.","name":"Suresh","gender":"Male","relation":"S/O"},
        {"prefix":"Mrs.","name":"Kavita","gender":"Female","relation":"W/O"},
        {"prefix":"Mr.","name":"Ankit","gender":"Male","relation":"S/O"},
        {"prefix":"Ms.","name":"Sneha","gender":"Female","relation":"D/O"},
        {"prefix":"Mr.","name":"Vikas","gender":"Male","relation":"S/O"}
    ],
    proxy: {
        type: 'memory',
        enablePaging: true
    }
});

function loadData() {
    PrefixService.listPrefixes({
        callback: function (data) {
            listStore.loadData(data);
            listStore.loadPage(1);
        },
        errorHandler: function (message, exception) {
            console.error('DWR listPrefixes error:', message, exception);
            Ext.Msg.alert('Error', 'Failed to load data: ' + message);
        }
    });
}





var paging = {
    title: 'List',
    xtype: 'panel',
    layout: 'fit',
    height: 700,
    listeners: {
        activate: function(){
            loadData();
        }
    },
    items: [
        {
            xtype: 'grid',
            store: listStore,
            selModel: 'rowmodel',
            columns: [
                { text: 'Prefix', dataIndex: 'prefix',  sortable: true },
                { text: 'Name', dataIndex: 'name', sortable: true },
                { text: 'Gender', dataIndex: 'gender',  sortable: true },
                { text: 'Relation', dataIndex: 'relation', sortable: true }
            ],

            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        'Search:',
                        {
                            xtype: 'textfield',
                            emptyText: 'Enter name...',
                            listeners: {
                                change: function (field, newValue) {
                                    listStore.clearFilter();

                                    if (newValue) {
                                        listStore.filter({
                                            property: 'name',
                                            value: newValue,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        'Search:',
                        {
                            xtype: 'textfield',
                            emptyText: 'Enter relation...',
                            listeners: {
                                change: function (field, newValue) {
                                    listStore.clearFilter();

                                    if (newValue) {
                                        listStore.filter({
                                            property: 'relation',
                                            value: newValue,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'pagingtoolbar',
                    dock: 'bottom',
                    store: listStore,
                    displayInfo: true
                }
            ]
        }
    ]
};