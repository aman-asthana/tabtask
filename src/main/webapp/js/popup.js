var popup = {
    title: 'Popup',
    xtype: 'panel',
    padding: 20,

    items: [
        {
            xtype: 'button',
            text: 'Open Patient Popup',
            width: 220,

            handler: function () {

                var patientData = {
                    name: 'Aman Asthana',
                    mrn: 'MRN123456',
                    dob: '13/04/2004',
                    age: 21,
                    gender: 'Male',
                    address: 'Mumbai',
                    registrationDate: '01/01/2020',
                    status: 'Active',
                    notes: 'Patient has hypertension.'
                };

                var formPanel = Ext.create('Ext.form.Panel', {
                    layout: 'column',
                    width: '100%',

                    defaults: {
                        xtype: 'textfield',
                        columnWidth: 0.5,
                        labelAlign: 'top',
                        margin: '0 10 10 0'
                    },

                    items: [
                        { fieldLabel: 'Name', name: 'name' },
                        { fieldLabel: 'MRN', name: 'mrn' },
                        { fieldLabel: 'DOB', name: 'dob' },
                        { fieldLabel: 'Age', name: 'age' },
                        { fieldLabel: 'Gender', name: 'gender' },
                        { fieldLabel: 'Address', name: 'address' },
                        { fieldLabel: 'Registration Date', name: 'registrationDate' },
                        { fieldLabel: 'Status', name: 'status' },
                        { fieldLabel: 'Notes', name: 'notes' }
                    ]
                });

                var editor = Ext.create('Ext.form.field.HtmlEditor', {
                    fieldLabel: 'Patient Editor',
                    width: '100%',
                    height: 200,
                    labelAlign: 'top'
                });

                var win = Ext.create('Ext.window.Window', {
                    title: 'Patient Details',
                    width: 700,
                    height: 520,
                    modal: true,
                    layout: 'vbox',
                    bodyPadding: 15,
                    scrollable: true,

                    items: [formPanel, editor],

                    buttons: [
                        {
                            text: 'Save',
                            handler: function () {
                                Ext.Msg.alert('Info', 'Patient saved!');
                            }
                        },
                        {
                            text: 'Close',
                            handler: function (btn) {
                                btn.up('window').close();
                            }
                        }
                    ]
                });

                formPanel.getForm().setValues(patientData);

                editor.setValue(
                    "Name: " + patientData.name + "<br>" +
                    "MRN: " + patientData.mrn + "<br>" +
                    "DOB: " + patientData.dob + "<br>" +
                    "Age: " + patientData.age + "<br>" +
                    "Gender: " + patientData.gender + "<br>" +
                    "Address: " + patientData.address + "<br>" +
                    "Registration Date: " + patientData.registrationDate + "<br>" +
                    "Status: " + patientData.status + "<br>" +
                    "Notes: " + patientData.notes
                );

                editor.on('change', function (field, newValue) {

                    var clean = newValue.replace(/<br>/g, '\n');
                    var lines = clean.split('\n');
                    var data = {};

                    lines.forEach(function (line) {
                        var parts = line.split(':');
                        if (parts.length >= 2) {
                            data[parts[0].trim().toLowerCase()] =
                                parts.slice(1).join(':').trim();
                        }
                    });

                    formPanel.getForm().setValues(data);
                });

                win.show();
            }
        }
    ]
};