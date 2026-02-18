// Cron Job Scheduler - Simple Hello World with UI-controlled timing

var cronJob = {
    title: 'Cron Job Scheduler',
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
            padding: 15,
            layout: 'hbox',
            defaults: {
                margin: '0 15 0 0'
            },
            items: [
                {
                    xtype: 'combo',
                    fieldLabel: 'Interval',
                    itemId: 'intervalCombo',
                    labelWidth: 60,
                    width: 200,
                    editable: false,
                    value: 1000,
                    store: [
                        [500, '500 ms'],
                        [1000, '1 sec'],
                        [2000, '2 sec'],
                        [5000, '5 sec'],
                        [10000, '10 sec'],
                        [15000, '15 sec'],
                        [30000, '30 sec'],
                        [60000, '1 min']
                    ]
                },
                {
                    xtype: 'button',
                    text: 'Start',
                    itemId: 'startBtn',
                    width: 80,
                    handler: function(btn) {
                        var panel = btn.up('panel').up('panel');
                        var interval = panel.down('#intervalCombo').getValue();

                        // Clear previous logs
                        var logArea = panel.down('#logArea');
                        logArea.setValue('');

                        // Start scheduler
                        if (panel.schedulerTask) {
                            clearInterval(panel.schedulerTask);
                        }

                        panel.schedulerTask = setInterval(function() {
                            var now = new Date();
                            var time = now.toLocaleTimeString();
                            var currentText = logArea.getValue();
                            logArea.setValue(currentText + 'Hello World! - ' + time + '\n');

                            // Auto scroll to bottom
                            var textareaEl = logArea.inputEl.dom;
                            textareaEl.scrollTop = textareaEl.scrollHeight;
                        }, interval);

                        panel.down('#startBtn').setDisabled(true);
                        panel.down('#stopBtn').setDisabled(false);
                        Ext.toast('Scheduler Started');
                    }
                },
                {
                    xtype: 'button',
                    text: 'Stop',
                    itemId: 'stopBtn',
                    width: 80,
                    disabled: true,
                    handler: function(btn) {
                        var panel = btn.up('panel').up('panel');

                        if (panel.schedulerTask) {
                            clearInterval(panel.schedulerTask);
                            panel.schedulerTask = null;
                        }

                        panel.down('#startBtn').setDisabled(false);
                        panel.down('#stopBtn').setDisabled(true);
                        Ext.toast('Scheduler Stopped');
                    }
                },
                {
                    xtype: 'button',
                    text: 'Clear',
                    width: 80,
                    handler: function(btn) {
                        var panel = btn.up('panel').up('panel');
                        panel.down('#logArea').setValue('');
                    }
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
            style: 'font-family: monospace; font-size: 14px;'
        }
    ],

    listeners: {
        destroy: function(panel) {
            if (panel.schedulerTask) {
                clearInterval(panel.schedulerTask);
            }
        }
    }
};
