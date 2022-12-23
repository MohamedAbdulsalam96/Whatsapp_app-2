frappe.listview_settings['Opportunity'].onload = function(listview) {
    // add button to menu
    listview.page.add_action_item(__("Send Whatsapp Template"), function() {
    	test( listview );
});
};

function test( listview )
{
	let names=[];
	$.each(listview.get_checked_items(), function(key, value) {
		names.push(value.name);
	});
	if (names.length === 0) {
		frappe.throw(__("No rows selected."));
	}

    template = [];
    frappe.call({
              method:'whatsapp_app.whatsapp_app.doctype.api.get_template_list',
              args:{
                'doctype': 'Opportunity'
              },
                freeze: true,
                callback: (r) => {
                    for(let i=0; i<r.message.length; i++){
                        template.push(r.message[i])
                    }
                    template.append["new add"]
                },
                error: (r) => {
                    frappe.msgprint('somthing want wrong!');
                }
          });
     let d1 = new frappe.ui.Dialog({
        title: 'Send Message',
        fields: [
            {
                label: "Select Message Type",
                fieldname: "select_message_type",
                fieldtype: "Select",
                options: ["Template"]
                },
                {
                    label: 'Select Template',
                    fieldname: 'select_template',
                    fieldtype: 'Select',
                    options: template,
                    depends_on: "eval:(doc.select_message_type == 'Template')"
                }
        ],
        primary_action_label: 'Send',
        primary_action(values) {
                frappe.call({
                  method:'whatsapp_app.whatsapp_app.doctype.api.send_bulk_whatsapp_message',
                  args:{
                      'template_name': values['select_template'],
                      'doctype': 'Opportunity',
                      'name': names
                  },
                    freeze: true,
                    callback: (r) => {
                        frappe.msgprint('message sent');
                    },
                    error: (r) => {
                        frappe.msgprint('somthing want wrong!');
                    }
              });
            d1.hide();
        }

    });
    d1.show();
}