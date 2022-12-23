let msg = false;
let template = [];
frappe.ui.form.on('Lead', {
    refresh(frm) {
        if(frm.doc.whatsapp_no){
            
            frm.add_custom_button(__("Send Whatsapp Message"), function(){
            let number = frm.doc.whatsapp_no;
            template = [];
            frappe.call({
                      method:'whatsapp_app.whatsapp_app.doctype.api.get_template_list',
                      args:{
                        'doctype': 'Lead'
                      },
                        freeze: true,
                        callback: (r) => {
                            for(let i=0; i<r.message.length; i++){
                                template.push(r.message[i])
                            }
                        },
                        error: (r) => {
                            frappe.msgprint('somthing want wrong!');
                        }
                  });
            let d = new frappe.ui.Dialog({
            title: 'Send Message',
            fields: [
                {
                    label: "Select Message Type",
                    fieldname: "select_message_type",
                    fieldtype: "Select",
                    options: ["Template", "Text"]
                },
                {
                    label: 'Enter Your Message',
                    fieldname: 'message',
                    fieldtype: 'Data',
                    depends_on: "eval:(doc.select_message_type == 'Text')"
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
                      method:'whatsapp_app.whatsapp_app.doctype.api.send_whatsapp_message',
                      args:{
                          'message': values['message'],
                          'number': number,
                          'template_name': values['select_template']
                      },
                        freeze: true,
                        callback: (r) => {
                            frappe.msgprint('Message Sent');
                        },
                        error: (r) => {
                            frappe.msgprint('somthing want wrong!');
                        }
                  });
                d.hide();
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
                  method:'whatsapp_app.whatsapp_app.doctype.api.send_whatsapp_message',
                  args:{
                      'message': values['message'],
                      'number': number,
                      'template_name': values['select_template']
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
    if(msg === true){
        d.show();
    }
    else{
        d1.show();
    }
    });

    frappe.call({
        method:'whatsapp_app.whatsapp_app.doctype.api.check_status',
        args:{
            'number': frm.doc.whatsapp_no
        },
        freeze: true,
        callback: (r) => {
            if(r.message === 'yes'){
                msg = true;
            }
            else if(r.message === 'no'){
                msg = false;
            }
        },
        error: (r) => {
            console.log("somthing wrong");
        }
    });
}
},
});
