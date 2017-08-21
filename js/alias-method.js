
var AliasMethod = (function () {
	var prizes = null;
	var props = null;
	var alias = null;
	
	// 初始化算法模型
	this.init = function (items) {
		prizes = items;
		var len = prizes.length;
		props = new Array();
		alias = new Array();
		
		var smallProps = new Array();
		var largeProps = new Array();
		for (var i = 0; i < len; ++i) {
			var pb = (items[i].probability * len).toFixed(2);
			props.push(pb);
			alias.push(null);
			if (props[i] < 1.0) {
				smallProps.push(i);
			} else {
				largeProps.push(i);
			}
		}
		while (smallProps.length != 0 && largeProps.length != 0) {
			var smallIndex = smallProps.shift();
			var largeIndex = largeProps.shift();
			alias[smallIndex] = largeIndex;
			props[largeIndex] = (props[largeIndex] - (1 - props[smallIndex])).toFixed(2);
			if (props[largeIndex] < 1.0) {
				smallProps.push(largeIndex);
			} else {
				largeProps.push(largeIndex);
			}
		}
		while (smallProps.length != 0) {
			props[smallProps.shift()] = 1.0;
		}
		while (largeProps.length != 0) {
			props[largeProps.shift()] = 1.0;
		}
	}
	
	// 随机生成一个奖项，即中奖
	this.generate = function () {
		var posibility = Math.random();
		var randomCol = parseInt(Math.random() * prizes.length);
		return prizes[posibility < props[randomCol] ? randomCol : alias[randomCol]];
	}
	
	// 奖项
	this.Prize = function (index, name, probability) {
		this.index = index;
		this.name = name;
		this.probability = probability;
	}
	
	// 测试
	this.test = function () {
		var prizeArray = new Array();
		var gutoufan = new AliasMethod.Prize(0, "iphone 6s", 0.00);
		prizeArray.push(iphone6s);
		var dazuiba = new AliasMethod.Prize(1, "特权本金2000元", 0.0);
		prizeArray.push(techuanbenjian2000yuan);
		var qiandaohu = new AliasMethod.Prize(2, "魔音耳机", 0.00);
		prizeArray.push(moyinerji);
		var quzhoucai = new AliasMethod.Prize(3, "金互行特质台历", 0.00);
		prizeArray.push(jinhuhangtaili);
		var laodifang = new AliasMethod.Prize(4, "特权本金1000元", 0.0);
		prizeArray.push(techuanbenjian1000yuan);
		var huangmenji = new AliasMethod.Prize(5, "马克杯", 0.00);
		prizeArray.push(makebei);
		var zhengbaihui = new AliasMethod.Prize(6, "特权本金500元", 0.6);
		prizeArray.push(techuanbenjian500yaun);
		var dengdeng = new AliasMethod.Prize(7, "可爱小毛巾", 0.00);
		prizeArray.push(keaixiaomaojin);
		
		AliasMethod.init(prizeArray);
		var count = 0;
		for (var i = 0; i < 10000000; ++i) {
			var prize = this.generate();
			if ('特权本金500元' == prize.name) {
				++count;
			}
		}
		console.log(count/10000000);
	}
	
	return this;
})();