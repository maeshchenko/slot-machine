//developed by Eshchenko Mikhail mikhail.eshchenko@gmail.com
function renderScene(){
	let elemArr = ["seven", "watermelon", "plum", "cherries","banana","lemon","orange"]

	this.animationTime = 900;
	this.bet = 10;
	this.bank = 500;

	this.elems = [];
	this.winingTime = animationTime*3;
	this.elemLines = [];
	this.disks = 3;
	this.isSpinAnimationFinished = true;
	this.randArr = [];
	this.isWin = false;
	this.frameArr = [];
	this.lines = [];
	this.isAuto = false;
	this.numberOfSpins = 0;
	this.numberOfWins = 0;
	this.soundWin = new Audio('https://freesound.org/data/previews/69/69687_866625-lq.mp3');
	this.soundSpin = new Audio('https://freesound.org/data/previews/69/69695_866625-lq.mp3');
	

	for(let i = 0; i<elemArr.length; i++){
		for (let j = 0; j<=i; j++){
			elems.push(elemArr[i]);
		}
	}
	elems = elems.concat(elems);
	elems.sort(randomizeElems);

	for(let i = 0; i<disks;i++){
	    elemLines[i] = $("<div class=\"slotLine slotLine"+i+"\"></div>");
	    elemLines[i].appendTo(".window");
	};

	let genElems = function(elems){
		this.shownElems = [];
		for(let i =0; i<this.elems.length; i++){
			this.shownElems[i] = document.createElement('div');
			this.shownElems[i].class = this.elems[i];
			this.shownElems[i].className = 'slotLineInner '+this.elems[i];
			document.getElementsByClassName("slotLine")[this.line].appendChild(this.shownElems[i]);
		};
	};

	for(let i = 0; i<disks;i++){
		lines[i] = {
			line:i,
			elems: elems.sort(randomizeElems).slice(),
			genElems: genElems
		};
		lines[i].genElems();
	};

	function randomizeElems(a,b){
		let result = (Math.floor(Math.random()*10)-5);
		return result;
	};

	for(let i =0; i<3; i++){
		frameArr[i] = document.createElement('div');
		frameArr[i].id = 'frame'+i;
		frameArr[i].className = 'frame';
		document.getElementsByClassName("window")[0].appendChild(frameArr[i]);
	};

	let betNode = document.createTextNode("$"+formatNumber(bet,6));
	document.getElementsByClassName("bet-inner")[0].appendChild(betNode);
	let bankNode = document.createTextNode("$"+formatNumber(bank,10));
	document.getElementsByClassName("score-inner")[0].appendChild(bankNode);
};

document.getElementById("start").onclick = function(){
	if (isSpinAnimationFinished){
		spinMachine();	
	}
};

document.getElementById("bet-minus").onclick = function(){
	bet=(bet-10>0)?bet-10:bet;	
	document.getElementsByClassName("bet-inner")[0].textContent = "$"+formatNumber(bet,6);
};

document.getElementById("bet-plus").onclick = function(){
	bet=(bet+10<=bank)?bet+10:bet;
	document.getElementsByClassName("bet-inner")[0].textContent = "$"+formatNumber(bet,6);
};

function animateBank(start,result){
	if (start<result){
		temp = start;
		let addAnim = setInterval(function(){
			document.getElementsByClassName("score-inner")[0].textContent = "$"+formatNumber(temp,10);
			if(temp<result){temp++}else{clearInterval(addAnim);}
		},winingTime/(result-start));		
	}else{
		document.getElementsByClassName("score-inner")[0].textContent = "$"+formatNumber(result,10);
	}
};

function formatNumber(number,signs){
	return number;
};

function spinMachine(){
	document.getElementsByClassName("msg-wrap")[0].style.display = "none";
	console.clear();
	numberOfSpins++;
	console.log("Spins: "+numberOfSpins);
	console.log("Wins: "+numberOfWins);
	console.log("isAuto: "+isAuto);
	animateBank(bank, bank-bet);
	bank-=bet;
	randArr = [];
	soundSpin.play();
	isSpinAnimationFinished = false;
	showedArr = [];
	isWin = false;

	for(let i = 0; i< disks; i++){
		max = elems.length - 20;
		min = 10;
		randArr.push(Math.floor(Math.random() * (max - min + 1))+min);
	};

	setTimeout(function(){
			$(".slotLine0").animate({"top" : -randArr[0]*126+"px"},animationTime,'easeOutBack',function(){});
			setTimeout(function(){
				$(".slotLine1").animate({"top" : -randArr[1]*126+"px"}, animationTime,'easeOutBack',function(){});
				setTimeout(function(){
					$(".slotLine2").animate({"top" : -randArr[2]*126+"px"}, {
						duration:animationTime,
						easing:'easeOutBack',
						complete:function(){
							for(let i = 0;i < disks;i++){
								if (lines[0].shownElems[randArr[0] +i]["class"] === lines[1].shownElems[randArr[1]+i]["class"] &&  lines[1].shownElems[randArr[1]+i]["class"] === lines[2].shownElems[randArr[2]+i]["class"]){
									console.log("WIN "+(i+1) +" line!");
									numberOfWins++;
									console.log(lines[0].shownElems[randArr[0] +i]["class"]);
									frameArr[i].classList.add("active");
									animateBank(bank,bank+bet*10);
									bank += bet*10;
									
									soundWin.play();
									setTimeout(function(){
										frameArr[i].classList.remove("active");
										isSpinAnimationFinished = true;
										if(isAuto){spinMachine()};
									},winingTime);
									isWin = true;
								}
							};
							
							for(let i = 0;i<disks;i++){
								for(let f = 0; f<randArr[i];f++){
									document.getElementsByClassName("slotLine")[i].firstChild.remove();
									lines[i].shownElems.shift();
									let  tempRandomNumber = Math.floor(Math.random()*elems.length);
									elem = document.createElement('div');
									elem.class = elems[tempRandomNumber];
									elem.className = 'slotLineInner '+elems[tempRandomNumber];
									document.getElementsByClassName("slotLine")[i].appendChild(elem);
									lines[i].shownElems.push(elem);
								};
								document.getElementsByClassName("slotLine")[i].style.top = "0px";
							};

							if (!isWin){
								isSpinAnimationFinished = true;
								if (bank - bet<0){
									bet = bank;
									document.getElementsByClassName("bet-inner")[0].textContent = "$"+formatNumber(bet,6);
								};
								if (bank <= 0){
									document.getElementsByClassName("msg-wrap")[0].style.display = "inline-block";
									bank = 500;
									bet = 10;
									document.getElementsByClassName("score-inner")[0].textContent = "$"+formatNumber(bank,10);
									document.getElementsByClassName("bet-inner")[0].textContent = "$"+formatNumber(bet,6);	
									isAuto = false;
									document.getElementById("auto").classList.remove("btn-active");						
								}
								if(isAuto){spinMachine()};
							};
						}
					});
				},100);
			},100);
	},100);
};

document.getElementById("auto").onclick = function(){
	isAuto = (isAuto)?false:true;
	if (isAuto){
		document.getElementById("auto").classList.add("btn-active");
		document.getElementById("start").click();
	}else{
		document.getElementById("auto").classList.remove("btn-active");
	}
};

renderScene();