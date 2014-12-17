/**
 * 校验文件
 * @author cwj
 * @author 2014-12-05
 */

 function Verify(node,options,callback){
	this.config = {};
	var defaultSettings = {
		displayTooltip:true//是否显示tooltip以及出错提示，不显示的情况主要用于搜索前校验
	};
	$.extend(this.config,defaultSettings,options);
	this.ver = new Ver();							//里面有很多正则表达式，可以用他们来校验many Regxs in it, and we can use it to verify widget's value
	this.patterns = this.getPatterns();				//让ver里面的所有属性组成一个数组，主要用于判断ver-pattern是否可以用ver来校验。make the 
	this.node = node || $(document.body);			//
	this.callback = callback;						//回调函数，让用户自定义校验方法，最终把参数flag 返回即可
	this.flag = true;								//控制校验成功与否的标识
	this.verPatternTitle = this.verPatternTitle();	//格式校验的提示信息

	this.init();
 }

 $.extend(Verify.prototype,{
	init: function(){
		var self = this;
		//获得焦点取消提醒
		$("input,select,a,textarea").on("click", function(e) {
			if(typeof($(this).data('tooltip')) != 'undefined'){
				$(this).tooltip('hide').removeData('tooltip');
				$(this).css('border-color', '');
			}
		});
		$('input,textarea,select',this.node).each(function(i,n){
			var innerFlag = true;
			var title = '';
			var required = $(n).attr('ver-required');
			var pattern = $(n).attr('ver-pattern');

			//清空tooltip的痕迹
			if(typeof($(n).data('tooltip')) != 'undefined'){
				$(this).tooltip('hide').removeData('tooltip');
				$(n).css('border-color', '');
			}
			
			if($.inArray(pattern, self.patterns) == -1){
				pattern = null;
			}
			var length = $(n).attr('ver-length');
			if(required){
				if($.trim($(n).val()) == '' || $(n).val() == null){
					innerFlag = false;
					self.flag = false;
					title += '不能为空';
				}
			}
			if($.trim($(n).val())!='' && (pattern != null) && (!self.ver[pattern]($.trim($(n).val())))){
				innerFlag = false;
				self.flag = false;
				title += ' 格式有误,' + self.verPatternTitle[pattern];

			}
			if($.trim($(n).val()).length > length){
				innerFlag = false;
				self.flag = false;
				title += ' 字符长度不能超过' + length;
			}

			if(self.config.displayTooltip){
				if(!innerFlag){
					$(n).css('border-color', 'red');;
					$(n).tooltip({title:title});
				}
			}
		});
	},
	//获得ver对象的属性名，拼成数组
	getPatterns: function(){
		var allPatterns = [];
		for(var name in this.ver){
			allPatterns.push(name);
		}
		return allPatterns;
	},

	getFlag: function(){
		if(typeof(this.callback) == 'function'){
			this.flag = this.callback(this.flag);
		}
		return this.flag;
	},

	verPatternTitle: function(){
		var verTitle = {
			"cell": "请输入手机号，如：13899977777",
			"telCode": "请输入固话的区号，如：025,010,0510...",
			"tel": "请输入固话号码，如87654321",
			"telAll": "请输入固话区号加号码，如025-87654321",
			"date": "请输入日期，格式YYYY-MM-DD，如2012-01-01",
			"rangeDate": "请输入时间段，格式YYYY-MM-DD - YYYY-MM-DD，如2012-01-01 - 2012-07-01",
			"email": "请输入电子邮件地址，如1@126.com",
			"url": "请输入url地址，如http://www.baidu.com",
			"charReg": "存在特殊字符...",
			"letterAndNum": "请输入字母和数字，如sd823",
			"price": "请输入价格，如4.99",
			"positiveInt": "请输入正整数，如2",
			"nonnegativeInt": "请输入非负整数，如0",
			"yearInt": "请输入年份，如2012",
			"dateEx": "请输入年份和月份，格式YYYY-MM，如2012-06",
			"telNum": "请输入固话区号加号码加分机号，如025-87654321-000000",
			"IsValidHour": "请输入小时，0~23",
			"IsValidMinute": "请输入分钟，0~59",
			"IsValidSecond": "请输入秒钟，0~59"
		};
		return verTitle;
	}

 });