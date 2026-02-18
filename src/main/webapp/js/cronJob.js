

var cronJob = {
    title: 'Cron Job',
    xtype: 'panel',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    padding: 20,

    items: [
        // Control Panel
        {
            xtype: 'panel',
            padding: 10,
            layout: 'hbox',
            defaults: {
                margin: '0 10 0 0'
            },
            items: [
                {
                    xtype: 'textfield',
                    fieldLabel: 'Cron Expression',
                    itemId: 'cronInput',
                    labelWidth: 100,
                    width: 280,
                    value: '*/5 * * * * *',
                    emptyText: 'Enter cron expression (e.g. */5 * * * * *)'
                },
                {
                    xtype: 'button',
                    text: 'Start',
                    itemId: 'startBtn',
                    width: 70,
                    handler: function(btn) {
                        var panel = btn.up('panel').up('panel');
                        var cronExpr = panel.down('#cronInput').getValue();

                        if (!cronExpr || cronExpr.trim() === '') {
                            Ext.Msg.alert('Error', 'Please enter a cron expression');
                            return;
                        }

                        Ext.Ajax.request({
                            url: 'api/cron/start',
                            method: 'POST',
                            params: { expression: cronExpr },
                            success: function(response) {
                                var data = Ext.decode(response.responseText);
                                if (data.success) {
                                    panel.down('#startBtn').setDisabled(true);
                                    panel.down('#stopBtn').setDisabled(false);
                                    panel.down('#statusLabel').setValue('<span style="color:green"><b>RUNNING</b></span>');
                                    Ext.toast('Started: ' + cronExpr);
                                } else {
                                    Ext.Msg.alert('Error', data.message);
                                }
                            },
                            failure: function() {
                                Ext.Msg.alert('Error', 'Failed to start');
                            }
                        });
                    }
                },
                {
                    xtype: 'button',
                    text: 'Stop',
                    itemId: 'stopBtn',
                    width: 70,
                    disabled: true,
                    handler: function(btn) {
                        var panel = btn.up('panel').up('panel');

                        Ext.Ajax.request({
                            url: 'api/cron/stop',
                            method: 'POST',
                            success: function() {
                                panel.down('#startBtn').setDisabled(false);
                                panel.down('#stopBtn').setDisabled(true);
                                panel.down('#statusLabel').setValue('<span style="color:red"><b>STOPPED</b></span>');
                                Ext.toast('Cron Job Stopped');
                            }
                        });
                    }
                },
                {
                    xtype: 'button',
                    text: 'Clear',
                    width: 60,
                    handler: function(btn) {
                        var panel = btn.up('panel').up('panel');
                        panel.down('#logArea').setValue('');
                        Ext.Ajax.request({ url: 'api/cron/clear', method: 'POST' });
                    }
                },
                {
                    xtype: 'displayfield',
                    itemId: 'statusLabel',
                    fieldLabel: 'Status',
                    labelWidth: 45,
                    value: '<span style="color:red"><b>STOPPED</b></span>'
                }
            ]
        },

        // Output Area
        {
            xtype: 'textarea',
            itemId: 'logArea',
            fieldLabel: 'Output',
            labelAlign: 'top',
            flex: 1,
            readOnly: true,
            style: 'font-family: monospace; font-size: 13px;'
        }
    ],

    listeners: {
        afterrender: function(panel) {
            // Check initial status
            Ext.Ajax.request({
                url: 'api/cron/status',
                method: 'GET',
                success: function(response) {
                    var data = Ext.decode(response.responseText);
                    if (data.running) {
                        panel.down('#startBtn').setDisabled(true);
                        panel.down('#stopBtn').setDisabled(false);
                        panel.down('#statusLabel').setValue('<span style="color:green"><b>RUNNING</b></span>');
                    }
                }
            });

            // Poll logs every 2 sec
            panel.logPoller = setInterval(function() {
                Ext.Ajax.request({
                    url: 'api/cron/logs',
                    method: 'GET',
                    success: function(response) {
                        var data = Ext.decode(response.responseText);
                        if (data.logs) {
                            var logArea = panel.down('#logArea');
                            logArea.setValue(data.logs);
                            var el = logArea.inputEl.dom;
                            el.scrollTop = el.scrollHeight;
                        }
                    }
                });
            }, 2000);
        },
        destroy: function(panel) {
            if (panel.logPoller) clearInterval(panel.logPoller);
        }
    }
};
