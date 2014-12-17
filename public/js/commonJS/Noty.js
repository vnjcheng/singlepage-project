/**
 * 提示说明（包含alert提示以及错误提示）
 * @author cwj
 * @author 2014-12-05
 */

var Noty = function() {

}

Noty.prototype = {
	alert: function(msg, callback) {
		var options = {
			text: msg || "",
			layout: "center",
			type: "alert",
			closable: false,
			timeout: false,
			modal: true
		};
		$.extend(options, {
			buttons: [{
				type: "btn btn-primary",
				text: "<i class='icon-ok'></i>确定",
				click: function($noty) {
					if (typeof(callback) == 'function') {
						callback($noty);
					}
					$noty.close();
				}
			}]
		});
		Notice(options);
	},
	info: function(msg) {
		var options = {
			text: msg || "",
			layout: "topCenter",
			type: "information"
		};
		Notice(options);
	},
	error: function(msg) {
		var options = {
			text: msg || "",
			layout: "topCenter",
			type: "error"
		};
		Notice(options);
	},
	confirm: function(msg, buttons) {
		var options = {
			text: msg || "",
			layout: "center",
			closable: false,
			timeout: false,
			modal: true
		};
		if (!buttons) {
			$.extend(options, {
				buttons: [{
					type: "btn btn-danger",
					text: "<i class='icon-remove'></i>取消",
					click: function($noty) {
						$noty.close();
						return false;
					}
				}]
			});
		} else {
			$.extend(options, {
				buttons: [buttons, {
					type: "btn btn-danger",
					text: "<i class='icon-remove'></i>取消",
					click: function($noty) {
						$noty.close();
						return false;
					}
				}]
			});
		}
		Notice(options);
	},
	validateWarn: function(node, msg) {
		node.attr('data-original-title', msg).css('border-color', 'red').tooltip();
	},
	validateReset: function(node) {
		node.removeAttr('data-original-title').css('border-color', '');
	}
}