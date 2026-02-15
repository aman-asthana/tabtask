var dropdown = {
    title: 'Dropdown',
    xtype: 'panel',
    padding: 20,
    layout: 'vbox',
    items: [
        {
            xtype: 'component',
            html: '<label for="cars">Choose a car:</label>'+
                        '<select name="cars" id="cars">'+
                        '<option value="">Select Cars</option>'+
                        '<option value="volvo">Volvo</option>'+
                        '<option value="saab">Saab</option>'+
                        '<option value="mercedes">Mercedes</option>'+
                        '<option value="audi">Audi</option>'+
                    '</select><br><br>'
        },
        {
            xtype: 'combobox',
            fieldLabel: 'ExtJs Combo',
            width: 300,
            store: ['Doctor', 'Nurse', 'Medical'],
            queryMode: 'local',
            editable: true
        }
    ]
}