
(function ($) {
	var defaults = {
		width:        4,    // 转盘宽度
		height:       4,    // 转盘高度
		initSpeed:    300,	// 初始转动速度
		speed:        300,	// 当前转动速度
		upStep:       25,   // 加速滚动步长
		upMax:        50,   // 速度上限
		downStep:     25,   // 减速滚动步长
		downMax:      300,  // 减速上限
		waiting:      1000, // 匀速转动时长
		index:        0,    // 初始位置
		target:       5,    // 中奖位置，可通过后台算法来获得，默认值：最便宜的一个奖项或者"谢谢参与"
	}

	var methods = {

		// 初始化用户配置
		init: function (options) {
			this.options = $.extend(true, defaults, options);
			this.index = this.options.index;
			this.options.speed = this.options.initSpeed;
			this.count = this.options.width * this.options.height - (this.options.width - 2) * (this.options.height - 2);
			for (var i = 0; i < this.options.width; ++i) {
				this.find('.lottery-group:first .lottery-unit:eq(' + i + ')').attr('lottery-unit-index', i);
			}
			for (var i = this.count - this.options.height + 1, j = 0, len = this.options.width + this.options.height - 2; i >= len; --i, ++j) {
				this.find('.lottery-group:last .lottery-unit:eq(' + j + ')').attr('lottery-unit-index', i);
			}
			for (var i = 1, len = this.options.height - 2; i <= len; ++i) {
				this.find('.lottery-group:eq(' + i + ') .lottery-unit:first').attr('lottery-unit-index', this.count - i);
				this.find('.lottery-group:eq(' + i + ') .lottery-unit:last').attr('lottery-unit-index', this.options.width + i - 1);
			}
			methods['enable'].call(this);
		},
		
		// 转动
		roll: function () {

			var $this = this;
			$this.find('[lottery-unit-index=' + $this.index + ']').removeClass("act");
			$this.index = ++$this.options.index % $this.count;
			$this.find('[lottery-unit-index=' + $this.index + '].lottery-unit').addClass("act");
			$this.rollerTimer = setTimeout(function () { methods['roll'].call($this); }, $this.options.speed);
			if (!$this.isRunning) {
				methods['up'].call($this);
				$this.isRunning = true;
			}
		},
		
		// 加速
		up: function () {
			var $this = this;
			if ($this.options.speed <= $this.options.upMax) {
				methods['constant'].call($this);
			} else {
				$this.options.speed -= $this.options.upStep;
				$this.upTimer = setTimeout(function () { methods['up'].call($this); }, $this.options.speed);
			}
		},
		
		// 匀速
		constant: function () {
			var $this = this;
			clearTimeout($this.upTimer);
			setTimeout(function () { handlers['beforeDown'].call($this); }, $this.options.waiting);
		},

		// 减速
		down: function () {
			var $this = this;
			if ($this.options.speed > $this.options.downMax && $this.options.target == $this.index) {
				methods['stop'].call($this);
			} else {
				$this.options.speed += $this.options.downStep;
				$this.downTimer = setTimeout(function () { methods['down'].call($this); }, $this.options.speed);
			}
		},

		// 转盘停止，还原设置
		stop: function () {
			clearTimeout(this.downTimer);
			clearTimeout(this.rollerTimer);
			this.options.speed = this.options.initSpeed;
			this.isRunning = false;
			handlers['afterStop'].call(this);
		},

		/// 开启抽奖，仅生效一次
		enable: function () {
			//alert(this);
			var $this = this;

			var flag = true;
			$('.td_5').on('click', function() {

				/*每次点击触发事件一次*/
				if(flag){
					var num = parseInt( $('.prizeNum').html());

					if(  num <= 0 ){
						$('.prizeContent').html('您还未获得抽奖机会！');
						$('.yt_icon').addClass('noprizeIcon');
						$('.yt_prize_btn').html('<a href="javascript:;" class="knowBtn">知道了</a><a href="javascript:;" class="prizeInvest">去投资</a>');
						$('.yt_prize_alert').show();
					}else{
						num--;
						$('.prizeNum').html(num);
						/*存在次数开始转动重新绑定事件*/
						handlers['beforeRoll'].call($this);
						flag = false;
					}
				}

			});
		}
	}

	var handlers = {
		
		// 抽奖之前的操作，支持用户追加操作
		beforeRoll: function () {
			if (this.options.beforeRoll) {
				this.options.beforeRoll.call(this);
			}
			methods['roll'].call(this);

		},
		
		// 减速之前的操作，支持用户追加操作
		beforeDown: function () {
			handlers['aim'].call(this);
			if (this.options.beforeDown) {
				this.options.beforeDown.call(this);
			}
			methods['down'].call(this);
		},
		
		// 转动停止之后的操作，支持用户追加操作
		afterStop: function () {
			var targetElement = this.find('[lottery-unit-index=' + this.options.target + ']');
			if (this.options.afterStop) {
				if (!this.options.afterStop.call(this, targetElement[0])) {
					false;
				}
			}

			methods['enable'].call(this); // 转盘停止之后，默认重新开启转盘；如果不再需要开启，那么只需要重写的afterStop事件返回false即可
			
			//alert('您抽中了: ' + targetElement.data('lottery-reward'));
		},
		
		// 获取中奖号，用户可重写该事件，默认随机数字
		aim: function () {
			var $this = this;
			if (this.options.aim) {
				this.options.target = this.options.aim.call(this);
			} else {
				this.options.target = parseInt(parseInt(Math.random() * 10) * this.count / 10);
			}
		}
	}

	$.fn.lottery = function (options) {
		methods['init'].call(this, options);
	}
})(jQuery);