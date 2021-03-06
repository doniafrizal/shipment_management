frappe.ui.form.on("Quotation", {
    refresh: function (frm) {
        add_fedex_rates_button(frm);
    },

    get_fedex_rates: function (frm) {
        _get_fedex_rates(frm);
    }
});

frappe.ui.form.on("Sales Order", {
    refresh: function (frm) {
        add_fedex_rates_button(frm);
    },

    get_fedex_rates: function (frm) {
        _get_fedex_rates(frm);
    }
});

frappe.ui.form.on("Sales Invoice", {
    refresh: function (frm) {
        add_fedex_rates_button(frm);
    },

    get_fedex_rates: function (frm) {
        _get_fedex_rates(frm);
    }
});


function add_fedex_rates_button(frm) {
    if (frm.doc.docstatus == 0) {
        frm.add_custom_button(__('Get Fedex Rates'),
            function () {
                _get_fedex_rates(frm)
            });
    }
}

function _get_fedex_rates(frm) {
    $.each(frm.doc.taxes, function (index, item) {
        if (item.account_head == "Freight and Forwarding Charges - JA") {
            frappe.throw("Shipment Charge has already been added")
        }
    })
    frappe.call({
        freeze: 1,
        method: 'shipment_management.api.get_rates_for_doc',
        args: {
            doc: frm.doc
        },
        callback: function (response) {
            var options_string = ""
            var service_dict = {}
            $.each(response.message, function (index, value) {
                option = value.label + " - $" + value.fee + "\n"
                options_string += option
                service_dict[option.slice(0, -1)] = {
                    "label": value.label,
                    "fee": value.fee
                }
            })

            service_dict["PICK UP - $0"] = {"label" : "PICK UP", "fee" : 0}
            options_string += "PICK UP - " + "$0" + "\n"
            frappe.prompt({
                    "label": "Service Types",
                    "fieldtype": "Select",
                    "options": options_string.slice(0, -1),
                    "reqd": 1
                },
                function (data) {
                    var service_data = service_dict[data.service_types]
                    if (service_data.fee != 0) {
                        var row = frappe.model.add_child(frm.doc, "Sales Taxes and Charges", "taxes");
                        row.charge_type = "Actual";
                        row.account_head = "Freight and Forwarding Charges - JA";
                        row.tax_amount = service_data.fee
                        row.description = "Shipping(" + service_data.label + ")"

                    }
                    frm.set_value("fedex_shipping_method", service_dict[data.service_types].label.replace(/ /g, "_"))
                    refresh_field("taxes");
                    frm.save()
                },
                "Select Service")
        }
    })
}