(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"Untitled_1_atlas_1", frames: [[0,0,623,1438],[625,0,753,903],[625,905,753,903]]},
		{name:"Untitled_1_atlas_2", frames: [[755,0,784,784],[820,786,750,750],[0,905,818,818],[0,0,753,903]]},
		{name:"Untitled_1_atlas_3", frames: [[1247,1369,778,564],[0,719,522,957],[1286,650,683,683],[0,0,717,717],[524,1369,721,643],[719,0,760,648],[524,719,760,648]]},
		{name:"Untitled_1_atlas_4", frames: [[1325,1663,721,264],[531,749,759,398],[864,0,396,733],[611,1149,355,673],[968,1149,355,611],[1325,1050,355,611],[1682,1050,355,611],[1262,0,502,531],[1292,533,512,515],[0,768,529,609],[0,0,452,766],[0,1379,609,505],[454,0,408,747]]},
		{name:"Untitled_1_atlas_5", frames: [[1973,463,75,116],[1147,491,75,115],[1808,463,79,186],[1433,491,87,56],[1224,491,77,103],[1303,491,128,55],[1063,317,512,172],[1063,0,720,146],[928,349,108,172],[1063,148,615,167],[1577,317,99,262],[1977,247,56,120],[1680,148,295,313],[0,0,355,510],[357,0,355,510],[1977,369,64,63],[1038,491,107,117],[1785,0,128,117],[1915,0,128,117],[1678,463,128,117],[0,512,72,31],[1522,491,52,52],[1889,463,82,170],[714,349,212,339],[714,0,347,347],[1977,119,59,126]]}
];


(lib.AnMovieClip = function(){
	this.currentSoundStreamInMovieclip;
	this.actionFrames = [];
	this.soundStreamDuration = new Map();
	this.streamSoundSymbolsList = [];

	this.gotoAndPlayForStreamSoundSync = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.gotoAndPlay = function(positionOrLabel){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(positionOrLabel);
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(this.currentFrame);
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
		this.clearAllSoundStreams();
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
		this.clearAllSoundStreams();
	}
	this.startStreamSoundsForTargetedFrame = function(targetFrame){
		for(var index=0; index<this.streamSoundSymbolsList.length; index++){
			if(index <= targetFrame && this.streamSoundSymbolsList[index] != undefined){
				for(var i=0; i<this.streamSoundSymbolsList[index].length; i++){
					var sound = this.streamSoundSymbolsList[index][i];
					if(sound.endFrame > targetFrame){
						var targetPosition = Math.abs((((targetFrame - sound.startFrame)/lib.properties.fps) * 1000));
						var instance = playSound(sound.id);
						var remainingLoop = 0;
						if(sound.offset){
							targetPosition = targetPosition + sound.offset;
						}
						else if(sound.loop > 1){
							var loop = targetPosition /instance.duration;
							remainingLoop = Math.floor(sound.loop - loop);
							if(targetPosition == 0){ remainingLoop -= 1; }
							targetPosition = targetPosition % instance.duration;
						}
						instance.loop = remainingLoop;
						instance.position = Math.round(targetPosition);
						this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop , sound.offset);
					}
				}
			}
		}
	}
	this.InsertIntoSoundStreamData = function(soundInstance, startIndex, endIndex, loopValue, offsetValue){ 
 		this.soundStreamDuration.set({instance:soundInstance}, {start: startIndex, end:endIndex, loop:loopValue, offset:offsetValue});
	}
	this.clearAllSoundStreams = function(){
		var keys = this.soundStreamDuration.keys();
		for(var i = 0;i<this.soundStreamDuration.size; i++){
			var key = keys.next().value;
			key.instance.stop();
		}
 		this.soundStreamDuration.clear();
		this.currentSoundStreamInMovieclip = undefined;
	}
	this.stopSoundStreams = function(currentFrame){
		if(this.soundStreamDuration.size > 0){
			var keys = this.soundStreamDuration.keys();
			for(var i = 0; i< this.soundStreamDuration.size ; i++){
				var key = keys.next().value; 
				var value = this.soundStreamDuration.get(key);
				if((value.end) == currentFrame){
					key.instance.stop();
					if(this.currentSoundStreamInMovieclip == key) { this.currentSoundStreamInMovieclip = undefined; }
					this.soundStreamDuration.delete(key);
				}
			}
		}
	}

	this.computeCurrentSoundStreamInstance = function(currentFrame){
		if(this.currentSoundStreamInMovieclip == undefined){
			if(this.soundStreamDuration.size > 0){
				var keys = this.soundStreamDuration.keys();
				var maxDuration = 0;
				for(var i=0;i<this.soundStreamDuration.size;i++){
					var key = keys.next().value;
					var value = this.soundStreamDuration.get(key);
					if(value.end > maxDuration){
						maxDuration = value.end;
						this.currentSoundStreamInMovieclip = key;
					}
				}
			}
		}
	}
	this.getDesiredFrame = function(currentFrame, calculatedDesiredFrame){
		for(var frameIndex in this.actionFrames){
			if((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)){
				return frameIndex;
			}
		}
		return calculatedDesiredFrame;
	}

	this.syncStreamSounds = function(){
		this.stopSoundStreams(this.currentFrame);
		this.computeCurrentSoundStreamInstance(this.currentFrame);
		if(this.currentSoundStreamInMovieclip != undefined){
			var soundInstance = this.currentSoundStreamInMovieclip.instance;
			if(soundInstance.position != 0){
				var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
				var soundPosition = (soundValue.offset?(soundInstance.position - soundValue.offset): soundInstance.position);
				var calculatedDesiredFrame = (soundValue.start)+((soundPosition/1000) * lib.properties.fps);
				if(soundValue.loop > 1){
					calculatedDesiredFrame +=(((((soundValue.loop - soundInstance.loop -1)*soundInstance.duration)) / 1000) * lib.properties.fps);
				}
				calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
				var deltaFrame = calculatedDesiredFrame - this.currentFrame;
				if(deltaFrame >= 2){
					this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame,calculatedDesiredFrame));
				}
			}
		}
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.CachedBmp_63 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_62 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_65 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_15 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_64 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_16 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_60 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_55 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_54 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_61 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_53 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_52 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_59 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_56 = function() {
	this.initialize(ss["Untitled_1_atlas_4"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_57 = function() {
	this.initialize(ss["Untitled_1_atlas_4"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_58 = function() {
	this.initialize(ss["Untitled_1_atlas_3"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_146 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_138 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_37 = function() {
	this.initialize(ss["Untitled_1_atlas_4"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_36 = function() {
	this.initialize(ss["Untitled_1_atlas_4"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_35copy = function() {
	this.initialize(ss["Untitled_1_atlas_4"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_35 = function() {
	this.initialize(ss["Untitled_1_atlas_4"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_38 = function() {
	this.initialize(ss["Untitled_1_atlas_3"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_33 = function() {
	this.initialize(ss["Untitled_1_atlas_4"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_160 = function() {
	this.initialize(ss["Untitled_1_atlas_3"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_159 = function() {
	this.initialize(ss["Untitled_1_atlas_3"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_157 = function() {
	this.initialize(ss["Untitled_1_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_158 = function() {
	this.initialize(ss["Untitled_1_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_156 = function() {
	this.initialize(ss["Untitled_1_atlas_2"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_22 = function() {
	this.initialize(ss["Untitled_1_atlas_4"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_39 = function() {
	this.initialize(ss["Untitled_1_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_32 = function() {
	this.initialize(ss["Untitled_1_atlas_3"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_14 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_13 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_21 = function() {
	this.initialize(ss["Untitled_1_atlas_4"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_11 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_12 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_20 = function() {
	this.initialize(ss["Untitled_1_atlas_4"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_9 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_7 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_24 = function() {
	this.initialize(ss["Untitled_1_atlas_3"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_8 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_23 = function() {
	this.initialize(ss["Untitled_1_atlas_3"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_5 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_18 = function() {
	this.initialize(ss["Untitled_1_atlas_4"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_19 = function() {
	this.initialize(ss["Untitled_1_atlas_4"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_151 = function() {
	this.initialize(ss["Untitled_1_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_4 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_17 = function() {
	this.initialize(ss["Untitled_1_atlas_4"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_3 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_29 = function() {
	this.initialize(ss["Untitled_1_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_30 = function() {
	this.initialize(ss["Untitled_1_atlas_2"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_40 = function() {
	this.initialize(img.CachedBmp_40);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,889,2238);


(lib.CachedBmp_41 = function() {
	this.initialize(img.CachedBmp_41);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,876,2513);


(lib.CachedBmp_42 = function() {
	this.initialize(img.CachedBmp_42);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,876,2633);


(lib.CachedBmp_43 = function() {
	this.initialize(img.CachedBmp_43);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,1012,3073);


(lib.CachedBmp_1 = function() {
	this.initialize(ss["Untitled_1_atlas_5"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_136 = function() {
	this.initialize(img.CachedBmp_136);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2886,1657);


(lib.CachedBmp_134 = function() {
	this.initialize(img.CachedBmp_134);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2886,1657);


(lib.CachedBmp_74 = function() {
	this.initialize(img.CachedBmp_74);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2886,1657);


(lib.CachedBmp_81 = function() {
	this.initialize(img.CachedBmp_81);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2886,1657);


(lib.CachedBmp_75 = function() {
	this.initialize(img.CachedBmp_75);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2886,1657);


(lib.CachedBmp_133 = function() {
	this.initialize(img.CachedBmp_133);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2886,1657);


(lib.CachedBmp_83 = function() {
	this.initialize(img.CachedBmp_83);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2886,1657);


(lib.CachedBmp_80 = function() {
	this.initialize(img.CachedBmp_80);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2886,1657);


(lib.CachedBmp_135 = function() {
	this.initialize(img.CachedBmp_135);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2886,1657);


(lib.CachedBmp_132 = function() {
	this.initialize(img.CachedBmp_132);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2886,1657);


(lib.CachedBmp_82 = function() {
	this.initialize(img.CachedBmp_82);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2886,1657);


(lib.CachedBmp_73 = function() {
	this.initialize(img.CachedBmp_73);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2886,1657);


(lib.CachedBmp_72 = function() {
	this.initialize(img.CachedBmp_72);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2886,1657);


(lib.CachedBmp_2 = function() {
	this.initialize(img.CachedBmp_2);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2886,1657);


(lib.up_arm = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_65();
	this.instance.setTransform(8.5,13.7,0.4463,0.4463);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(8.5,13.7,35.3,83);


(lib.Scene_1_darkScreen = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// darkScreen
	this.instance = new lib.CachedBmp_2();
	this.instance.setTransform(-89.1,-49.7,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_72();
	this.instance_1.setTransform(-89.1,-49.7,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_73();
	this.instance_2.setTransform(-89.1,-49.7,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_74();
	this.instance_3.setTransform(-89.1,-49.7,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_75();
	this.instance_4.setTransform(-89.1,-49.7,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_132();
	this.instance_5.setTransform(-89.1,-49.7,0.5,0.5);
	this.instance_5._off = true;

	this.instance_6 = new lib.CachedBmp_83();
	this.instance_6.setTransform(-89.1,-49.7,0.5,0.5);

	this.instance_7 = new lib.CachedBmp_82();
	this.instance_7.setTransform(-89.1,-49.7,0.5,0.5);

	this.instance_8 = new lib.CachedBmp_81();
	this.instance_8.setTransform(-89.1,-49.7,0.5,0.5);

	this.instance_9 = new lib.CachedBmp_80();
	this.instance_9.setTransform(-89.1,-49.7,0.5,0.5);

	this.instance_10 = new lib.CachedBmp_133();
	this.instance_10.setTransform(-89.1,-49.7,0.5,0.5);
	this.instance_10._off = true;

	this.instance_11 = new lib.CachedBmp_134();
	this.instance_11.setTransform(-89.1,-49.7,0.5,0.5);
	this.instance_11._off = true;

	this.instance_12 = new lib.CachedBmp_135();
	this.instance_12.setTransform(-89.1,-49.7,0.5,0.5);
	this.instance_12._off = true;

	this.instance_13 = new lib.CachedBmp_136();
	this.instance_13.setTransform(-89.1,-49.7,0.5,0.5);
	this.instance_13._off = true;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},38).to({state:[{t:this.instance_1}]},136).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_8}]},1).to({state:[{t:this.instance_9}]},1).to({state:[{t:this.instance_8}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_12}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_12}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_12}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_12}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_12}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_12}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_12}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_12}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_12}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_12}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_12}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_12}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_12}]},1).to({state:[{t:this.instance_13}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(178).to({_off:false},0).to({_off:true},1).wait(7).to({_off:false},0).to({_off:true},1).wait(7).to({_off:false},0).to({_off:true},1).wait(7).to({_off:false},0).to({_off:true},1).wait(7).to({_off:false},0).to({_off:true},1).wait(7).to({_off:false},0).to({_off:true},1).wait(7).to({_off:false},0).to({_off:true},1).wait(7).to({_off:false},0).to({_off:true},1).wait(4));
	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(187).to({_off:false},0).to({_off:true},1).wait(5).to({_off:false},0).to({_off:true},1).wait(1).to({_off:false},0).to({_off:true},1).wait(5).to({_off:false},0).to({_off:true},1).wait(1).to({_off:false},0).to({_off:true},1).wait(5).to({_off:false},0).to({_off:true},1).wait(1).to({_off:false},0).to({_off:true},1).wait(5).to({_off:false},0).to({_off:true},1).wait(1).to({_off:false},0).to({_off:true},1).wait(5).to({_off:false},0).to({_off:true},1).wait(1).to({_off:false},0).to({_off:true},1).wait(5).to({_off:false},0).to({_off:true},1).wait(1).to({_off:false},0).to({_off:true},1).wait(3));
	this.timeline.addTween(cjs.Tween.get(this.instance_11).wait(188).to({_off:false},0).to({_off:true},1).wait(3).to({_off:false},0).to({_off:true},1).wait(3).to({_off:false},0).to({_off:true},1).wait(3).to({_off:false},0).to({_off:true},1).wait(3).to({_off:false},0).to({_off:true},1).wait(3).to({_off:false},0).to({_off:true},1).wait(3).to({_off:false},0).to({_off:true},1).wait(3).to({_off:false},0).to({_off:true},1).wait(3).to({_off:false},0).to({_off:true},1).wait(3).to({_off:false},0).to({_off:true},1).wait(3).to({_off:false},0).to({_off:true},1).wait(3).to({_off:false},0).to({_off:true},1).wait(3).to({_off:false},0).to({_off:true},1).wait(2));
	this.timeline.addTween(cjs.Tween.get(this.instance_12).wait(189).to({_off:false},0).to({_off:true},1).wait(1).to({_off:false},0).to({_off:true},1).wait(5).to({_off:false},0).to({_off:true},1).wait(1).to({_off:false},0).to({_off:true},1).wait(5).to({_off:false},0).to({_off:true},1).wait(1).to({_off:false},0).to({_off:true},1).wait(5).to({_off:false},0).to({_off:true},1).wait(1).to({_off:false},0).to({_off:true},1).wait(5).to({_off:false},0).to({_off:true},1).wait(1).to({_off:false},0).to({_off:true},1).wait(5).to({_off:false},0).to({_off:true},1).wait(1).to({_off:false},0).to({_off:true},1).wait(5).to({_off:false},0).to({_off:true},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance_13).wait(190).to({_off:false},0).to({_off:true},1).wait(7).to({_off:false},0).to({_off:true},1).wait(7).to({_off:false},0).to({_off:true},1).wait(7).to({_off:false},0).to({_off:true},1).wait(7).to({_off:false},0).to({_off:true},1).wait(7).to({_off:false},0).to({_off:true},1).wait(7).to({_off:false},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.nose = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_63();
	this.instance.setTransform(15.5,-3,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_64();
	this.instance_1.setTransform(17.15,2,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(15.5,-3,40.2,58);


(lib.neck = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_62();
	this.instance.setTransform(-0.8,-2.7,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.8,-2.7,37.5,57.5);


(lib.mouth = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_55();
	this.instance.setTransform(23.15,141.15,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_56();
	this.instance_1.setTransform(23.5,125.15,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_57();
	this.instance_2.setTransform(1.15,65.05,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_58();
	this.instance_3.setTransform(0,0,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_59();
	this.instance_4.setTransform(107.85,111.05,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_60();
	this.instance_5.setTransform(107.1,108.85,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_61();
	this.instance_6.setTransform(104.85,86.95,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_4}]},1).to({state:[]},1).to({state:[{t:this.instance_5}]},4).to({state:[{t:this.instance_6}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,412.4,282);


(lib.up_leg = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_54();
	this.instance.setTransform(0,-6.85,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-6.8,54,86);


(lib.leg2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_53();
	this.instance.setTransform(0,-12.3,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-12.3,49.5,131);


(lib.foot2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_16();
	this.instance.setTransform(0,0,0.4729,0.4729);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,60.6,26);


(lib.foot = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_15();
	this.instance.setTransform(1,5.8,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(1,5.8,43.5,27.999999999999996);


(lib.down_leg = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_52();
	this.instance.setTransform(-0.4,-7,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.4,-7,28,60);


(lib.lamp2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_138();
	this.instance.setTransform(439.6,-14.2,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_146();
	this.instance_1.setTransform(439.7,-14.2,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1,p:{x:439.7}}]},4).to({state:[{t:this.instance_1,p:{x:439.6}}]},4).wait(1));

	// Layer_6
	this.instance_2 = new lib.CachedBmp_160();
	this.instance_2.setTransform(359.25,-50.75,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_159();
	this.instance_3.setTransform(350.85,-59.15,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_158();
	this.instance_4.setTransform(342.5,-67.55,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_157();
	this.instance_5.setTransform(334.1,-75.95,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_156();
	this.instance_6.setTransform(325.7,-84.35,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2}]}).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_2}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(325.7,-84.3,409.00000000000006,409);


(lib.lamp_broken = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_35copy();
	this.instance.setTransform(-3,-16,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_36();
	this.instance_1.setTransform(-3,-16,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_37();
	this.instance_2.setTransform(-3,-16,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_38();
	this.instance_3.setTransform(-17.6,-16,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_39();
	this.instance_4.setTransform(-32.95,-16,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_40();
	this.instance_5.setTransform(-92.95,-16,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_41();
	this.instance_6.setTransform(-93,-16,0.5,0.5);

	this.instance_7 = new lib.CachedBmp_42();
	this.instance_7.setTransform(-93,-16,0.5,0.5);

	this.instance_8 = new lib.CachedBmp_43();
	this.instance_8.setTransform(-107.5,-16,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_8}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-107.5,-16,506,1536.5);


(lib.lamp = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_33();
	this.instance.setTransform(17.1,-99.55,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_35();
	this.instance_1.setTransform(17.1,-99.55,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},4).wait(5));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(17.1,-99.5,177.5,305.5);


(lib.hand10 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_24();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,380,324);


(lib.hand8 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_22();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,251,265.5);


(lib.hand6 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_21();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,256,257.5);


(lib.hand5 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_20();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,264.5,304.5);


(lib.hand4 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_19();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,304.5,252.5);


(lib.hand3 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_18();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,226,383);


(lib.hand1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_17();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,204,373.5);


(lib.eyebrows = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_14();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,32,31.5);


(lib.eye2_stati = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_13();
	this.instance.setTransform(-1.5,-1.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.5,-1.5,53.5,58.5);


(lib.eye2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_9();
	this.instance.setTransform(-1.5,-1.5,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_12();
	this.instance_1.setTransform(-1.5,-1.5,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_11();
	this.instance_2.setTransform(-1.5,-1.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},2).to({state:[{t:this.instance_2}]},2).to({state:[{t:this.instance_1}]},2).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.5,-1.5,64,58.5);


(lib.blinkeye = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_8();
	this.instance.setTransform(1.35,1.35,0.2886,0.2886);

	this.instance_1 = new lib.CachedBmp_7();
	this.instance_1.setTransform(-1.8,5.1,0.2886,0.2886);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},16).to({state:[{t:this.instance}]},1).wait(14));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.8,1.4,20.8,14.999999999999998);


(lib.down_arm = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_5();
	this.instance.setTransform(3.65,6.1,0.444,0.444);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(3.7,6.1,36.4,75.5);


(lib.body = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_4();
	this.instance.setTransform(-8.75,-9.05,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-8.7,-9,106,169.5);


(lib.ball = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_3();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,173.5,173.5);


(lib.___Camera___ = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		this.visible = false;
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(2));

	// cameraBoundary
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("rgba(0,0,0,0)").ss(2,1,1,3,true).p("EAq+AfQMhV7AAAMAAAg+fMBV7AAAg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-641,-361,1282,722);


(lib.Scene_1_lamp = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// lamp
	this.instance = new lib.lamp("single",0);
	this.instance.setTransform(629.15,43.55,0.421,0.421,0,0,0,105.8,53.3);

	this.instance_1 = new lib.lamp_broken("synched",0,false);
	this.instance_1.setTransform(637.55,8.25,0.421,0.421,0,0,0,106,53.1);

	this.instance_2 = new lib.lamp2("synched",0);
	this.instance_2.setTransform(683.25,116.3,0.2709,0.2709,180,0,0,526.9,121.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance,p:{mode:"single",startPosition:0}}]}).to({state:[{t:this.instance,p:{mode:"synched",startPosition:4}}]},29).to({state:[{t:this.instance,p:{mode:"single",startPosition:4}}]},9).to({state:[{t:this.instance_1,p:{regX:106,regY:53.1,scaleX:0.421,scaleY:0.421,x:637.55,startPosition:0,y:8.25}}]},1).to({state:[{t:this.instance_1,p:{regX:106.3,regY:52.9,scaleX:0.4209,scaleY:0.4209,x:1509.95,startPosition:8,y:8.25}}]},129).to({state:[{t:this.instance_1,p:{regX:106.3,regY:52.8,scaleX:0.4209,scaleY:0.4209,x:1520.85,startPosition:8,y:8.3}},{t:this.instance_2}]},5).wait(66));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_ball = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// ball
	this.instance = new lib.ball("synched",0);
	this.instance.setTransform(791.3,351.45,0.1377,0.1377,0,0,0,86.5,86.5);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(5).to({_off:false},0).wait(1).to({regX:86.8,regY:86.8,x:762.95,y:301.45},0).wait(1).to({x:732.05,y:252.95},0).wait(1).to({x:694.75,y:209.65},0).wait(1).to({x:646.45,y:179},0).wait(1).to({x:590.35,y:181.05},0).wait(1).to({x:539.9,y:208.3},0).wait(1).to({x:501.8,y:251},0).wait(1).to({x:471.55,y:299.9},0).wait(1).to({x:444.8,y:350.85},0).to({_off:true},1).wait(9).to({_off:false,regX:86.5,regY:86.5,x:444.9,y:366.6},0).wait(1).to({regX:86.8,regY:86.8,x:463.6,y:319.65},0).wait(1).to({x:484.3,y:273.35},0).wait(1).to({x:507.65,y:228.45},0).wait(1).to({x:535.1,y:186},0).wait(1).to({x:569.3,y:148.8},0).wait(1).to({x:614.3,y:127.15},0).wait(1).to({x:662.35,y:139.5},0).wait(1).to({x:698.85,y:174.2},0).wait(1).to({x:726.95,y:216.3},0).wait(1).to({x:750.15,y:261.25},0).wait(1).to({x:770.15,y:307.75},0).wait(1).to({x:787.95,y:355.15},0).wait(1).to({x:755.35,y:331.1},0).wait(1).to({x:719.2,y:313.9},0).wait(1).to({x:678.7,y:311.95},0).wait(1).to({x:642,y:325.1},0).wait(1).to({x:623,y:360.8},0).wait(1).to({x:612.5,y:399.9},0).wait(1).to({x:603.8,y:439.55},0).wait(1).to({x:595.4,y:479.25},0).wait(1).to({x:587.9,y:519.2},0).wait(1).to({x:584.05,y:559.5},0).wait(1).to({x:580.65,y:548.45},0).wait(1).to({x:574.85,y:538.3},0).wait(1).to({x:566.7,y:530.05},0).wait(1).to({x:555.8,y:526.35},0).wait(1).to({x:544.85,y:529.9},0).wait(1).to({x:536.5,y:537.95},0).wait(1).to({x:530.55,y:548},0).wait(1).to({x:526.9,y:559.05},0).wait(1).to({x:517.8,y:550.2},0).wait(1).to({x:506.8,y:543.55},0).wait(1).to({x:494.9,y:539.35},0).wait(1).to({x:482.45,y:542.1},0).wait(1).to({x:472.05,y:549.55},0).wait(1).to({x:463.45,y:559.05},0).wait(1).to({x:457.7,y:554.25},0).wait(1).to({x:450.6,y:551.75},0).wait(1).to({x:443.2,y:552.65},0).wait(1).to({x:436.3,y:555.7},0).wait(1).to({x:429.05,y:557.7},0).wait(1).to({x:421.55,y:558.2},0).wait(1).to({x:414,y:558.55},0).wait(1).to({x:406.45,y:558.75},0).wait(1).to({x:398.85,y:558.8},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.head21 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.nose("single",0);
	this.instance.setTransform(176.95,208.5,0.3609,0.3609,-5.7711,0,0,36.2,26.2);

	this.instance_1 = new lib.CachedBmp_32();
	this.instance_1.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,360.5,321.5);


(lib.head2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.nose("single",0);
	this.instance.setTransform(176.95,208.5,0.3609,0.3609,-5.7711,0,0,36.2,26.2);

	this.instance_1 = new lib.blinkeye("synched",0);
	this.instance_1.setTransform(144.6,171.45,1.2185,1.2185,0,0,0,8.7,9);

	this.instance_2 = new lib.blinkeye("synched",0);
	this.instance_2.setTransform(194.3,171.45,1.2185,1.2185,0,0,0,8.7,9);

	this.instance_3 = new lib.CachedBmp_32();
	this.instance_3.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(40));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,360.5,321.5);


(lib.head11 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.nose("single",1);
	this.instance.setTransform(149.2,281.8,0.5222,0.5222,0,0,180,35.4,26.2);

	this.instance_1 = new lib.CachedBmp_30();
	this.instance_1.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,376.5,451.5);


(lib.head1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.nose("single",1);
	this.instance.setTransform(149.2,281.8,0.5222,0.5222,0,0,180,35.4,26.2);

	this.instance_1 = new lib.blinkeye("single",0);
	this.instance_1.setTransform(186.9,247.8,1.7326,1.7326,0,0,0,9,9);

	this.instance_2 = new lib.blinkeye("single",0);
	this.instance_2.setTransform(129.7,247.8,1.7326,1.7326,0,0,0,9,9);

	this.instance_3 = new lib.CachedBmp_30();
	this.instance_3.setTransform(0,0,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_29();
	this.instance_4.setTransform(0,0,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_151();
	this.instance_5.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2,p:{mode:"single",startPosition:0}},{t:this.instance_1,p:{mode:"single",startPosition:0}},{t:this.instance,p:{regX:35.4,regY:26.2,scaleX:0.5222,scaleY:0.5222,x:149.2,y:281.8}}]}).to({state:[{t:this.instance_4},{t:this.instance_2,p:{mode:"synched",startPosition:0}},{t:this.instance_1,p:{mode:"synched",startPosition:0}},{t:this.instance,p:{regX:35.7,regY:26,scaleX:0.5533,scaleY:0.5533,x:149.3,y:281.5}}]},8).to({state:[{t:this.instance_5},{t:this.instance_2,p:{mode:"synched",startPosition:28}},{t:this.instance_1,p:{mode:"synched",startPosition:28}},{t:this.instance,p:{regX:35.7,regY:26,scaleX:0.5533,scaleY:0.5533,x:149.3,y:281.5}}]},59).to({state:[]},1).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,376.5,451.5);


(lib.hand9 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.ball("synched",0);
	this.instance.setTransform(175.45,112.95,1,1,0,0,0,86.7,86.7);

	this.instance_1 = new lib.CachedBmp_23();
	this.instance_1.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,380,324);


(lib.Scene_1_Character2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Character2
	this.instance = new lib.mouth("single",0);
	this.instance.setTransform(325.75,263.6,0.0825,0.1752,-14.9864,0,0,233.2,131.9);

	this.instance_1 = new lib.down_arm("synched",0);
	this.instance_1.setTransform(287.6,388.75,0.8219,0.8219,0,0,0,21.9,12.8);

	this.instance_2 = new lib.up_arm("synched",0);
	this.instance_2.setTransform(296.7,336.35,0.8219,0.8219,0,0,180,15.6,26.5);

	this.instance_3 = new lib.body("synched",0);
	this.instance_3.setTransform(328.65,379.55,0.8219,0.8219,0,0,180,44.1,75.6);

	this.instance_4 = new lib.leg2("synched",0);
	this.instance_4.setTransform(319.1,493.2,1,1,0,0,0,24.8,53.1);

	this.instance_5 = new lib.hand1("synched",0);
	this.instance_5.setTransform(286.1,455.35,0.1393,0.1393,0,0,0,102.3,187);

	this.instance_6 = new lib.foot2("synched",0);
	this.instance_6.setTransform(307.35,558.5,0.9189,1.0573,0,-41.3995,149.6312,30.2,13.2);

	this.instance_7 = new lib.leg2("synched",0);
	this.instance_7.setTransform(345.35,482.55,1,1,0,0,180,24.8,53.1);

	this.instance_8 = new lib.foot2("synched",0);
	this.instance_8.setTransform(371.85,548.6,1.0155,1,0,0,10.0299,30.2,12.9);

	this.instance_9 = new lib.down_arm("synched",0);
	this.instance_9.setTransform(363.2,409.55,0.8219,0.8219,0,-10.0503,169.9497,21.7,43.9);

	this.instance_10 = new lib.hand1("synched",0);
	this.instance_10.setTransform(373.15,444.8,0.1171,0.1171,0,0,180,102,186.6);

	this.instance_11 = new lib.up_arm("synched",0);
	this.instance_11.setTransform(357.55,356.9,0.8219,0.8219,0,0,0,26.3,55.3);

	this.instance_12 = new lib.head2("synched",0);
	this.instance_12.setTransform(329.3,225.6,0.525,0.525,0,0,0,180.3,160.8);

	this.instance_13 = new lib.neck("synched",0);
	this.instance_13.setTransform(326.35,309.95,0.8219,0.8219,0,0,180,17.8,25.9);

	this.instance_14 = new lib.hand10("synched",0);
	this.instance_14.setTransform(427.2,393.85,0.1171,0.1171,-21.0386,0,0,103,187.9);

	this.instance_15 = new lib.hand9("synched",0);
	this.instance_15.setTransform(427.2,393.85,0.1171,0.1171,-21.0386,0,0,103,187.9);

	this.instance_16 = new lib.hand8("synched",0);
	this.instance_16.setTransform(424.3,408.3,0.1399,0.1399,-13.2964,0,0,103.1,188.6);

	this.instance_17 = new lib.head21("synched",0);
	this.instance_17.setTransform(475.65,226.25,0.525,0.525,-9.2896,0,0,180.5,160.8);

	this.instance_18 = new lib.hand6("synched",0);
	this.instance_18.setTransform(617.05,361.65,0.1794,0.2028,0,2.8814,-177.1186,101.7,193.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_13,p:{x:326.35}},{t:this.instance_12,p:{startPosition:0,rotation:0,x:329.3,y:225.6,regX:180.3}},{t:this.instance_11,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_10,p:{regX:102,regY:186.6,skewX:0,skewY:180,x:373.15,y:444.8}},{t:this.instance_9,p:{regY:43.9,skewX:-10.0503,skewY:169.9497,x:363.2,y:409.55,regX:21.7,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_8,p:{x:371.85}},{t:this.instance_7,p:{x:345.35}},{t:this.instance_6,p:{x:307.35}},{t:this.instance_5,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393}},{t:this.instance_4,p:{x:319.1}},{t:this.instance_3,p:{x:328.65}},{t:this.instance_2,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_1,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219}},{t:this.instance,p:{regX:233.2,rotation:-14.9864,x:325.75,y:263.6,regY:131.9,scaleX:0.0825,scaleY:0.1752,skewX:0,skewY:0,startPosition:0}}]}).to({state:[{t:this.instance_13,p:{x:326.35}},{t:this.instance_12,p:{startPosition:10,rotation:0,x:329.3,y:225.6,regX:180.3}},{t:this.instance_11,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_10,p:{regX:102.1,regY:187.2,skewX:-29.9968,skewY:150.0032,x:406.05,y:430.6}},{t:this.instance_9,p:{regY:44,skewX:-40.0491,skewY:139.9509,x:379.8,y:405.1,regX:21.7,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_8,p:{x:371.85}},{t:this.instance_7,p:{x:345.35}},{t:this.instance_6,p:{x:307.35}},{t:this.instance_5,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393}},{t:this.instance_4,p:{x:319.1}},{t:this.instance_3,p:{x:328.65}},{t:this.instance_2,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_1,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219}},{t:this.instance,p:{regX:233.2,rotation:-14.9864,x:325.75,y:263.6,regY:131.9,scaleX:0.0825,scaleY:0.1752,skewX:0,skewY:0,startPosition:0}}]},10).to({state:[{t:this.instance_13,p:{x:326.35}},{t:this.instance_12,p:{startPosition:11,rotation:0,x:329.3,y:225.6,regX:180.3}},{t:this.instance_11,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_10,p:{regX:102.4,regY:187.6,skewX:-45,skewY:135,x:416.5,y:417.55}},{t:this.instance_9,p:{regY:44.1,skewX:-55.0486,skewY:124.9514,x:384.55,y:399.6,regX:21.7,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_8,p:{x:371.85}},{t:this.instance_7,p:{x:345.35}},{t:this.instance_6,p:{x:307.35}},{t:this.instance_5,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393}},{t:this.instance_4,p:{x:319.1}},{t:this.instance_3,p:{x:328.65}},{t:this.instance_2,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_1,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219}},{t:this.instance,p:{regX:233.2,rotation:-14.9864,x:325.75,y:263.6,regY:131.9,scaleX:0.0825,scaleY:0.1752,skewX:0,skewY:0,startPosition:0}}]},1).to({state:[{t:this.instance_13,p:{x:326.35}},{t:this.instance_12,p:{startPosition:14,rotation:0,x:329.3,y:225.6,regX:180.3}},{t:this.instance_11,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_14,p:{regX:103,regY:187.9,scaleX:0.1171,scaleY:0.1171,rotation:-21.0386,x:427.2,y:393.85}},{t:this.instance_9,p:{regY:44,skewX:-79.008,skewY:100.992,x:390.7,y:387.8,regX:21.7,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_8,p:{x:371.85}},{t:this.instance_7,p:{x:345.35}},{t:this.instance_6,p:{x:307.35}},{t:this.instance_5,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393}},{t:this.instance_4,p:{x:319.1}},{t:this.instance_3,p:{x:328.65}},{t:this.instance_2,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_1,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219}},{t:this.instance,p:{regX:233.2,rotation:-14.9864,x:325.75,y:263.6,regY:131.9,scaleX:0.0825,scaleY:0.1752,skewX:0,skewY:0,startPosition:0}}]},3).to({state:[{t:this.instance_13,p:{x:326.35}},{t:this.instance_12,p:{startPosition:15,rotation:0,x:329.3,y:225.6,regX:180.3}},{t:this.instance_11,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_15,p:{regX:103,regY:187.9,scaleX:0.1171,scaleY:0.1171,rotation:-21.0386,x:427.2,y:393.85}},{t:this.instance_9,p:{regY:44,skewX:-79.008,skewY:100.992,x:390.7,y:387.8,regX:21.7,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_8,p:{x:371.85}},{t:this.instance_7,p:{x:345.35}},{t:this.instance_6,p:{x:307.35}},{t:this.instance_5,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393}},{t:this.instance_4,p:{x:319.1}},{t:this.instance_3,p:{x:328.65}},{t:this.instance_2,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_1,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219}},{t:this.instance,p:{regX:233.2,rotation:-14.9864,x:325.75,y:263.6,regY:131.9,scaleX:0.0825,scaleY:0.1752,skewX:0,skewY:0,startPosition:0}}]},1).to({state:[{t:this.instance_13,p:{x:326.35}},{t:this.instance_12,p:{startPosition:16,rotation:0,x:329.3,y:225.6,regX:180.3}},{t:this.instance_11,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_16,p:{regX:103.1,regY:188.6,rotation:-13.2964,x:424.3,y:408.3,scaleX:0.1399,scaleY:0.1399}},{t:this.instance_9,p:{regY:44.1,skewX:-71.2724,skewY:108.7276,x:389.3,y:391.7,regX:21.7,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_8,p:{x:371.85}},{t:this.instance_7,p:{x:345.35}},{t:this.instance_6,p:{x:307.35}},{t:this.instance_5,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393}},{t:this.instance_4,p:{x:319.1}},{t:this.instance_3,p:{x:328.65}},{t:this.instance_2,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_1,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219}},{t:this.instance,p:{regX:233.2,rotation:-14.9864,x:325.75,y:263.6,regY:131.9,scaleX:0.0825,scaleY:0.1752,skewX:0,skewY:0,startPosition:0}}]},1).to({state:[{t:this.instance_13,p:{x:326.35}},{t:this.instance_12,p:{startPosition:17,rotation:0,x:329.3,y:225.6,regX:180.3}},{t:this.instance_11,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_16,p:{regX:103.2,regY:188.7,rotation:-23.0041,x:427.7,y:398.15,scaleX:0.1399,scaleY:0.1399}},{t:this.instance_9,p:{regY:44.1,skewX:-80.9803,skewY:99.0197,x:390.95,y:386.75,regX:21.7,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_8,p:{x:371.85}},{t:this.instance_7,p:{x:345.35}},{t:this.instance_6,p:{x:307.35}},{t:this.instance_5,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393}},{t:this.instance_4,p:{x:319.1}},{t:this.instance_3,p:{x:328.65}},{t:this.instance_2,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_1,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219}},{t:this.instance,p:{regX:233.2,rotation:-14.9864,x:325.75,y:263.6,regY:131.9,scaleX:0.0825,scaleY:0.1752,skewX:0,skewY:0,startPosition:0}}]},1).to({state:[{t:this.instance_13,p:{x:326.35}},{t:this.instance_12,p:{startPosition:18,rotation:0,x:329.3,y:225.6,regX:180.3}},{t:this.instance_11,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_16,p:{regX:103.2,regY:188.8,rotation:-16.2777,x:425.15,y:406,scaleX:0.1399,scaleY:0.1399}},{t:this.instance_9,p:{regY:44.1,skewX:-74.2555,skewY:105.7445,x:390,y:390.45,regX:21.8,scaleX:0.8218,scaleY:0.8218}},{t:this.instance_8,p:{x:371.85}},{t:this.instance_7,p:{x:345.35}},{t:this.instance_6,p:{x:307.35}},{t:this.instance_5,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393}},{t:this.instance_4,p:{x:319.1}},{t:this.instance_3,p:{x:328.65}},{t:this.instance_2,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_1,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219}},{t:this.instance,p:{regX:233.2,rotation:-14.9864,x:325.75,y:263.6,regY:131.9,scaleX:0.0825,scaleY:0.1752,skewX:0,skewY:0,startPosition:0}}]},1).to({state:[{t:this.instance_13,p:{x:326.35}},{t:this.instance_12,p:{startPosition:19,rotation:0,x:329.3,y:225.6,regX:180.3}},{t:this.instance_11,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_16,p:{regX:103.5,regY:188.6,rotation:13.7224,x:404.7,y:434.55,scaleX:0.1398,scaleY:0.1398}},{t:this.instance_9,p:{regY:44.1,skewX:-44.256,skewY:135.744,x:382,y:403.45,regX:21.8,scaleX:0.8218,scaleY:0.8218}},{t:this.instance_8,p:{x:371.85}},{t:this.instance_7,p:{x:345.35}},{t:this.instance_6,p:{x:307.35}},{t:this.instance_5,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393}},{t:this.instance_4,p:{x:319.1}},{t:this.instance_3,p:{x:328.65}},{t:this.instance_2,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_1,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219}},{t:this.instance,p:{regX:233.2,rotation:-14.9864,x:325.75,y:263.6,regY:131.9,scaleX:0.0825,scaleY:0.1752,skewX:0,skewY:0,startPosition:0}}]},1).to({state:[{t:this.instance_13,p:{x:326.35}},{t:this.instance_12,p:{startPosition:20,rotation:0,x:329.3,y:225.6,regX:180.3}},{t:this.instance_11,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_16,p:{regX:104,regY:188.6,rotation:38.9186,x:374.9,y:448.1,scaleX:0.1398,scaleY:0.1398}},{t:this.instance_9,p:{regY:44.1,skewX:-19.0587,skewY:160.9413,x:367.55,y:410.25,regX:21.8,scaleX:0.8218,scaleY:0.8218}},{t:this.instance_8,p:{x:371.85}},{t:this.instance_7,p:{x:345.35}},{t:this.instance_6,p:{x:307.35}},{t:this.instance_5,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393}},{t:this.instance_4,p:{x:319.1}},{t:this.instance_3,p:{x:328.65}},{t:this.instance_2,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_1,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219}},{t:this.instance,p:{regX:233.2,rotation:-14.9864,x:325.75,y:263.6,regY:131.9,scaleX:0.0825,scaleY:0.1752,skewX:0,skewY:0,startPosition:0}}]},1).to({state:[{t:this.instance_13,p:{x:326.35}},{t:this.instance_12,p:{startPosition:20,rotation:0,x:329.3,y:225.6,regX:180.3}},{t:this.instance_11,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_16,p:{regX:103.7,regY:188.6,rotation:20.2107,x:398.3,y:438.9,scaleX:0.1398,scaleY:0.1398}},{t:this.instance_9,p:{regY:44.1,skewX:-37.7669,skewY:142.2331,x:379.25,y:405.4,regX:21.8,scaleX:0.8218,scaleY:0.8218}},{t:this.instance_8,p:{x:371.85}},{t:this.instance_7,p:{x:345.35}},{t:this.instance_6,p:{x:307.35}},{t:this.instance_5,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393}},{t:this.instance_4,p:{x:319.1}},{t:this.instance_3,p:{x:328.65}},{t:this.instance_2,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_1,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219}},{t:this.instance,p:{regX:233.2,rotation:-14.9864,x:325.75,y:263.6,regY:131.9,scaleX:0.0825,scaleY:0.1752,skewX:0,skewY:0,startPosition:0}}]},1).to({state:[{t:this.instance_13,p:{x:326.35}},{t:this.instance_12,p:{startPosition:21,rotation:0,x:329.3,y:225.6,regX:180.3}},{t:this.instance_11,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_16,p:{regX:104,regY:189,rotation:15.5134,x:403,y:435.7,scaleX:0.1398,scaleY:0.1398}},{t:this.instance_9,p:{regY:44.2,skewX:-42.4626,skewY:137.5374,x:381.25,y:403.9,regX:21.8,scaleX:0.8218,scaleY:0.8218}},{t:this.instance_8,p:{x:371.85}},{t:this.instance_7,p:{x:345.35}},{t:this.instance_6,p:{x:307.35}},{t:this.instance_5,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393}},{t:this.instance_4,p:{x:319.1}},{t:this.instance_3,p:{x:328.65}},{t:this.instance_2,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_1,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219}},{t:this.instance,p:{regX:233.2,rotation:-14.9864,x:325.75,y:263.6,regY:131.9,scaleX:0.0825,scaleY:0.1752,skewX:0,skewY:0,startPosition:0}}]},1).to({state:[{t:this.instance_13,p:{x:326.35}},{t:this.instance_12,p:{startPosition:22,rotation:0,x:329.3,y:225.6,regX:180.3}},{t:this.instance_11,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_15,p:{regX:104,regY:189.3,scaleX:0.1398,scaleY:0.1398,rotation:-14.4851,x:423.9,y:407.65}},{t:this.instance_9,p:{regY:44.2,skewX:-72.4623,skewY:107.5377,x:389.15,y:390.95,regX:21.8,scaleX:0.8218,scaleY:0.8218}},{t:this.instance_8,p:{x:371.85}},{t:this.instance_7,p:{x:345.35}},{t:this.instance_6,p:{x:307.35}},{t:this.instance_5,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393}},{t:this.instance_4,p:{x:319.1}},{t:this.instance_3,p:{x:328.65}},{t:this.instance_2,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_1,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219}},{t:this.instance,p:{regX:233.2,rotation:-14.9864,x:325.75,y:263.6,regY:131.9,scaleX:0.0825,scaleY:0.1752,skewX:0,skewY:0,startPosition:0}}]},1).to({state:[{t:this.instance_13,p:{x:326.35}},{t:this.instance_12,p:{startPosition:23,rotation:0,x:329.3,y:225.6,regX:180.3}},{t:this.instance_11,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_14,p:{regX:104.4,regY:189.6,scaleX:0.1398,scaleY:0.1398,rotation:-19.9222,x:426.25,y:401.5}},{t:this.instance_9,p:{regY:44.2,skewX:-77.9003,skewY:102.0997,x:390,y:388.1,regX:21.8,scaleX:0.8218,scaleY:0.8218}},{t:this.instance_8,p:{x:371.85}},{t:this.instance_7,p:{x:345.35}},{t:this.instance_6,p:{x:307.35}},{t:this.instance_5,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393}},{t:this.instance_4,p:{x:319.1}},{t:this.instance_3,p:{x:328.65}},{t:this.instance_2,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_1,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219}},{t:this.instance,p:{regX:233.2,rotation:-14.9864,x:325.75,y:263.6,regY:131.9,scaleX:0.0825,scaleY:0.1752,skewX:0,skewY:0,startPosition:0}}]},1).to({state:[{t:this.instance_13,p:{x:326.35}},{t:this.instance_12,p:{startPosition:32,rotation:-2.7403,x:325.25,y:225.55,regX:180.3}},{t:this.instance_11,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_14,p:{regX:104.4,regY:189.6,scaleX:0.1398,scaleY:0.1398,rotation:-19.9222,x:426.25,y:401.5}},{t:this.instance_9,p:{regY:44.2,skewX:-77.9003,skewY:102.0997,x:390,y:388.1,regX:21.8,scaleX:0.8218,scaleY:0.8218}},{t:this.instance_8,p:{x:371.85}},{t:this.instance_7,p:{x:345.35}},{t:this.instance_6,p:{x:307.35}},{t:this.instance_5,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393}},{t:this.instance_4,p:{x:319.1}},{t:this.instance_3,p:{x:328.65}},{t:this.instance_2,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_1,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219}},{t:this.instance,p:{regX:233.8,rotation:-17.7232,x:323.6,y:263.7,regY:131.9,scaleX:0.0825,scaleY:0.1752,skewX:0,skewY:0,startPosition:0}}]},9).to({state:[{t:this.instance_13,p:{x:326.35}},{t:this.instance_12,p:{startPosition:32,rotation:-9.2896,x:315.65,y:226.25,regX:180.5}},{t:this.instance_11,p:{regX:26.3,regY:55.3,rotation:0,x:357.55,y:356.9,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_14,p:{regX:104.4,regY:189.6,scaleX:0.1398,scaleY:0.1398,rotation:-19.9222,x:426.25,y:401.5}},{t:this.instance_9,p:{regY:44.2,skewX:-77.9003,skewY:102.0997,x:390,y:388.1,regX:21.8,scaleX:0.8218,scaleY:0.8218}},{t:this.instance_8,p:{x:371.85}},{t:this.instance_7,p:{x:345.35}},{t:this.instance_6,p:{x:307.35}},{t:this.instance_5,p:{regX:102.3,regY:187,scaleY:0.1393,skewX:0,skewY:0,x:286.1,y:455.35,scaleX:0.1393}},{t:this.instance_4,p:{x:319.1}},{t:this.instance_3,p:{x:328.65}},{t:this.instance_2,p:{regX:15.6,regY:26.5,scaleY:0.8219,rotation:0,skewY:180,x:296.7,y:336.35,scaleX:0.8219,skewX:0}},{t:this.instance_1,p:{regY:12.8,scaleY:0.8219,skewX:0,skewY:0,x:287.6,y:388.75,scaleX:0.8219}},{t:this.instance,p:{regX:233.6,rotation:0,x:317.25,y:272.25,regY:132.8,scaleX:0.0817,scaleY:0.1125,skewX:-24.2774,skewY:155.7332,startPosition:4}}]},1).to({state:[{t:this.instance_13,p:{x:326.35}},{t:this.instance_11,p:{regX:26.2,regY:55.2,rotation:-135,x:358.8,y:326,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_14,p:{regX:103.8,regY:189.5,scaleX:0.1398,scaleY:0.1398,rotation:-139.9238,x:361.8,y:241.95}},{t:this.instance_9,p:{regY:44.2,skewX:162.0983,skewY:-17.9017,x:368.35,y:280,regX:21.8,scaleX:0.8218,scaleY:0.8218}},{t:this.instance_12,p:{startPosition:38,rotation:-9.2896,x:315.65,y:226.25,regX:180.5}},{t:this.instance_8,p:{x:371.85}},{t:this.instance_7,p:{x:345.35}},{t:this.instance_6,p:{x:307.35}},{t:this.instance_5,p:{regX:102.4,regY:185.2,scaleY:0.114,skewX:-171.2527,skewY:8.7586,x:270.85,y:253.15,scaleX:0.1393}},{t:this.instance_4,p:{x:319.1}},{t:this.instance_3,p:{x:328.65}},{t:this.instance_2,p:{regX:15.5,regY:26.4,scaleY:0.6726,rotation:143.7543,skewY:0,x:296.75,y:336.45,scaleX:0.8219,skewX:0}},{t:this.instance_1,p:{regY:12.5,scaleY:0.6726,skewX:-171.2469,skewY:8.7523,x:264.05,y:307.3,scaleX:0.8219}},{t:this.instance,p:{regX:233.6,rotation:0,x:317.25,y:272.25,regY:132.8,scaleX:0.0817,scaleY:0.1125,skewX:-24.2774,skewY:155.7332,startPosition:4}}]},8).to({state:[{t:this.instance_13,p:{x:486.35}},{t:this.instance_11,p:{regX:26.2,regY:55.2,rotation:-135,x:518.8,y:326,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_14,p:{regX:103.8,regY:189.5,scaleX:0.1398,scaleY:0.1398,rotation:-139.9238,x:521.8,y:241.95}},{t:this.instance_9,p:{regY:44.2,skewX:162.0983,skewY:-17.9017,x:528.35,y:280,regX:21.8,scaleX:0.8218,scaleY:0.8218}},{t:this.instance_17},{t:this.instance_8,p:{x:531.85}},{t:this.instance_7,p:{x:505.35}},{t:this.instance_6,p:{x:467.35}},{t:this.instance_5,p:{regX:102.4,regY:185.2,scaleY:0.114,skewX:-171.2527,skewY:8.7586,x:430.85,y:253.15,scaleX:0.1393}},{t:this.instance_4,p:{x:479.1}},{t:this.instance_3,p:{x:488.65}},{t:this.instance_2,p:{regX:15.5,regY:26.4,scaleY:0.6726,rotation:143.7543,skewY:0,x:456.75,y:336.45,scaleX:0.8219,skewX:0}},{t:this.instance_1,p:{regY:12.5,scaleY:0.6726,skewX:-171.2469,skewY:8.7523,x:424.05,y:307.3,scaleX:0.8219}},{t:this.instance,p:{regX:233.6,rotation:0,x:477.25,y:272.25,regY:132.8,scaleX:0.0817,scaleY:0.1125,skewX:-24.2774,skewY:155.7332,startPosition:4}}]},26).to({state:[{t:this.instance_13,p:{x:486.35}},{t:this.instance_11,p:{regX:26.2,regY:55.2,rotation:-135,x:518.8,y:326,scaleX:0.8219,scaleY:0.8219}},{t:this.instance_14,p:{regX:103.8,regY:189.5,scaleX:0.1398,scaleY:0.1398,rotation:-139.9238,x:521.8,y:241.95}},{t:this.instance_9,p:{regY:44.2,skewX:162.0983,skewY:-17.9017,x:528.35,y:280,regX:21.8,scaleX:0.8218,scaleY:0.8218}},{t:this.instance_12,p:{startPosition:20,rotation:-9.2896,x:475.65,y:226.25,regX:180.5}},{t:this.instance_8,p:{x:531.85}},{t:this.instance_7,p:{x:505.35}},{t:this.instance_6,p:{x:467.35}},{t:this.instance_5,p:{regX:102.4,regY:185.2,scaleY:0.114,skewX:-171.2527,skewY:8.7586,x:430.85,y:253.15,scaleX:0.1393}},{t:this.instance_4,p:{x:479.1}},{t:this.instance_3,p:{x:488.65}},{t:this.instance_2,p:{regX:15.5,regY:26.4,scaleY:0.6726,rotation:143.7543,skewY:0,x:456.75,y:336.45,scaleX:0.8219,skewX:0}},{t:this.instance_1,p:{regY:12.5,scaleY:0.6726,skewX:-171.2469,skewY:8.7523,x:424.05,y:307.3,scaleX:0.8219}},{t:this.instance,p:{regX:233.6,rotation:0,x:477.25,y:272.25,regY:132.8,scaleX:0.0817,scaleY:0.1125,skewX:-24.2774,skewY:155.7332,startPosition:4}}]},100).to({state:[{t:this.instance_13,p:{x:486.35}},{t:this.instance_11,p:{regX:27.9,regY:30.6,rotation:-21.4548,x:518.15,y:334.5,scaleX:0.8217,scaleY:0.8217}},{t:this.instance_14,p:{regX:104.7,regY:191.3,scaleX:0.1397,scaleY:0.1397,rotation:-19.9093,x:595,y:394.65}},{t:this.instance_9,p:{regY:44.5,skewX:-77.9039,skewY:102.0961,x:558.85,y:381.25,regX:21.9,scaleX:0.8216,scaleY:0.8216}},{t:this.instance_12,p:{startPosition:22,rotation:-9.2896,x:475.65,y:226.25,regX:180.5}},{t:this.instance_8,p:{x:531.85}},{t:this.instance_7,p:{x:505.35}},{t:this.instance_6,p:{x:467.35}},{t:this.instance_5,p:{regX:102.8,regY:185.8,scaleY:0.1201,skewX:-8.2731,skewY:-9.2262,x:430.95,y:426.75,scaleX:0.1394}},{t:this.instance_4,p:{x:479.1}},{t:this.instance_3,p:{x:488.65}},{t:this.instance_2,p:{regX:15.3,regY:26.5,scaleY:0.6971,rotation:0,skewY:-142.2625,x:456.85,y:338.9,scaleX:0.8381,skewX:34.7775}},{t:this.instance_1,p:{regY:12.6,scaleY:0.7091,skewX:-8.2957,skewY:-9.2297,x:424.1,y:369.65,scaleX:0.8228}},{t:this.instance,p:{regX:233.6,rotation:0,x:477.25,y:272.25,regY:132.8,scaleX:0.0817,scaleY:0.1125,skewX:-24.2774,skewY:155.7332,startPosition:9}}]},2).to({state:[{t:this.instance_13,p:{x:486.35}},{t:this.instance_18},{t:this.instance_12,p:{startPosition:25,rotation:-9.2896,x:475.65,y:226.25,regX:180.5}},{t:this.instance_8,p:{x:531.85}},{t:this.instance_7,p:{x:505.35}},{t:this.instance_6,p:{x:467.35}},{t:this.instance_5,p:{regX:102.8,regY:185.8,scaleY:0.1201,skewX:-8.2731,skewY:-9.2262,x:430.95,y:426.75,scaleX:0.1394}},{t:this.instance_4,p:{x:479.1}},{t:this.instance_3,p:{x:488.65}},{t:this.instance_11,p:{regX:28.1,regY:32.2,rotation:-38.4418,x:521.2,y:332.5,scaleX:0.8211,scaleY:0.8211}},{t:this.instance_9,p:{regY:44.8,skewX:-94.8893,skewY:85.1107,x:574.7,y:365.25,regX:22.3,scaleX:0.8214,scaleY:0.7845}},{t:this.instance_2,p:{regX:15.3,regY:26.5,scaleY:0.6971,rotation:0,skewY:-142.2625,x:456.85,y:338.9,scaleX:0.8381,skewX:34.7775}},{t:this.instance_1,p:{regY:12.6,scaleY:0.7091,skewX:-8.2957,skewY:-9.2297,x:424.1,y:369.65,scaleX:0.8228}},{t:this.instance,p:{regX:235.2,rotation:-20.7254,x:475.9,y:269.5,regY:134.5,scaleX:0.0816,scaleY:0.1124,skewX:0,skewY:0,startPosition:3}}]},10).wait(59));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Character1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Character1
	this.instance = new lib.mouth("single",0);
	this.instance.setTransform(866.55,274.65,0.1144,0.1486,0,14.9837,-165.011,230.9,129.8);

	this.instance_1 = new lib.down_arm("synched",0);
	this.instance_1.setTransform(947.8,393.25,0.7437,0.7437,0,0,0,19.1,11.8);

	this.instance_2 = new lib.hand1("synched",0);
	this.instance_2.setTransform(950.85,440.5,0.1302,0.1302,0,0,180,102.1,81);

	this.instance_3 = new lib.up_arm("synched",0);
	this.instance_3.setTransform(940.7,342.65,0.7734,0.7734,0,0,0,20.9,27.1);

	this.instance_4 = new lib.foot("synched",0);
	this.instance_4.setTransform(869.85,547.1,1,1,0,0,0,22.8,5.8);

	this.instance_5 = new lib.foot("synched",0);
	this.instance_5.setTransform(918.85,548.1,1,1,0,0,0,22.8,5.8);

	this.instance_6 = new lib.body("synched",0);
	this.instance_6.setTransform(900,445.9,0.8109,0.8109,0,0,0,39.6,149.9);

	this.instance_7 = new lib.up_leg("synched",0);
	this.instance_7.setTransform(920,452.35,0.8951,0.8951,0,0,0,34.5,7);

	this.instance_8 = new lib.down_leg("synched",0);
	this.instance_8.setTransform(918.85,507.85,1,1,0,0,0,13.6,-2.1);

	this.instance_9 = new lib.up_leg("synched",0);
	this.instance_9.setTransform(874.4,448,0.8951,0.8951,0,0,180,34,5);

	this.instance_10 = new lib.down_arm("synched",0);
	this.instance_10.setTransform(866.7,383.85,0.7437,0.7437,0,23.2505,-156.7495,21.6,6.2);

	this.instance_11 = new lib.hand8("synched",0);
	this.instance_11.setTransform(845.65,446.85,0.1302,0.1302,0,0,180,102.1,186.6);

	this.instance_12 = new lib.up_arm("synched",0);
	this.instance_12.setTransform(876.25,338.6,0.7734,0.7734,0,6.7812,-173.2188,26.1,27.9);

	this.instance_13 = new lib.down_leg("synched",0);
	this.instance_13.setTransform(875.1,505.8,1,1,0,0,180,13.6,-0.1);

	this.instance_14 = new lib.head1("synched",0);
	this.instance_14.setTransform(909.85,300.8,0.4302,0.4302,0,0,0,235.8,393.2);

	this.instance_15 = new lib.neck("synched",0);
	this.instance_15.setTransform(906.5,322.2,0.7086,0.7086,0,0,0,17.9,38.6);

	this.instance_16 = new lib.hand9("synched",0);
	this.instance_16.setTransform(801.5,390.25,0.1302,0.1302,0,42.1454,-137.8546,101.8,186.8);

	this.instance_17 = new lib.hand10("synched",0);
	this.instance_17.setTransform(801.5,390.25,0.1302,0.1302,0,42.1454,-137.8546,101.8,186.8);

	this.instance_18 = new lib.CachedBmp_1();
	this.instance_18.setTransform(914.55,206.6,0.5,0.5);

	this.instance_19 = new lib.hand5("synched",0);
	this.instance_19.setTransform(805,390.2,0.1302,0.1302,-72.1469,0,0,101.7,186.7);

	this.instance_20 = new lib.eye2("synched",0);
	this.instance_20.setTransform(493.3,231.7,0.3677,0.3677,-0.019,0,0,31.6,30.4);

	this.instance_21 = new lib.eye2("synched",0);
	this.instance_21.setTransform(457.5,234,0.3679,0.3679,0,-14.9833,165.0167,31,29.6);

	this.instance_22 = new lib.eye2("synched",0);
	this.instance_22.setTransform(752.6,237.2,0.3677,0.3677,29.9785,0,0,35,29);

	this.instance_23 = new lib.eye2("synched",0);
	this.instance_23.setTransform(718.05,231.25,0.3679,0.3679,0,-14.9867,165.0133,31.2,29.2);

	this.instance_24 = new lib.head11("synched",0);
	this.instance_24.setTransform(749.9,300.85,0.4302,0.4302,14.9969,0,0,235.9,393.3);

	this.instance_25 = new lib.eyebrows("synched",0);
	this.instance_25.setTransform(705.35,223.8,0.3372,0.3372,0,28.7282,-151.2718,16.6,17.2);

	this.instance_26 = new lib.eyebrows("synched",0);
	this.instance_26.setTransform(745.65,228.55,0.3372,0.3372,1.2731,0,0,17.8,16.9);

	this.instance_27 = new lib.eye2_stati("synched",0);
	this.instance_27.setTransform(712.2,235.9,0.3675,0.3675,19.2611,0,0,36.5,29.8);

	this.instance_28 = new lib.eye2_stati("synched",0);
	this.instance_28.setTransform(740.7,238.15,0.3675,0.3675,19.2669,0,0,35.8,29.4);

	this.instance_29 = new lib.hand4("synched",0);
	this.instance_29.setTransform(687.75,280.5,0.212,0.1702,0,7.9972,10.2801,95.9,8.2);

	this.instance_30 = new lib.hand3("synched",0);
	this.instance_30.setTransform(596.95,314.9,0.1919,0.1854,0,-70.9999,-72.9455,95.9,320.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_15,p:{x:906.5}},{t:this.instance_14,p:{startPosition:0,regX:235.8,regY:393.2,rotation:0,x:909.85,y:300.8,scaleX:0.4302,scaleY:0.4302}},{t:this.instance_13,p:{x:875.1}},{t:this.instance_12,p:{regY:27.9,skewX:6.7812,skewY:-173.2188,x:876.25,y:338.6,regX:26.1,scaleX:0.7734,scaleY:0.7734}},{t:this.instance_11,p:{regX:102.1,regY:186.6,skewX:0,skewY:180,x:845.65,y:446.85}},{t:this.instance_10,p:{skewX:23.2505,skewY:-156.7495,regY:6.2,scaleX:0.7437,scaleY:0.7437,x:866.7,y:383.85,regX:21.6}},{t:this.instance_9,p:{x:874.4}},{t:this.instance_8,p:{x:918.85}},{t:this.instance_7,p:{x:920}},{t:this.instance_6,p:{x:900}},{t:this.instance_5,p:{x:918.85}},{t:this.instance_4,p:{x:869.85}},{t:this.instance_3,p:{regX:20.9,regY:27.1,scaleY:0.7734,skewX:0,skewY:0,x:940.7,y:342.65,scaleX:0.7734}},{t:this.instance_2,p:{regX:102.1,regY:81,scaleY:0.1302,rotation:0,skewY:180,x:950.85,y:440.5,scaleX:0.1302,skewX:0}},{t:this.instance_1,p:{regX:19.1,regY:11.8,scaleY:0.7437,skewX:0,skewY:0,x:947.8,y:393.25,scaleX:0.7437}},{t:this.instance,p:{startPosition:0,regX:230.9,regY:129.8,skewX:14.9837,skewY:-165.011,x:866.55,y:274.65,scaleX:0.1144,scaleY:0.1486}}]}).to({state:[{t:this.instance_15,p:{x:906.5}},{t:this.instance_14,p:{startPosition:2,regX:235.8,regY:393.2,rotation:0,x:909.85,y:300.8,scaleX:0.4302,scaleY:0.4302}},{t:this.instance_13,p:{x:875.1}},{t:this.instance_12,p:{regY:27.9,skewX:6.7812,skewY:-173.2188,x:876.25,y:338.6,regX:26.1,scaleX:0.7734,scaleY:0.7734}},{t:this.instance_11,p:{regX:102.5,regY:186.5,skewX:-9.747,skewY:170.253,x:835.3,y:442.4}},{t:this.instance_10,p:{skewX:32.9975,skewY:-147.0025,regY:6.2,scaleX:0.7437,scaleY:0.7437,x:866.7,y:383.85,regX:21.6}},{t:this.instance_9,p:{x:874.4}},{t:this.instance_8,p:{x:918.85}},{t:this.instance_7,p:{x:920}},{t:this.instance_6,p:{x:900}},{t:this.instance_5,p:{x:918.85}},{t:this.instance_4,p:{x:869.85}},{t:this.instance_3,p:{regX:20.9,regY:27.1,scaleY:0.7734,skewX:0,skewY:0,x:940.7,y:342.65,scaleX:0.7734}},{t:this.instance_2,p:{regX:102.1,regY:81,scaleY:0.1302,rotation:0,skewY:180,x:950.85,y:440.5,scaleX:0.1302,skewX:0}},{t:this.instance_1,p:{regX:19.1,regY:11.8,scaleY:0.7437,skewX:0,skewY:0,x:947.8,y:393.25,scaleX:0.7437}},{t:this.instance,p:{startPosition:0,regX:230.9,regY:129.8,skewX:14.9837,skewY:-165.011,x:866.55,y:274.65,scaleX:0.1144,scaleY:0.1486}}]},2).to({state:[{t:this.instance_15,p:{x:906.5}},{t:this.instance_14,p:{startPosition:3,regX:235.8,regY:393.2,rotation:0,x:909.85,y:300.8,scaleX:0.4302,scaleY:0.4302}},{t:this.instance_13,p:{x:875.1}},{t:this.instance_12,p:{regY:27.9,skewX:6.7812,skewY:-173.2188,x:876.25,y:338.6,regX:26.1,scaleX:0.7734,scaleY:0.7734}},{t:this.instance_11,p:{regX:102.5,regY:186.7,skewX:11.9972,skewY:-168.0028,x:816.35,y:426.15}},{t:this.instance_10,p:{skewX:54.7407,skewY:-125.2593,regY:6.1,scaleX:0.7436,scaleY:0.7436,x:867.25,y:383.3,regX:21.6}},{t:this.instance_9,p:{x:874.4}},{t:this.instance_8,p:{x:918.85}},{t:this.instance_7,p:{x:920}},{t:this.instance_6,p:{x:900}},{t:this.instance_5,p:{x:918.85}},{t:this.instance_4,p:{x:869.85}},{t:this.instance_3,p:{regX:20.9,regY:27.1,scaleY:0.7734,skewX:0,skewY:0,x:940.7,y:342.65,scaleX:0.7734}},{t:this.instance_2,p:{regX:102.1,regY:81,scaleY:0.1302,rotation:0,skewY:180,x:950.85,y:440.5,scaleX:0.1302,skewX:0}},{t:this.instance_1,p:{regX:19.1,regY:11.8,scaleY:0.7437,skewX:0,skewY:0,x:947.8,y:393.25,scaleX:0.7437}},{t:this.instance,p:{startPosition:0,regX:230.9,regY:129.8,skewX:14.9837,skewY:-165.011,x:866.55,y:274.65,scaleX:0.1144,scaleY:0.1486}}]},1).to({state:[{t:this.instance_15,p:{x:906.5}},{t:this.instance_14,p:{startPosition:4,regX:235.8,regY:393.2,rotation:0,x:909.85,y:300.8,scaleX:0.4302,scaleY:0.4302}},{t:this.instance_13,p:{x:875.1}},{t:this.instance_12,p:{regY:27.9,skewX:6.7812,skewY:-173.2188,x:876.25,y:338.6,regX:26.1,scaleX:0.7734,scaleY:0.7734}},{t:this.instance_16},{t:this.instance_10,p:{skewX:84.8919,skewY:-95.1081,regY:6,scaleX:0.7436,scaleY:0.7436,x:869,y:380.85,regX:21.4}},{t:this.instance_9,p:{x:874.4}},{t:this.instance_8,p:{x:918.85}},{t:this.instance_7,p:{x:920}},{t:this.instance_6,p:{x:900}},{t:this.instance_5,p:{x:918.85}},{t:this.instance_4,p:{x:869.85}},{t:this.instance_3,p:{regX:20.9,regY:27.1,scaleY:0.7734,skewX:0,skewY:0,x:940.7,y:342.65,scaleX:0.7734}},{t:this.instance_2,p:{regX:102.1,regY:81,scaleY:0.1302,rotation:0,skewY:180,x:950.85,y:440.5,scaleX:0.1302,skewX:0}},{t:this.instance_1,p:{regX:19.1,regY:11.8,scaleY:0.7437,skewX:0,skewY:0,x:947.8,y:393.25,scaleX:0.7437}},{t:this.instance,p:{startPosition:0,regX:230.9,regY:129.8,skewX:14.9837,skewY:-165.011,x:866.55,y:274.65,scaleX:0.1144,scaleY:0.1486}}]},1).to({state:[{t:this.instance_15,p:{x:906.5}},{t:this.instance_14,p:{startPosition:5,regX:235.8,regY:393.2,rotation:0,x:909.85,y:300.8,scaleX:0.4302,scaleY:0.4302}},{t:this.instance_13,p:{x:875.1}},{t:this.instance_12,p:{regY:27.9,skewX:6.7812,skewY:-173.2188,x:876.25,y:338.6,regX:26.1,scaleX:0.7734,scaleY:0.7734}},{t:this.instance_17},{t:this.instance_10,p:{skewX:84.8919,skewY:-95.1081,regY:6,scaleX:0.7436,scaleY:0.7436,x:869,y:380.85,regX:21.4}},{t:this.instance_9,p:{x:874.4}},{t:this.instance_8,p:{x:918.85}},{t:this.instance_7,p:{x:920}},{t:this.instance_6,p:{x:900}},{t:this.instance_5,p:{x:918.85}},{t:this.instance_4,p:{x:869.85}},{t:this.instance_3,p:{regX:20.9,regY:27.1,scaleY:0.7734,skewX:0,skewY:0,x:940.7,y:342.65,scaleX:0.7734}},{t:this.instance_2,p:{regX:102.1,regY:81,scaleY:0.1302,rotation:0,skewY:180,x:950.85,y:440.5,scaleX:0.1302,skewX:0}},{t:this.instance_1,p:{regX:19.1,regY:11.8,scaleY:0.7437,skewX:0,skewY:0,x:947.8,y:393.25,scaleX:0.7437}},{t:this.instance,p:{startPosition:0,regX:230.9,regY:129.8,skewX:14.9837,skewY:-165.011,x:866.55,y:274.65,scaleX:0.1144,scaleY:0.1486}}]},1).to({state:[{t:this.instance_15,p:{x:906.5}},{t:this.instance_14,p:{startPosition:9,regX:235.8,regY:393.2,rotation:0,x:909.85,y:300.8,scaleX:0.4302,scaleY:0.4302}},{t:this.instance_13,p:{x:875.1}},{t:this.instance_12,p:{regY:27.9,skewX:6.7812,skewY:-173.2188,x:876.25,y:338.6,regX:26.1,scaleX:0.7734,scaleY:0.7734}},{t:this.instance_17},{t:this.instance_10,p:{skewX:84.8919,skewY:-95.1081,regY:6,scaleX:0.7436,scaleY:0.7436,x:869,y:380.85,regX:21.4}},{t:this.instance_9,p:{x:874.4}},{t:this.instance_8,p:{x:918.85}},{t:this.instance_7,p:{x:920}},{t:this.instance_6,p:{x:900}},{t:this.instance_5,p:{x:918.85}},{t:this.instance_4,p:{x:869.85}},{t:this.instance_3,p:{regX:20.9,regY:27.1,scaleY:0.7734,skewX:0,skewY:0,x:940.7,y:342.65,scaleX:0.7734}},{t:this.instance_2,p:{regX:102.1,regY:81,scaleY:0.1302,rotation:0,skewY:180,x:950.85,y:440.5,scaleX:0.1302,skewX:0}},{t:this.instance_1,p:{regX:19.1,regY:11.8,scaleY:0.7437,skewX:0,skewY:0,x:947.8,y:393.25,scaleX:0.7437}},{t:this.instance,p:{startPosition:1,regX:230.9,regY:129.8,skewX:14.9837,skewY:-165.011,x:866.55,y:274.65,scaleX:0.1144,scaleY:0.1486}}]},4).to({state:[{t:this.instance_15,p:{x:906.5}},{t:this.instance_14,p:{startPosition:33,regX:235.9,regY:393.3,rotation:2.9681,x:909.9,y:300.9,scaleX:0.4302,scaleY:0.4302}},{t:this.instance_13,p:{x:875.1}},{t:this.instance_12,p:{regY:27.9,skewX:6.7812,skewY:-173.2188,x:876.25,y:338.6,regX:26.1,scaleX:0.7734,scaleY:0.7734}},{t:this.instance_17},{t:this.instance_10,p:{skewX:84.8919,skewY:-95.1081,regY:6,scaleX:0.7436,scaleY:0.7436,x:869,y:380.85,regX:21.4}},{t:this.instance_9,p:{x:874.4}},{t:this.instance_8,p:{x:918.85}},{t:this.instance_7,p:{x:920}},{t:this.instance_6,p:{x:900}},{t:this.instance_5,p:{x:918.85}},{t:this.instance_4,p:{x:869.85}},{t:this.instance_3,p:{regX:20.9,regY:27.1,scaleY:0.7734,skewX:0,skewY:0,x:940.7,y:342.65,scaleX:0.7734}},{t:this.instance_2,p:{regX:102.1,regY:81,scaleY:0.1302,rotation:0,skewY:180,x:950.85,y:440.5,scaleX:0.1302,skewX:0}},{t:this.instance_1,p:{regX:19.1,regY:11.8,scaleY:0.7437,skewX:0,skewY:0,x:947.8,y:393.25,scaleX:0.7437}},{t:this.instance,p:{startPosition:1,regX:230.7,regY:130.1,skewX:17.9493,skewY:-162.0436,x:868,y:272.5,scaleX:0.1144,scaleY:0.1486}}]},24).to({state:[{t:this.instance_18},{t:this.instance_15,p:{x:906.5}},{t:this.instance_14,p:{startPosition:33,regX:235.9,regY:393.2,rotation:14.9969,x:909.95,y:300.8,scaleX:0.4302,scaleY:0.4302}},{t:this.instance_13,p:{x:875.1}},{t:this.instance_12,p:{regY:27.9,skewX:6.7812,skewY:-173.2188,x:876.25,y:338.6,regX:26.1,scaleX:0.7734,scaleY:0.7734}},{t:this.instance_17},{t:this.instance_10,p:{skewX:84.8919,skewY:-95.1081,regY:6,scaleX:0.7436,scaleY:0.7436,x:869,y:380.85,regX:21.4}},{t:this.instance_9,p:{x:874.4}},{t:this.instance_8,p:{x:918.85}},{t:this.instance_7,p:{x:920}},{t:this.instance_6,p:{x:900}},{t:this.instance_5,p:{x:918.85}},{t:this.instance_4,p:{x:869.85}},{t:this.instance_3,p:{regX:20.9,regY:27.1,scaleY:0.7734,skewX:0,skewY:0,x:940.7,y:342.65,scaleX:0.7734}},{t:this.instance_2,p:{regX:102.1,regY:81,scaleY:0.1302,rotation:0,skewY:180,x:950.85,y:440.5,scaleX:0.1302,skewX:0}},{t:this.instance_1,p:{regX:19.1,regY:11.8,scaleY:0.7437,skewX:0,skewY:0,x:947.8,y:393.25,scaleX:0.7437}},{t:this.instance,p:{startPosition:4,regX:231.2,regY:129.9,skewX:29.985,skewY:-150.0115,x:874.8,y:264.35,scaleX:0.1144,scaleY:0.1486}}]},1).to({state:[{t:this.instance_15,p:{x:906.5}},{t:this.instance_14,p:{startPosition:36,regX:235.9,regY:393.2,rotation:14.9969,x:909.95,y:300.8,scaleX:0.4302,scaleY:0.4302}},{t:this.instance_13,p:{x:875.1}},{t:this.instance_12,p:{regY:27.9,skewX:6.7812,skewY:-173.2188,x:876.25,y:338.6,regX:26.1,scaleX:0.7734,scaleY:0.7734}},{t:this.instance_19,p:{regX:101.7,rotation:-72.1469,x:805,y:390.2,regY:186.7,scaleX:0.1302,scaleY:0.1302,skewX:0,skewY:0}},{t:this.instance_10,p:{skewX:84.8919,skewY:-95.1081,regY:6,scaleX:0.7436,scaleY:0.7436,x:869,y:380.85,regX:21.4}},{t:this.instance_9,p:{x:874.4}},{t:this.instance_8,p:{x:918.85}},{t:this.instance_7,p:{x:920}},{t:this.instance_6,p:{x:900}},{t:this.instance_5,p:{x:918.85}},{t:this.instance_4,p:{x:869.85}},{t:this.instance_3,p:{regX:20.9,regY:27.1,scaleY:0.7734,skewX:0,skewY:0,x:940.7,y:342.65,scaleX:0.7734}},{t:this.instance_2,p:{regX:102.1,regY:81,scaleY:0.1302,rotation:0,skewY:180,x:950.85,y:440.5,scaleX:0.1302,skewX:0}},{t:this.instance_1,p:{regX:19.1,regY:11.8,scaleY:0.7437,skewX:0,skewY:0,x:947.8,y:393.25,scaleX:0.7437}},{t:this.instance,p:{startPosition:4,regX:231.2,regY:129.9,skewX:29.985,skewY:-150.0115,x:874.8,y:264.35,scaleX:0.1144,scaleY:0.1486}}]},2).to({state:[{t:this.instance_12,p:{regY:27.8,skewX:117.7547,skewY:-62.2453,x:887.85,y:342.95,regX:26.1,scaleX:0.7734,scaleY:0.7734}},{t:this.instance_19,p:{regX:101.9,rotation:38.8192,x:865.15,y:257.85,regY:186.7,scaleX:0.1302,scaleY:0.1302,skewX:0,skewY:0}},{t:this.instance_10,p:{skewX:-164.1336,skewY:15.8664,regY:6,scaleX:0.7436,scaleY:0.7436,x:851.1,y:321,regX:21.7}},{t:this.instance_15,p:{x:906.5}},{t:this.instance_14,p:{startPosition:39,regX:235.9,regY:393.2,rotation:14.9969,x:909.95,y:300.8,scaleX:0.4302,scaleY:0.4302}},{t:this.instance_13,p:{x:875.1}},{t:this.instance_9,p:{x:874.4}},{t:this.instance_8,p:{x:918.85}},{t:this.instance_7,p:{x:920}},{t:this.instance_6,p:{x:900}},{t:this.instance_5,p:{x:918.85}},{t:this.instance_4,p:{x:869.85}},{t:this.instance_3,p:{regX:21,regY:27,scaleY:0.669,skewX:-165.0015,skewY:14.9991,x:937.7,y:342.3,scaleX:0.7734}},{t:this.instance_2,p:{regX:101.9,regY:80.2,scaleY:0.1126,rotation:165.0036,skewY:0,x:948.25,y:261.55,scaleX:0.1302,skewX:0}},{t:this.instance_1,p:{regX:19.2,regY:11.7,scaleY:0.6433,skewX:165.0019,skewY:-14.9986,x:955.85,y:301.8,scaleX:0.7437}},{t:this.instance,p:{startPosition:4,regX:231.2,regY:129.9,skewX:29.985,skewY:-150.0115,x:874.8,y:264.35,scaleX:0.1144,scaleY:0.1486}}]},3).to({state:[{t:this.instance_12,p:{regY:27.8,skewX:117.7547,skewY:-62.2453,x:727.85,y:342.95,regX:26.1,scaleX:0.7734,scaleY:0.7734}},{t:this.instance_19,p:{regX:101.9,rotation:38.8192,x:705.15,y:257.85,regY:186.7,scaleX:0.1302,scaleY:0.1302,skewX:0,skewY:0}},{t:this.instance_10,p:{skewX:-164.1336,skewY:15.8664,regY:6,scaleX:0.7436,scaleY:0.7436,x:691.1,y:321,regX:21.7}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_24,p:{regX:235.9,regY:393.3,scaleX:0.4302,scaleY:0.4302,rotation:14.9969,x:749.9,y:300.85}},{t:this.instance_23,p:{startPosition:0}},{t:this.instance_13,p:{x:715.1}},{t:this.instance_9,p:{x:714.4}},{t:this.instance_8,p:{x:758.85}},{t:this.instance_7,p:{x:760}},{t:this.instance_6,p:{x:740}},{t:this.instance_5,p:{x:758.85}},{t:this.instance_4,p:{x:709.85}},{t:this.instance_3,p:{regX:21,regY:27,scaleY:0.669,skewX:-165.0015,skewY:14.9991,x:777.7,y:342.3,scaleX:0.7734}},{t:this.instance_2,p:{regX:101.9,regY:80.2,scaleY:0.1126,rotation:165.0036,skewY:0,x:788.25,y:261.55,scaleX:0.1302,skewX:0}},{t:this.instance_1,p:{regX:19.2,regY:11.7,scaleY:0.6433,skewX:165.0019,skewY:-14.9986,x:795.85,y:301.8,scaleX:0.7437}},{t:this.instance,p:{startPosition:4,regX:231.2,regY:129.9,skewX:29.985,skewY:-150.0115,x:714.8,y:264.35,scaleX:0.1144,scaleY:0.1486}},{t:this.instance_22,p:{startPosition:0}},{t:this.instance_21,p:{startPosition:0}},{t:this.instance_20,p:{startPosition:0}}]},29).to({state:[{t:this.instance_12,p:{regY:27.8,skewX:117.7547,skewY:-62.2453,x:727.85,y:342.95,regX:26.1,scaleX:0.7734,scaleY:0.7734}},{t:this.instance_19,p:{regX:101.9,rotation:38.8192,x:705.15,y:257.85,regY:186.7,scaleX:0.1302,scaleY:0.1302,skewX:0,skewY:0}},{t:this.instance_10,p:{skewX:-164.1336,skewY:15.8664,regY:6,scaleX:0.7436,scaleY:0.7436,x:691.1,y:321,regX:21.7}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_24,p:{regX:235.9,regY:393.3,scaleX:0.4302,scaleY:0.4302,rotation:14.9969,x:749.9,y:300.85}},{t:this.instance_23,p:{startPosition:5}},{t:this.instance_13,p:{x:715.1}},{t:this.instance_9,p:{x:714.4}},{t:this.instance_8,p:{x:758.85}},{t:this.instance_7,p:{x:760}},{t:this.instance_6,p:{x:740}},{t:this.instance_5,p:{x:758.85}},{t:this.instance_4,p:{x:709.85}},{t:this.instance_3,p:{regX:21,regY:27,scaleY:0.669,skewX:-165.0015,skewY:14.9991,x:777.7,y:342.3,scaleX:0.7734}},{t:this.instance_2,p:{regX:101.9,regY:80.2,scaleY:0.1126,rotation:165.0036,skewY:0,x:788.25,y:261.55,scaleX:0.1302,skewX:0}},{t:this.instance_1,p:{regX:19.2,regY:11.7,scaleY:0.6433,skewX:165.0019,skewY:-14.9986,x:795.85,y:301.8,scaleX:0.7437}},{t:this.instance,p:{startPosition:9,regX:231.3,regY:130.2,skewX:-0.0118,skewY:179.9924,x:714.75,y:264.3,scaleX:0.1144,scaleY:0.1486}},{t:this.instance_22,p:{startPosition:5}},{t:this.instance_21,p:{startPosition:5}},{t:this.instance_20,p:{startPosition:5}}]},41).to({state:[{t:this.instance_12,p:{regY:28.1,skewX:-0.3177,skewY:177.3817,x:718.7,y:336.6,regX:26.2,scaleX:0.8033,scaleY:0.7815}},{t:this.instance_19,p:{regX:101.4,rotation:0,x:700.95,y:446.3,regY:184.3,scaleX:0.1326,scaleY:0.1339,skewX:-141.7357,skewY:-139.0182}},{t:this.instance_10,p:{skewX:15.9636,skewY:-162.5688,regY:6.5,scaleX:0.7459,scaleY:0.7775,x:716.05,y:380.3,regX:21.4}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_24,p:{regX:249.2,regY:403.2,scaleX:0.4285,scaleY:0.4285,rotation:4.1619,x:755.15,y:305.45}},{t:this.instance_13,p:{x:715.1}},{t:this.instance_9,p:{x:714.4}},{t:this.instance_8,p:{x:758.85}},{t:this.instance_7,p:{x:760}},{t:this.instance_6,p:{x:740}},{t:this.instance_5,p:{x:758.85}},{t:this.instance_4,p:{x:709.85}},{t:this.instance_3,p:{regX:27.7,regY:17.5,scaleY:0.6194,skewX:94.6872,skewY:97.0024,x:782.95,y:348.2,scaleX:0.7675}},{t:this.instance_29,p:{regY:8.2,scaleX:0.212,skewX:7.9972,skewY:10.2801,x:687.75,y:280.5}},{t:this.instance_1,p:{regX:20.9,regY:-1,scaleY:0.5949,skewX:142.1483,skewY:139.8668,x:740.2,y:352.35,scaleX:0.7374}},{t:this.instance,p:{startPosition:10,regX:265,regY:149.2,skewX:4.0589,skewY:3.9806,x:715.3,y:275.55,scaleX:0.1341,scaleY:0.1746}},{t:this.instance_28},{t:this.instance_21,p:{startPosition:3}},{t:this.instance_20,p:{startPosition:3}},{t:this.instance_27},{t:this.instance_26,p:{regX:17.8,regY:16.9,rotation:1.2731,x:745.65,y:228.55,scaleX:0.3372,scaleY:0.3372}},{t:this.instance_25,p:{regX:16.6,regY:17.2,y:223.8,scaleX:0.3372,scaleY:0.3372,skewX:28.7282,skewY:-151.2718,x:705.35}}]},21).to({state:[{t:this.instance_12,p:{regY:28.1,skewX:-0.3177,skewY:177.3817,x:718.7,y:336.6,regX:26.2,scaleX:0.8033,scaleY:0.7815}},{t:this.instance_19,p:{regX:101.4,rotation:0,x:700.95,y:446.3,regY:184.3,scaleX:0.1326,scaleY:0.1339,skewX:-141.7357,skewY:-139.0182}},{t:this.instance_10,p:{skewX:15.9636,skewY:-162.5688,regY:6.5,scaleX:0.7459,scaleY:0.7775,x:716.05,y:380.3,regX:21.4}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_24,p:{regX:249.2,regY:403.2,scaleX:0.4285,scaleY:0.4285,rotation:4.1619,x:755.15,y:305.45}},{t:this.instance_13,p:{x:715.1}},{t:this.instance_9,p:{x:714.4}},{t:this.instance_8,p:{x:758.85}},{t:this.instance_7,p:{x:760}},{t:this.instance_6,p:{x:740}},{t:this.instance_5,p:{x:758.85}},{t:this.instance_4,p:{x:709.85}},{t:this.instance_3,p:{regX:27.7,regY:17.5,scaleY:0.6194,skewX:94.6872,skewY:97.0024,x:782.95,y:348.2,scaleX:0.7675}},{t:this.instance_29,p:{regY:8.2,scaleX:0.212,skewX:7.9972,skewY:10.2801,x:687.75,y:280.5}},{t:this.instance_1,p:{regX:20.9,regY:-1,scaleY:0.5949,skewX:142.1483,skewY:139.8668,x:740.2,y:352.35,scaleX:0.7374}},{t:this.instance,p:{startPosition:10,regX:265,regY:149.2,skewX:4.0589,skewY:3.9806,x:715.3,y:275.55,scaleX:0.1341,scaleY:0.1746}},{t:this.instance_28},{t:this.instance_21,p:{startPosition:5}},{t:this.instance_20,p:{startPosition:5}},{t:this.instance_27},{t:this.instance_26,p:{regX:17.9,regY:17.1,rotation:1.2706,x:747.05,y:228.55,scaleX:0.3372,scaleY:0.3372}},{t:this.instance_25,p:{regX:16.4,regY:17.3,y:222.9,scaleX:0.3372,scaleY:0.3372,skewX:28.7282,skewY:-151.2718,x:705.35}}]},2).to({state:[{t:this.instance_12,p:{regY:28.1,skewX:-0.3177,skewY:177.3817,x:718.7,y:336.6,regX:26.2,scaleX:0.8033,scaleY:0.7815}},{t:this.instance_19,p:{regX:101.4,rotation:0,x:700.95,y:446.3,regY:184.3,scaleX:0.1326,scaleY:0.1339,skewX:-141.7357,skewY:-139.0182}},{t:this.instance_10,p:{skewX:15.9636,skewY:-162.5688,regY:6.5,scaleX:0.7459,scaleY:0.7775,x:716.05,y:380.3,regX:21.4}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_24,p:{regX:249.2,regY:403.2,scaleX:0.4285,scaleY:0.4285,rotation:4.1619,x:755.15,y:305.45}},{t:this.instance_13,p:{x:715.1}},{t:this.instance_9,p:{x:714.4}},{t:this.instance_8,p:{x:758.85}},{t:this.instance_7,p:{x:760}},{t:this.instance_6,p:{x:740}},{t:this.instance_5,p:{x:758.85}},{t:this.instance_4,p:{x:709.85}},{t:this.instance_3,p:{regX:27.7,regY:17.5,scaleY:0.6194,skewX:94.6872,skewY:97.0024,x:782.95,y:348.2,scaleX:0.7675}},{t:this.instance_29,p:{regY:8.2,scaleX:0.212,skewX:7.9972,skewY:10.2801,x:687.75,y:280.5}},{t:this.instance_1,p:{regX:20.9,regY:-1,scaleY:0.5949,skewX:142.1483,skewY:139.8668,x:740.2,y:352.35,scaleX:0.7374}},{t:this.instance,p:{startPosition:10,regX:265,regY:149.2,skewX:4.0589,skewY:3.9806,x:715.3,y:275.55,scaleX:0.1341,scaleY:0.1746}},{t:this.instance_28},{t:this.instance_21,p:{startPosition:7}},{t:this.instance_20,p:{startPosition:7}},{t:this.instance_27},{t:this.instance_26,p:{regX:18.1,regY:17.2,rotation:1.268,x:748.5,y:227.05,scaleX:0.3372,scaleY:0.3372}},{t:this.instance_25,p:{regX:16.2,regY:17.4,y:221.85,scaleX:0.3371,scaleY:0.3371,skewX:28.7262,skewY:-151.2738,x:705.35}}]},2).to({state:[{t:this.instance_12,p:{regY:28.1,skewX:-0.3177,skewY:177.3817,x:718.7,y:336.6,regX:26.2,scaleX:0.8033,scaleY:0.7815}},{t:this.instance_19,p:{regX:101.4,rotation:0,x:700.95,y:446.3,regY:184.3,scaleX:0.1326,scaleY:0.1339,skewX:-141.7357,skewY:-139.0182}},{t:this.instance_10,p:{skewX:15.9636,skewY:-162.5688,regY:6.5,scaleX:0.7459,scaleY:0.7775,x:716.05,y:380.3,regX:21.4}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_24,p:{regX:249.2,regY:403.2,scaleX:0.4285,scaleY:0.4285,rotation:4.1619,x:755.15,y:305.45}},{t:this.instance_13,p:{x:715.1}},{t:this.instance_9,p:{x:714.4}},{t:this.instance_8,p:{x:758.85}},{t:this.instance_7,p:{x:760}},{t:this.instance_6,p:{x:740}},{t:this.instance_5,p:{x:758.85}},{t:this.instance_4,p:{x:709.85}},{t:this.instance_3,p:{regX:27.7,regY:17.5,scaleY:0.6194,skewX:94.6872,skewY:97.0024,x:782.95,y:348.2,scaleX:0.7675}},{t:this.instance_29,p:{regY:8.2,scaleX:0.212,skewX:7.9972,skewY:10.2801,x:687.75,y:280.5}},{t:this.instance_1,p:{regX:20.9,regY:-1,scaleY:0.5949,skewX:142.1483,skewY:139.8668,x:740.2,y:352.35,scaleX:0.7374}},{t:this.instance,p:{startPosition:10,regX:265,regY:149.2,skewX:4.0589,skewY:3.9806,x:715.3,y:275.55,scaleX:0.1341,scaleY:0.1746}},{t:this.instance_28},{t:this.instance_21,p:{startPosition:1}},{t:this.instance_20,p:{startPosition:1}},{t:this.instance_27},{t:this.instance_26,p:{regX:18.2,regY:17.4,rotation:1.2655,x:749.5,y:227.05,scaleX:0.3372,scaleY:0.3372}},{t:this.instance_25,p:{regX:16.2,regY:17.4,y:221.85,scaleX:0.3371,scaleY:0.3371,skewX:28.7262,skewY:-151.2738,x:705.35}}]},2).to({state:[{t:this.instance_12,p:{regY:28.1,skewX:-0.3177,skewY:177.3817,x:718.7,y:336.6,regX:26.2,scaleX:0.8033,scaleY:0.7815}},{t:this.instance_19,p:{regX:101.4,rotation:0,x:700.95,y:446.3,regY:184.3,scaleX:0.1326,scaleY:0.1339,skewX:-141.7357,skewY:-139.0182}},{t:this.instance_10,p:{skewX:15.9636,skewY:-162.5688,regY:6.5,scaleX:0.7459,scaleY:0.7775,x:716.05,y:380.3,regX:21.4}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_24,p:{regX:249.2,regY:403.2,scaleX:0.4285,scaleY:0.4285,rotation:4.1619,x:755.15,y:305.45}},{t:this.instance_13,p:{x:715.1}},{t:this.instance_9,p:{x:714.4}},{t:this.instance_8,p:{x:758.85}},{t:this.instance_7,p:{x:760}},{t:this.instance_6,p:{x:740}},{t:this.instance_5,p:{x:758.85}},{t:this.instance_4,p:{x:709.85}},{t:this.instance_3,p:{regX:27.7,regY:17.5,scaleY:0.6194,skewX:94.6872,skewY:97.0024,x:782.95,y:348.2,scaleX:0.7675}},{t:this.instance_29,p:{regY:8.2,scaleX:0.212,skewX:7.9972,skewY:10.2801,x:687.75,y:280.5}},{t:this.instance_1,p:{regX:20.9,regY:-1,scaleY:0.5949,skewX:142.1483,skewY:139.8668,x:740.2,y:352.35,scaleX:0.7374}},{t:this.instance,p:{startPosition:10,regX:265,regY:149.2,skewX:4.0589,skewY:3.9806,x:715.3,y:275.55,scaleX:0.1341,scaleY:0.1746}},{t:this.instance_28},{t:this.instance_21,p:{startPosition:3}},{t:this.instance_20,p:{startPosition:3}},{t:this.instance_27},{t:this.instance_26,p:{regX:18.4,regY:17.6,rotation:1.2629,x:751.05,y:224.95,scaleX:0.3372,scaleY:0.3372}},{t:this.instance_25,p:{regX:16,regY:17.4,y:219.7,scaleX:0.3371,scaleY:0.3371,skewX:28.7251,skewY:-151.2749,x:704.05}}]},2).to({state:[{t:this.instance_12,p:{regY:28.1,skewX:-0.3177,skewY:177.3817,x:718.7,y:336.6,regX:26.2,scaleX:0.8033,scaleY:0.7815}},{t:this.instance_19,p:{regX:101.4,rotation:0,x:700.95,y:446.3,regY:184.3,scaleX:0.1326,scaleY:0.1339,skewX:-141.7357,skewY:-139.0182}},{t:this.instance_10,p:{skewX:15.9636,skewY:-162.5688,regY:6.5,scaleX:0.7459,scaleY:0.7775,x:716.05,y:380.3,regX:21.4}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_24,p:{regX:249.2,regY:403.2,scaleX:0.4285,scaleY:0.4285,rotation:4.1619,x:755.15,y:305.45}},{t:this.instance_13,p:{x:715.1}},{t:this.instance_9,p:{x:714.4}},{t:this.instance_8,p:{x:758.85}},{t:this.instance_7,p:{x:760}},{t:this.instance_6,p:{x:740}},{t:this.instance_5,p:{x:758.85}},{t:this.instance_4,p:{x:709.85}},{t:this.instance_3,p:{regX:27.7,regY:17.5,scaleY:0.6194,skewX:94.6872,skewY:97.0024,x:782.95,y:348.2,scaleX:0.7675}},{t:this.instance_29,p:{regY:8.2,scaleX:0.212,skewX:7.9972,skewY:10.2801,x:687.75,y:280.5}},{t:this.instance_1,p:{regX:20.9,regY:-1,scaleY:0.5949,skewX:142.1483,skewY:139.8668,x:740.2,y:352.35,scaleX:0.7374}},{t:this.instance,p:{startPosition:10,regX:265,regY:149.2,skewX:4.0589,skewY:3.9806,x:715.3,y:275.55,scaleX:0.1341,scaleY:0.1746}},{t:this.instance_28},{t:this.instance_21,p:{startPosition:5}},{t:this.instance_20,p:{startPosition:5}},{t:this.instance_27},{t:this.instance_26,p:{regX:18.5,regY:17.7,rotation:1.2604,x:751.9,y:224.9,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.8,regY:17.4,y:218.95,scaleX:0.3371,scaleY:0.3371,skewX:28.7241,skewY:-151.2759,x:704.1}}]},2).to({state:[{t:this.instance_12,p:{regY:28.1,skewX:-0.3177,skewY:177.3817,x:718.7,y:336.6,regX:26.2,scaleX:0.8033,scaleY:0.7815}},{t:this.instance_19,p:{regX:101.4,rotation:0,x:700.95,y:446.3,regY:184.3,scaleX:0.1326,scaleY:0.1339,skewX:-141.7357,skewY:-139.0182}},{t:this.instance_10,p:{skewX:15.9636,skewY:-162.5688,regY:6.5,scaleX:0.7459,scaleY:0.7775,x:716.05,y:380.3,regX:21.4}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_24,p:{regX:249.2,regY:403.2,scaleX:0.4285,scaleY:0.4285,rotation:4.1619,x:755.15,y:305.45}},{t:this.instance_13,p:{x:715.1}},{t:this.instance_9,p:{x:714.4}},{t:this.instance_8,p:{x:758.85}},{t:this.instance_7,p:{x:760}},{t:this.instance_6,p:{x:740}},{t:this.instance_5,p:{x:758.85}},{t:this.instance_4,p:{x:709.85}},{t:this.instance_3,p:{regX:27.8,regY:17.5,scaleY:0.6194,skewX:4.686,skewY:7.0015,x:784.45,y:336.4,scaleX:0.7675}},{t:this.instance_29,p:{regY:8.4,scaleX:0.2119,skewX:-82.0072,skewY:-79.7232,x:716.65,y:431.6}},{t:this.instance_1,p:{regX:20.9,regY:-1.1,scaleY:0.5949,skewX:52.1486,skewY:49.8662,x:788.55,y:379.1,scaleX:0.7373}},{t:this.instance,p:{startPosition:10,regX:265,regY:149.2,skewX:4.0589,skewY:3.9806,x:715.3,y:275.55,scaleX:0.1341,scaleY:0.1746}},{t:this.instance_28},{t:this.instance_27},{t:this.instance_26,p:{regX:18.5,regY:17.7,rotation:1.2604,x:751.9,y:224.9,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.8,regY:17.4,y:218.95,scaleX:0.3371,scaleY:0.3371,skewX:28.7241,skewY:-151.2759,x:704.1}}]},28).to({state:[{t:this.instance_12,p:{regY:27.8,skewX:91.6951,skewY:-107.5822,x:740,y:338.35,regX:26.1,scaleX:1.1202,scaleY:1.0472}},{t:this.instance_30,p:{regX:95.9,regY:320.3,skewX:-70.9999,skewY:-72.9455,x:596.95,y:314.9}},{t:this.instance_10,p:{skewX:106.47,skewY:-87.3474,regY:6.2,scaleX:0.936,scaleY:1.126,x:680.45,y:332.75,regX:21.4}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_24,p:{regX:249.2,regY:403.2,scaleX:0.4285,scaleY:0.4285,rotation:4.1619,x:755.15,y:305.45}},{t:this.instance_13,p:{x:715.1}},{t:this.instance_9,p:{x:714.4}},{t:this.instance_8,p:{x:758.85}},{t:this.instance_7,p:{x:760}},{t:this.instance_6,p:{x:740}},{t:this.instance_5,p:{x:758.85}},{t:this.instance_4,p:{x:709.85}},{t:this.instance_3,p:{regX:27.8,regY:17.5,scaleY:0.6194,skewX:4.686,skewY:7.0015,x:784.45,y:336.4,scaleX:0.7675}},{t:this.instance_2,p:{regX:94.7,regY:8.8,scaleY:0.1219,rotation:0,skewY:-144.0217,x:768.85,y:410.45,scaleX:0.1518,skewX:38.2644}},{t:this.instance_1,p:{regX:21,regY:-1.1,scaleY:0.5948,skewX:32.9265,skewY:30.6445,x:787.7,y:377.35,scaleX:0.7373}},{t:this.instance,p:{startPosition:1,regX:263.6,regY:150.3,skewX:18.8817,skewY:-161.0388,x:705.1,y:264.75,scaleX:0.134,scaleY:0.1745}},{t:this.instance_28},{t:this.instance_27},{t:this.instance_26,p:{regX:18.5,regY:17.7,rotation:1.2604,x:751.9,y:224.9,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.8,regY:17.4,y:218.95,scaleX:0.3371,scaleY:0.3371,skewX:28.7241,skewY:-151.2759,x:704.1}}]},2).to({state:[{t:this.instance_12,p:{regY:27.8,skewX:138.2765,skewY:-61.0016,x:733.5,y:353.5,regX:26.2,scaleX:1.1202,scaleY:1.0471}},{t:this.instance_30,p:{regX:95.6,regY:320.4,skewX:-24.4198,skewY:-26.3613,x:652.05,y:233.55}},{t:this.instance_10,p:{skewX:153.0516,skewY:-40.7666,regY:6.2,scaleX:0.936,scaleY:1.126,x:696.45,y:306.45,regX:21.4}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_24,p:{regX:249.2,regY:403.2,scaleX:0.4285,scaleY:0.4285,rotation:4.1619,x:755.15,y:305.45}},{t:this.instance_13,p:{x:715.1}},{t:this.instance_9,p:{x:714.4}},{t:this.instance_8,p:{x:758.85}},{t:this.instance_7,p:{x:760}},{t:this.instance_6,p:{x:740}},{t:this.instance_5,p:{x:758.85}},{t:this.instance_4,p:{x:709.85}},{t:this.instance_3,p:{regX:27.8,regY:17.5,scaleY:0.6194,skewX:4.686,skewY:7.0015,x:784.45,y:336.4,scaleX:0.7675}},{t:this.instance_2,p:{regX:95.2,regY:8.2,scaleY:0.1249,rotation:0,skewY:-162.0431,x:790.35,y:416.9,scaleX:0.1556,skewX:20.2415}},{t:this.instance_1,p:{regX:20.9,regY:-1.1,scaleY:0.5948,skewX:0.9054,skewY:-1.3756,x:783.1,y:375.8,scaleX:0.7373}},{t:this.instance,p:{startPosition:2,regX:262.6,regY:150.3,skewX:13.3361,skewY:-166.5845,x:707.25,y:264.55,scaleX:0.1339,scaleY:0.1744}},{t:this.instance_28},{t:this.instance_27},{t:this.instance_26,p:{regX:18.5,regY:17.7,rotation:1.2604,x:751.9,y:224.9,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.8,regY:17.4,y:218.95,scaleX:0.3371,scaleY:0.3371,skewX:28.7241,skewY:-151.2759,x:704.1}}]},1).to({state:[{t:this.instance_12,p:{regY:27.8,skewX:139.7577,skewY:-59.5199,x:733.2,y:353.9,regX:26.2,scaleX:1.1203,scaleY:1.0472}},{t:this.instance_30,p:{regX:95.6,regY:320.4,skewX:-22.9398,skewY:-24.884,x:654.9,y:231.9}},{t:this.instance_10,p:{skewX:154.5326,skewY:-39.2851,regY:6.2,scaleX:0.9361,scaleY:1.126,x:697.45,y:305.9,regX:21.4}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_24,p:{regX:249.2,regY:403.2,scaleX:0.4285,scaleY:0.4285,rotation:4.1619,x:755.15,y:305.45}},{t:this.instance_13,p:{x:715.1}},{t:this.instance_9,p:{x:714.4}},{t:this.instance_8,p:{x:758.85}},{t:this.instance_7,p:{x:760}},{t:this.instance_6,p:{x:740}},{t:this.instance_5,p:{x:758.85}},{t:this.instance_4,p:{x:709.85}},{t:this.instance_3,p:{regX:27.8,regY:17.5,scaleY:0.6194,skewX:4.686,skewY:7.0015,x:784.45,y:336.4,scaleX:0.7675}},{t:this.instance_2,p:{regX:93.4,regY:7.7,scaleY:0.1094,rotation:0,skewY:-165.214,x:783.6,y:418.4,scaleX:0.1363,skewX:17.0757}},{t:this.instance_1,p:{regX:20.9,regY:-1.1,scaleY:0.5948,skewX:2.1876,skewY:-0.0925,x:783.25,y:376.5,scaleX:0.7373}},{t:this.instance,p:{startPosition:2,regX:262.6,regY:150.3,skewX:13.3361,skewY:-166.5845,x:707.25,y:264.55,scaleX:0.1339,scaleY:0.1744}},{t:this.instance_28},{t:this.instance_27},{t:this.instance_26,p:{regX:18.5,regY:17.7,rotation:1.2604,x:751.9,y:224.9,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.8,regY:17.4,y:218.95,scaleX:0.3371,scaleY:0.3371,skewX:28.7241,skewY:-151.2759,x:704.1}}]},1).to({state:[{t:this.instance_12,p:{regY:27.9,skewX:140.9395,skewY:-58.3381,x:732.85,y:354.1,regX:26.2,scaleX:1.1204,scaleY:1.0473}},{t:this.instance_30,p:{regX:95.9,regY:320.2,skewX:-21.7585,skewY:-23.7016,x:657.15,y:230.6}},{t:this.instance_10,p:{skewX:155.7146,skewY:-38.1029,regY:6.2,scaleX:0.9361,scaleY:1.1261,x:698.15,y:305.55,regX:21.4}},{t:this.instance_15,p:{x:746.5}},{t:this.instance_14,p:{startPosition:0,regX:249.2,regY:403.2,rotation:4.1619,x:755.15,y:305.45,scaleX:0.4285,scaleY:0.4285}},{t:this.instance_13,p:{x:715.1}},{t:this.instance_9,p:{x:714.4}},{t:this.instance_8,p:{x:758.85}},{t:this.instance_7,p:{x:760}},{t:this.instance_6,p:{x:740}},{t:this.instance_5,p:{x:758.85}},{t:this.instance_4,p:{x:709.85}},{t:this.instance_3,p:{regX:27.8,regY:17.5,scaleY:0.6194,skewX:4.686,skewY:7.0015,x:784.45,y:336.4,scaleX:0.7675}},{t:this.instance_2,p:{regX:94.5,regY:7.5,scaleY:0.1144,rotation:0,skewY:-160.2628,x:787,y:419.85,scaleX:0.1425,skewX:22.0285}},{t:this.instance_1,p:{regX:20.9,regY:-1.1,scaleY:0.5948,skewX:7.1485,skewY:4.8665,x:784.8,y:376.15,scaleX:0.7373}},{t:this.instance,p:{startPosition:3,regX:261.7,regY:150.8,skewX:20.5476,skewY:-159.3741,x:711.65,y:267.55,scaleX:0.1215,scaleY:0.1584}},{t:this.instance_26,p:{regX:18.5,regY:17.7,rotation:1.2604,x:751.9,y:224.9,scaleX:0.3371,scaleY:0.3371}},{t:this.instance_25,p:{regX:15.8,regY:17.4,y:218.95,scaleX:0.3371,scaleY:0.3371,skewX:28.7241,skewY:-151.2759,x:704.1}}]},1).wait(66));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


// stage content:
(lib.Untitled1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	this.actionFrames = [0,238];
	this.___GetDepth___ = function(obj) {
		var depth = obj.depth;
		var cameraObj = this.___camera___instance;
		if(cameraObj && cameraObj.depth && obj.isAttachedToCamera)
		{
			depth += depth + cameraObj.depth;
		}
		return depth;
		}
	this.___needSorting___ = function() {
		for (var i = 0; i < this.numChildren - 1; i++)
		{
			var prevDepth = this.___GetDepth___(this.getChildAt(i));
			var nextDepth = this.___GetDepth___(this.getChildAt(i + 1));
			if (prevDepth < nextDepth)
				return true;
		}
		return false;
	}
	this.___sortFunction___ = function(obj1, obj2) {
		return (this.exportRoot.___GetDepth___(obj2) - this.exportRoot.___GetDepth___(obj1));
	}
	this.on('tick', function (event){
		var curTimeline = event.currentTarget;
		if (curTimeline.___needSorting___()){
			this.sortChildren(curTimeline.___sortFunction___);
		}
	});

	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
	}
	this.frame_238 = function() {
		this.___loopingOver___ = true;
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(238).call(this.frame_238).wait(1));

	// Camera
	this.___camera___instance = new lib.___Camera___();
	this.___camera___instance.name = "___camera___instance";
	this.___camera___instance.setTransform(640,360);
	this.___camera___instance.depth = 0;
	this.___camera___instance.visible = false;

	this.timeline.addTween(cjs.Tween.get(this.___camera___instance).wait(68).to({regX:0.4,regY:0.4,scaleX:0.4469,scaleY:0.4469,x:612.6,y:259.05},0).wait(15).to({regX:1.1,regY:1.1,scaleX:0.3268,scaleY:0.3268,x:776.15,y:247.85},82).wait(4).to({regX:0.7,regY:0.7,scaleX:0.3599,scaleY:0.3599,x:769.45,y:253.25},0).to({regX:1.1,regY:1.1,scaleX:0.6161,scaleY:0.6161,x:647.75,y:196.45},4).wait(66));

	// lamp_obj_
	this.lamp = new lib.Scene_1_lamp();
	this.lamp.name = "lamp";
	this.lamp.setTransform(629.1,43.5,1,1,0,0,0,629.1,43.5);
	this.lamp.depth = 0;
	this.lamp.isAttachedToCamera = 0
	this.lamp.isAttachedToMask = 0
	this.lamp.layerDepth = 0
	this.lamp.layerIndex = 0
	this.lamp.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.lamp).wait(168).to({regX:772.2,regY:144,scaleX:3.0597,scaleY:3.0597,y:43.45},0).wait(5).to({regX:640.4,regY:0.8,scaleX:1.623,scaleY:1.623,x:629.25,y:43.55},0).wait(66));

	// ball_obj_
	this.ball = new lib.Scene_1_ball();
	this.ball.name = "ball";
	this.ball.depth = 0;
	this.ball.isAttachedToCamera = 0
	this.ball.isAttachedToMask = 0
	this.ball.layerDepth = 0
	this.ball.layerIndex = 1
	this.ball.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.ball).wait(6).to({regX:595.1,regY:343.3,x:595.1,y:343.3},0).wait(9).to({regX:0,regY:0,x:0,y:0},0).wait(10).to({regX:595.1,regY:343.3,x:595.1,y:343.3},0).wait(214));

	// Character1_obj_
	this.Character1 = new lib.Scene_1_Character1();
	this.Character1.name = "Character1";
	this.Character1.setTransform(889.4,353.9,1,1,0,0,0,889.4,353.9);
	this.Character1.depth = 0;
	this.Character1.isAttachedToCamera = 0
	this.Character1.isAttachedToMask = 0
	this.Character1.layerDepth = 0
	this.Character1.layerIndex = 2
	this.Character1.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Character1).wait(68).to({regX:723.8,regY:256.1,scaleX:2.2379,scaleY:2.2379,x:889.35,y:353.95},0).wait(41).to({regX:766.1,regY:252.8,scaleX:2.4464,scaleY:2.4464,x:889.25,y:354},0).wait(21).to({regX:800.4,regY:250.1,scaleX:2.6452,scaleY:2.6452,x:889.35,y:353.8},0).wait(2).to({regX:803.7,regY:249.9,scaleX:2.6659,scaleY:2.6659,y:353.9},0).wait(2).to({regX:807,regY:249.6,scaleX:2.6869,scaleY:2.6869,x:889.5},0).wait(2).to({regX:810.2,regY:249.3,scaleX:2.7082,scaleY:2.7082,x:889.4,y:353.7},0).wait(2).to({regX:813.5,regY:249.1,scaleX:2.7298,scaleY:2.7298,x:889.35,y:353.95},0).wait(2).to({regX:816.8,regY:248.8,scaleX:2.7518,scaleY:2.7518,x:889.5,y:353.8},0).wait(28).to({regX:857.2,regY:245.5,scaleX:3.0597,scaleY:3.0597,x:889.15,y:354},0).wait(2).to({regX:844.4,regY:236.1,scaleX:2.3589,scaleY:2.3589,x:889.5,y:353.85},0).wait(1).to({regX:829.9,regY:221.4,scaleX:2.0492,scaleY:2.0492,x:889.4},0).wait(1).to({regX:815.4,regY:206.7,scaleX:1.8114,scaleY:1.8114,y:353.8},0).wait(1).to({regX:800.7,regY:192,scaleX:1.623,scaleY:1.623,y:353.85},0).wait(66));

	// Character2_obj_
	this.Character2 = new lib.Scene_1_Character2();
	this.Character2.name = "Character2";
	this.Character2.setTransform(329.2,361.9,1,1,0,0,0,329.2,361.9);
	this.Character2.depth = 0;
	this.Character2.isAttachedToCamera = 0
	this.Character2.isAttachedToMask = 0
	this.Character2.layerDepth = 0
	this.Character2.layerIndex = 3
	this.Character2.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Character2).wait(68).to({regX:473.5,regY:259.7,scaleX:2.2379,scaleY:2.2379,y:362},0).wait(100).to({regX:674.2,regY:248.1,scaleX:3.0597,scaleY:3.0597,x:329.25,y:361.95},0).wait(2).to({regX:606.9,regY:239.6,scaleX:2.3589,scaleY:2.3589,y:362.1},0).wait(10).to({regX:455.6,regY:197,scaleX:1.623,scaleY:1.623,x:329.3,y:361.95},0).wait(59));

	// darkScreen_obj_
	this.darkScreen = new lib.Scene_1_darkScreen();
	this.darkScreen.name = "darkScreen";
	this.darkScreen.depth = 0;
	this.darkScreen.isAttachedToCamera = 0
	this.darkScreen.isAttachedToMask = 0
	this.darkScreen.layerDepth = 0
	this.darkScreen.layerIndex = 4
	this.darkScreen.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.darkScreen).wait(174).to({regX:252.7,regY:-26.1,scaleX:1.623,scaleY:1.623,y:-0.1},0).wait(65));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(550.9,310.3,1093,468.49999999999994);
// library properties:
lib.properties = {
	id: '5AAAC8EB146B3844933521FFC847E939',
	width: 1280,
	height: 720,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/CachedBmp_40.png", id:"CachedBmp_40"},
		{src:"images/CachedBmp_41.png", id:"CachedBmp_41"},
		{src:"images/CachedBmp_42.png", id:"CachedBmp_42"},
		{src:"images/CachedBmp_43.png", id:"CachedBmp_43"},
		{src:"images/CachedBmp_136.png", id:"CachedBmp_136"},
		{src:"images/CachedBmp_134.png", id:"CachedBmp_134"},
		{src:"images/CachedBmp_74.png", id:"CachedBmp_74"},
		{src:"images/CachedBmp_81.png", id:"CachedBmp_81"},
		{src:"images/CachedBmp_75.png", id:"CachedBmp_75"},
		{src:"images/CachedBmp_133.png", id:"CachedBmp_133"},
		{src:"images/CachedBmp_83.png", id:"CachedBmp_83"},
		{src:"images/CachedBmp_80.png", id:"CachedBmp_80"},
		{src:"images/CachedBmp_135.png", id:"CachedBmp_135"},
		{src:"images/CachedBmp_132.png", id:"CachedBmp_132"},
		{src:"images/CachedBmp_82.png", id:"CachedBmp_82"},
		{src:"images/CachedBmp_73.png", id:"CachedBmp_73"},
		{src:"images/CachedBmp_72.png", id:"CachedBmp_72"},
		{src:"images/CachedBmp_2.png", id:"CachedBmp_2"},
		{src:"images/Untitled_1_atlas_1.png", id:"Untitled_1_atlas_1"},
		{src:"images/Untitled_1_atlas_2.png", id:"Untitled_1_atlas_2"},
		{src:"images/Untitled_1_atlas_3.png", id:"Untitled_1_atlas_3"},
		{src:"images/Untitled_1_atlas_4.png", id:"Untitled_1_atlas_4"},
		{src:"images/Untitled_1_atlas_5.png", id:"Untitled_1_atlas_5"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['5AAAC8EB146B3844933521FFC847E939'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}

p._getProjectionMatrix = function(container, totalDepth) {	var focalLength = 528.25;
	var projectionCenter = { x : lib.properties.width/2, y : lib.properties.height/2 };
	var scale = (totalDepth + focalLength)/focalLength;
	var scaleMat = new createjs.Matrix2D;
	scaleMat.a = 1/scale;
	scaleMat.d = 1/scale;
	var projMat = new createjs.Matrix2D;
	projMat.tx = -projectionCenter.x;
	projMat.ty = -projectionCenter.y;
	projMat = projMat.prependMatrix(scaleMat);
	projMat.tx += projectionCenter.x;
	projMat.ty += projectionCenter.y;
	return projMat;
}
p._handleTick = function(event) {
	var cameraInstance = exportRoot.___camera___instance;
	if(cameraInstance !== undefined && cameraInstance.pinToObject !== undefined)
	{
		cameraInstance.x = cameraInstance.pinToObject.x + cameraInstance.pinToObject.pinOffsetX;
		cameraInstance.y = cameraInstance.pinToObject.y + cameraInstance.pinToObject.pinOffsetY;
		if(cameraInstance.pinToObject.parent !== undefined && cameraInstance.pinToObject.parent.depth !== undefined)
		cameraInstance.depth = cameraInstance.pinToObject.parent.depth + cameraInstance.pinToObject.pinOffsetZ;
	}
	stage._applyLayerZDepth(exportRoot);
}
p._applyLayerZDepth = function(parent)
{
	var cameraInstance = parent.___camera___instance;
	var focalLength = 528.25;
	var projectionCenter = { 'x' : 0, 'y' : 0};
	if(parent === exportRoot)
	{
		var stageCenter = { 'x' : lib.properties.width/2, 'y' : lib.properties.height/2 };
		projectionCenter.x = stageCenter.x;
		projectionCenter.y = stageCenter.y;
	}
	for(child in parent.children)
	{
		var layerObj = parent.children[child];
		if(layerObj == cameraInstance)
			continue;
		stage._applyLayerZDepth(layerObj, cameraInstance);
		if(layerObj.layerDepth === undefined)
			continue;
		if(layerObj.currentFrame != layerObj.parent.currentFrame)
		{
			layerObj.gotoAndPlay(layerObj.parent.currentFrame);
		}
		var matToApply = new createjs.Matrix2D;
		var cameraMat = new createjs.Matrix2D;
		var totalDepth = layerObj.layerDepth ? layerObj.layerDepth : 0;
		var cameraDepth = 0;
		if(cameraInstance && !layerObj.isAttachedToCamera)
		{
			var mat = cameraInstance.getMatrix();
			mat.tx -= projectionCenter.x;
			mat.ty -= projectionCenter.y;
			cameraMat = mat.invert();
			cameraMat.prependTransform(projectionCenter.x, projectionCenter.y, 1, 1, 0, 0, 0, 0, 0);
			cameraMat.appendTransform(-projectionCenter.x, -projectionCenter.y, 1, 1, 0, 0, 0, 0, 0);
			if(cameraInstance.depth)
				cameraDepth = cameraInstance.depth;
		}
		if(layerObj.depth)
		{
			totalDepth = layerObj.depth;
		}
		//Offset by camera depth
		totalDepth -= cameraDepth;
		if(totalDepth < -focalLength)
		{
			matToApply.a = 0;
			matToApply.d = 0;
		}
		else
		{
			if(layerObj.layerDepth)
			{
				var sizeLockedMat = stage._getProjectionMatrix(parent, layerObj.layerDepth);
				if(sizeLockedMat)
				{
					sizeLockedMat.invert();
					matToApply.prependMatrix(sizeLockedMat);
				}
			}
			matToApply.prependMatrix(cameraMat);
			var projMat = stage._getProjectionMatrix(parent, totalDepth);
			if(projMat)
			{
				matToApply.prependMatrix(projMat);
			}
		}
		layerObj.transformMatrix = matToApply;
	}
}
an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}			
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;			
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});			
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;			
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}

// Virtual camera API : 

an.VirtualCamera = new function() {
var _camera = new Object();
function VC(timeline) {
	this.timeline = timeline;
	this.camera = timeline.___camera___instance;
	this.centerX = lib.properties.width / 2;
	this.centerY = lib.properties.height / 2;
	this.camAxisX = this.camera.x;
	this.camAxisY = this.camera.y;
	if(timeline.___camera___instance == null || timeline.___camera___instance == undefined ) {
		timeline.___camera___instance = new cjs.MovieClip();
		timeline.___camera___instance.visible = false;
		timeline.___camera___instance.parent = timeline;
		timeline.___camera___instance.setTransform(this.centerX, this.centerY);
	}
	this.camera = timeline.___camera___instance;
}

VC.prototype.moveBy = function(x, y, z) {
z = typeof z !== 'undefined' ? z : 0;
	var position = this.___getCamPosition___();
	var rotAngle = this.getRotation()*Math.PI/180;
	var sinTheta = Math.sin(rotAngle);
	var cosTheta = Math.cos(rotAngle);
	var offX= x*cosTheta + y*sinTheta;
	var offY = y*cosTheta - x*sinTheta;
	this.camAxisX = this.camAxisX - x;
	this.camAxisY = this.camAxisY - y;
	var posX = position.x + offX;
	var posY = position.y + offY;
	this.camera.x = this.centerX - posX;
	this.camera.y = this.centerY - posY;
	this.camera.depth += z;
};

VC.prototype.setPosition = function(x, y, z) {
	z = typeof z !== 'undefined' ? z : 0;

	const MAX_X = 10000;
	const MIN_X = -10000;
	const MAX_Y = 10000;
	const MIN_Y = -10000;
	const MAX_Z = 10000;
	const MIN_Z = -5000;

	if(x > MAX_X)
	  x = MAX_X;
	else if(x < MIN_X)
	  x = MIN_X;
	if(y > MAX_Y)
	  y = MAX_Y;
	else if(y < MIN_Y)
	  y = MIN_Y;
	if(z > MAX_Z)
	  z = MAX_Z;
	else if(z < MIN_Z)
	  z = MIN_Z;

	var rotAngle = this.getRotation()*Math.PI/180;
	var sinTheta = Math.sin(rotAngle);
	var cosTheta = Math.cos(rotAngle);
	var offX= x*cosTheta + y*sinTheta;
	var offY = y*cosTheta - x*sinTheta;
	
	this.camAxisX = this.centerX - x;
	this.camAxisY = this.centerY - y;
	this.camera.x = this.centerX - offX;
	this.camera.y = this.centerY - offY;
	this.camera.depth = z;
};

VC.prototype.getPosition = function() {
	var loc = new Object();
	loc['x'] = this.centerX - this.camAxisX;
	loc['y'] = this.centerY - this.camAxisY;
	loc['z'] = this.camera.depth;
	return loc;
};

VC.prototype.resetPosition = function() {
	this.setPosition(0, 0);
};

VC.prototype.zoomBy = function(zoom) {
	this.setZoom( (this.getZoom() * zoom) / 100);
};

VC.prototype.setZoom = function(zoom) {
	const MAX_zoom = 10000;
	const MIN_zoom = 1;
	if(zoom > MAX_zoom)
	zoom = MAX_zoom;
	else if(zoom < MIN_zoom)
	zoom = MIN_zoom;
	this.camera.scaleX = 100 / zoom;
	this.camera.scaleY = 100 / zoom;
};

VC.prototype.getZoom = function() {
	return 100 / this.camera.scaleX;
};

VC.prototype.resetZoom = function() {
	this.setZoom(100);
};

VC.prototype.rotateBy = function(angle) {
	this.setRotation( this.getRotation() + angle );
};

VC.prototype.setRotation = function(angle) {
	const MAX_angle = 180;
	const MIN_angle = -179;
	if(angle > MAX_angle)
		angle = MAX_angle;
	else if(angle < MIN_angle)
		angle = MIN_angle;
	this.camera.rotation = -angle;
};

VC.prototype.getRotation = function() {
	return -this.camera.rotation;
};

VC.prototype.resetRotation = function() {
	this.setRotation(0);
};

VC.prototype.reset = function() {
	this.resetPosition();
	this.resetZoom();
	this.resetRotation();
	this.unpinCamera();
};
VC.prototype.setZDepth = function(zDepth) {
	const MAX_zDepth = 10000;
	const MIN_zDepth = -5000;
	if(zDepth > MAX_zDepth)
		zDepth = MAX_zDepth;
	else if(zDepth < MIN_zDepth)
		zDepth = MIN_zDepth;
	this.camera.depth = zDepth;
}
VC.prototype.getZDepth = function() {
	return this.camera.depth;
}
VC.prototype.resetZDepth = function() {
	this.camera.depth = 0;
}

VC.prototype.pinCameraToObject = function(obj, offsetX, offsetY, offsetZ) {

	offsetX = typeof offsetX !== 'undefined' ? offsetX : 0;

	offsetY = typeof offsetY !== 'undefined' ? offsetY : 0;

	offsetZ = typeof offsetZ !== 'undefined' ? offsetZ : 0;
	if(obj === undefined)
		return;
	this.camera.pinToObject = obj;
	this.camera.pinToObject.pinOffsetX = offsetX;
	this.camera.pinToObject.pinOffsetY = offsetY;
	this.camera.pinToObject.pinOffsetZ = offsetZ;
};

VC.prototype.setPinOffset = function(offsetX, offsetY, offsetZ) {
	if(this.camera.pinToObject != undefined) {
	this.camera.pinToObject.pinOffsetX = offsetX;
	this.camera.pinToObject.pinOffsetY = offsetY;
	this.camera.pinToObject.pinOffsetZ = offsetZ;
	}
};

VC.prototype.unpinCamera = function() {
	this.camera.pinToObject = undefined;
};
VC.prototype.___getCamPosition___ = function() {
	var loc = new Object();
	loc['x'] = this.centerX - this.camera.x;
	loc['y'] = this.centerY - this.camera.y;
	loc['z'] = this.depth;
	return loc;
};

this.getCamera = function(timeline) {
	timeline = typeof timeline !== 'undefined' ? timeline : null;
	if(timeline === null) timeline = exportRoot;
	if(_camera[timeline] == undefined)
	_camera[timeline] = new VC(timeline);
	return _camera[timeline];
}

this.getCameraAsMovieClip = function(timeline) {
	timeline = typeof timeline !== 'undefined' ? timeline : null;
	if(timeline === null) timeline = exportRoot;
	return this.getCamera(timeline).camera;
}
}


// Layer depth API : 

an.Layer = new function() {
	this.getLayerZDepth = function(timeline, layerName)
	{
		if(layerName === "Camera")
		layerName = "___camera___instance";
		var script = "if(timeline." + layerName + ") timeline." + layerName + ".depth; else 0;";
		return eval(script);
	}
	this.setLayerZDepth = function(timeline, layerName, zDepth)
	{
		const MAX_zDepth = 10000;
		const MIN_zDepth = -5000;
		if(zDepth > MAX_zDepth)
			zDepth = MAX_zDepth;
		else if(zDepth < MIN_zDepth)
			zDepth = MIN_zDepth;
		if(layerName === "Camera")
		layerName = "___camera___instance";
		var script = "if(timeline." + layerName + ") timeline." + layerName + ".depth = " + zDepth + ";";
		eval(script);
	}
	this.removeLayer = function(timeline, layerName)
	{
		if(layerName === "Camera")
		layerName = "___camera___instance";
		var script = "if(timeline." + layerName + ") timeline.removeChild(timeline." + layerName + ");";
		eval(script);
	}
	this.addNewLayer = function(timeline, layerName, zDepth)
	{
		if(layerName === "Camera")
		layerName = "___camera___instance";
		zDepth = typeof zDepth !== 'undefined' ? zDepth : 0;
		var layer = new createjs.MovieClip();
		layer.name = layerName;
		layer.depth = zDepth;
		layer.layerIndex = 0;
		timeline.addChild(layer);
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused){
			stageChild.syncStreamSounds();
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;