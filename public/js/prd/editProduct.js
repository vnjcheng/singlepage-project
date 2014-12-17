/**
 * 添加和编辑产品页面
 * @author cwj
 * @author 2014-12-05
 */

$(function() {
	var noty = new Noty();

	var editProduct = {
		/**
		 * 中转函数
		 * @return {[type]} [description]
		 */
		init: function() {
			// 页面渲染
			this.render();
			// 事件绑定
			this.bindEvent();
		},
		/**
		 * 页面渲染
		 * @return {[type]} [description]
		 */
		render: function() {
			//初始化富文本编辑器
			var um = this.um = UM.getEditor('journeyDescEditor');
			$(".edui-container").click(function(e){
				$(this).css({"border":"solid 1px"});
			});

			// 初始化城市选择
			this.chooseCity();
		},
		/**
		 * 初始化城市选择
		 * @return {[type]} [description]
		 */
		chooseCity: function() {
			function defaultArea(selectId){
				$("#"+selectId).html("<option value=''>请选择</option>");
			}

			function initArea(type,msg){
				var param={"type":type};
				var selectId="areaArea";
				if(type==1){
					defaultArea("areaArea");
					defaultArea("areaProvince");
					defaultArea("areaCity");
				}else if(type==2){
					selectId="areaProvince";
					defaultArea("areaProvince");
					defaultArea("areaCity");
					if($("#areaArea").val()=='0')return;
					param.parentId=parseInt($("#areaArea").val().split("_")[0],10);
				}else if(type==3){
					selectId="areaCity";
					defaultArea("areaCity");
					if($("#areaProvince").val()=='0')return;
					param.parentId=parseInt($("#areaProvince").val().split("_")[0],10);
				}
				$.ajax({
					url:"http://115.28.9.36/baijia/area/query.html",
					data:param,
					dataType:"json",
					type:"GET",
					success:function(data){
						if(data.success && data.data){
							for(var i in data.data) {
								$("#"+selectId).append("<option value='"+data.data[i].id+"_"+data.data[i].name+"'>"+data.data[i].name+"</option>");
							}
						}else{
							alert(msg);
						}
					},
					error:function(XMLHttpRequest, textStatus, errorThrown){
						alert(msg);
					}
				});
			}

			initArea(1,"区域信息获取失败");
			$("#areaArea").change(function(){
				initArea(2,"省份获取失败");
			});
			$("#areaProvince").change(function(){
				initArea(3,"城市获取失败");
			});
		},
		/**
		 * 事件绑定
		 * @return {[type]} [description]
		 */
		bindEvent: function() {
			var um = this.um;
			//保存按钮
			$("#bottomsave, #topsave").click(function(){
				var vali = { data : Forms.get($('#edit')) };
				vali.data.journeyDesc=um.getContent();

				// 填写校验
				var ver = new Verify($('#edit'));
				if(!vali.data.journeyDesc || vali.data.journeyDesc.length==0){
					$(".edui-container").css({"border":"solid 1px red"}).tooltip({title:'不能为空'});
					return;	
				}
				//长度限制
				if(vali.data.name.length>50){
					alert("活动名称长度不得大于50字");
					return;
				}
				if(vali.success){
						var data={};
						data.product={};
						data.productExtendWithBLOBs={};
						data.productDestination={};
						data.productSaleTag={};
						
						data.product.name=vali.data.name;
						data.product.productType=vali.data.productType;
						data.product.lowestPrice=vali.data.lowestPrice;
						
						data.productExtendWithBLOBs.warmNotice=vali.data.warmNotice;
						data.productExtendWithBLOBs.costInclude=vali.data.costInclude;
						data.productExtendWithBLOBs.costExclude=vali.data.costExclude;
						data.productExtendWithBLOBs.journeyDesc=vali.data.journeyDesc;
						data.productExtendWithBLOBs.characteristic=vali.data.characteristic;
						
						data.productSaleTag.saleTag=vali.data.saleTag;
						
						var areaSplit=vali.data.areaArea.split("_");
						var provinceSplit=vali.data.areaProvince.split("_");
						var citySplit=vali.data.areaCity.split("_");
						data.productDestination.areaId=parseInt(areaSplit[0],10);
						data.productDestination.areaName=areaSplit[1];
						data.productDestination.provinceId=parseInt(provinceSplit[0],10);
						data.productDestination.provinceName=provinceSplit[1];
						data.productDestination.cityId=parseInt(citySplit[0],10);
						data.productDestination.cityName=citySplit[1];
						$.ajax({
							url:"../product/save.html",
							data:$.toJSON(data),
							contentType:"application/json",
							dataType:"json",
							type:"POST",
							success:function(data){
								if(data.success){
										window.location.href="../product/list.html";
								}else{
									noty.info("保存失败");
								}
							},
							error:function(XMLHttpRequest, textStatus, errorThrown){
								noty.error("保存失败");
							}
						}); 
				}
			});
			
			// 编辑器去掉验证
			
			$('.edui-container').click(function(){
				$(this).tooltip('hide').removeData('tooltip');
			});
		}
	};

	editProduct.init();
});