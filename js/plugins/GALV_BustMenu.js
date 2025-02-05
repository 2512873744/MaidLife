//-----------------------------------------------------------------------------
//  Galv's Bust Menu
//-----------------------------------------------------------------------------
//  For: RPGMAKER MV
//  GALV_BustMenu.js
//-----------------------------------------------------------------------------
//  2015-11-07 - Version 1.0 - release
//-----------------------------------------------------------------------------
// Terms can be found at:
// galvs-scripts.com
//-----------------------------------------------------------------------------

var Imported = Imported || {};
Imported.Galv_BustMenu = true;

var Galv = Galv || {};        // Galv's main object
Galv.BM = Galv.BM || {};      // Galv's stuff

//-----------------------------------------------------------------------------
/*:
 * @plugindesc Changes the default actor layout in the main menu to use
 * vertical "bust" or portrait graphics from /img/pictures/
 * @author Galv - galvs-scripts.com
 *
 * @param Menu Actors
 * @desc Number of actors that appear in the menu before scrolling
 *
 * @default 3
 *
 * @param Name
 * @desc Line number of actor's name
 *
 * @default 1
 *
 * @param Class
 * @desc Line number of actor's class
 *
 * @default 2
 *
 * @param Level
 * @desc Line number of actor's level
 *
 * @default 3
 *
 * @param States
 * @desc Line number of actor's state icons
 *
 * @default 13
 *
 * @param Bars
 * @desc Line number of actor's hp/mp bars
 *
 * @default 14
 *
 * @param Bust Y
 * @desc Y position of the bust image in pixels
 *
 * @default 100
 *
 * @param Bust Height
 * @desc Height of the bust image in pixels
 *
 * @default 360
 *
 * @param hpDrawFlg
 * @desc hpDraw? No -> 0 yes -> 1 (2019/4/18 add)
 * default 1
 *
 * @param MpDrawFlg
 * @desc MpDraw? No -> 0 yes -> 1 (2017/6/9 add)
 * default 1
 *
 * @param TpDrawFlg
 * @desc TpDraw? No -> 0 yes -> 1 (2017/6/9 add)
 * default 1
 *
 * @param hpGagePatern
 * @desc hpGagePatern Normal -> 0 Heart -> 1 (2019/4/22 add)
 * default 0
 *
 * @param -----------
 * @desc
 *
 * @default
 *
 * @param Bust Offsets
 * @desc See the help section for how to use this.
 *
 * @default
 *
 * @help
 *   Galv's Bust Menu
 * ----------------------------------------------------------------------------
 * This plugin changes the layout of actors in the main menu. The plugin
 * includes settings that allow you to change the positioning of the actor
 * data (such as name, level, hp, image, etc.) including how many actors will
 * appear on the menu screen. (NOTE: 1 actor is not working)
 *
 * The plugin displays bust images from /img/pictures/ folder based on the
 * actor's face.  For example:
 * If an actor uses the 2nd face from the "Actor1" faces file, then the bust
 * will instead use /img/pictures/Actor1_2.png bust image.
 *
 * ----------------------------------------------------------------------------
 *   Bust Offsets (Scroll down the plugin settings to see this)
 * ----------------------------------------------------------------------------
 * Bust images are centered in the actor positions, but sometimes the bust
 * images are not centered themselves. This setting is used to tweak the x,y
 * position of busts if required.
 * To add an x,y offset to busts, add data to this setting as below:
 *
 *     bustImageName_1,x,y|bustImageName_2,x,y|bustImageName_3,x,y
 *
 * Each image and data are separated by a pipe (the "|" symbol). For example:
 * Actor1_2,-10,0|Actor1_5,20,5
 * The Actor1_2.png bust will be offset 10 pixels to the left
 * The Actor1_5.png bust will be offset 20 pixels to the right, 5 pixels down
 * ----------------------------------------------------------------------------
 *
 */


//-----------------------------------------------------------------------------
//  CODE STUFFS
//-----------------------------------------------------------------------------

(function() {	

Galv.BM.a = Number(PluginManager.parameters('Galv_BustMenu')["Menu Actors"]);
Galv.BM.name = Number(PluginManager.parameters('Galv_BustMenu')["Name"] - 1);
Galv.BM.class = Number(PluginManager.parameters('Galv_BustMenu')["Class"] - 1);
Galv.BM.level = Number(PluginManager.parameters('Galv_BustMenu')["Level"] - 1);
Galv.BM.bars = Number(PluginManager.parameters('Galv_BustMenu')["Bars"] - 1);
Galv.BM.icons = Number(PluginManager.parameters('Galv_BustMenu')["States"] - 1);
Galv.BM.bust = Number(PluginManager.parameters('Galv_BustMenu')["Bust Y"]);
Galv.BM.bustHeight = Number(PluginManager.parameters('Galv_BustMenu')["Bust Height"]);
/*↓add start 2017/6/17↓*/
Galv.BM.MpDrawFlg = Number(PluginManager.parameters('Galv_BustMenu')["MpDrawFlg"]);
Galv.BM.TpDrawFlg = Number(PluginManager.parameters('Galv_BustMenu')["TpDrawFlg"]);
/*↓add start 2019/4/18↓*/
Galv.BM.hpDrawFlg = Number(PluginManager.parameters('Galv_BustMenu')["hpDrawFlg"]);
/*↓add start 2019/4/22↓*/
Galv.BM.hpPeternNo = Number(PluginManager.parameters('Galv_BustMenu')["hpGagePatern"]);

Galv.BM.offsets = function() {
	var array = PluginManager.parameters('Galv_BustMenu')["Bust Offsets"].split("|");
	var obj = {};
	for (i = 0; i < array.length; i++) {
		if (array[i]) {
			var data = array[i].split(",");
			obj[data[0]] = [Number(data[1]),Number(data[2])];
		};
	};
	return obj;
}();


// OVERWRITE
Window_MenuStatus.prototype.numVisibleRows = function() {
    return 1;
};
Window_MenuStatus.prototype.maxCols = function() {
    return Galv.BM.a;
};
Window_Selectable.prototype.spacing = function() {
    return 0;
};

Window_MenuStatus.prototype.drawItemStatus = function(index) {
    var actor = $gameParty.members()[index];
    var rect = this.itemRect(index);
    var x = rect.x;
    var y = rect.y;
    var width = rect.width - x - this.textPadding();
    this.drawActorSimpleStatus(actor, x, y, width);
};


// OVERWRITE
Window_MenuStatus.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
    var lineHeight = this.lineHeight();
	var width = this.bustWidth();
	var x = x + 5;
    var width2 = Math.max(100, width - this.textPadding());
    this.drawActorName(actor, x, y + lineHeight * Galv.BM.name);
    //this.drawActorLevel(actor, x, y + lineHeight * Galv.BM.level);
    this.drawActorIcons(actor, x, y + lineHeight * Galv.BM.icons );
    this.drawActorClass(actor, x, y + lineHeight * Galv.BM.class, width2);
    if(Galv.BM.hpDrawFlg === 1)	
    {
    	if( Galv.BM.hpPeternNo === 0)
			this.drawActorHp(actor, x, y + lineHeight * (Galv.BM.bars + 1 ), width2);//add 2019/4/18
			
		else
			this.drawActorHeart(actor, x, y + lineHeight * (Galv.BM.bars + 1 ), width2);//add 2019/4/22
	}
		
    if(Galv.BM.MpDrawFlg === 1)													//add 2017/6/17
    	this.drawActorMp(actor, x, y + lineHeight * (Galv.BM.bars + 2), width2);
    
    if(Galv.BM.TpDrawFlg === 1)													//add 2017/6/17
    {
		if (Imported.YEP_CoreEngine && eval(Yanfly.Param.MenuTpGauge)) {
			this.drawActorTp(actor, x, y + lineHeight * (Galv.BM.bars + 2), width2);
		}
	}
	
};


Window_MenuStatus.prototype.drawFace = function(faceName, faceIndex, x, y, width, height) {
    var width = this.bustWidth();

	var bustName = faceName + "_" + (faceIndex + 1)
	var bitmap = ImageManager.loadPicture(bustName);
	var ox = 0;
	var oy = 0;
	if (Galv.BM.offsets[bustName]) {
		ox = Galv.BM.offsets[bustName][0] || 0;
		oy = Galv.BM.offsets[bustName][1] || 0;
	};
	
    var sw = width;
    var sh = Galv.BM.bustHeight;
    var dx = x - 1;
    var dy = y + Galv.BM.bust;
    var sx = bitmap.width / 2 - width / 2 - ox;
    var sy = oy;
    this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
};

Window_MenuStatus.prototype.bustWidth = function() {
    return Math.floor((this.width - (this.standardPadding() * 2)) / this.maxCols());
};


Window_MenuStatus.prototype.cursorDown = function(wrap) {
    var index = this.index();
    var maxItems = this.maxItems();
    var maxCols = this.maxCols();
    if (index < maxItems - maxCols || (wrap && maxCols === 1)) {
        this.select((index + maxCols) % maxItems);
	} else {
		this.select(maxItems - 1);
    }
};


Window_MenuStatus.prototype.cursorUp = function(wrap) {
    var index = this.index();
    var maxItems = this.maxItems();
    var maxCols = this.maxCols();
    if (index >= maxCols || (wrap && maxCols === 1)) {
        this.select((index - maxCols + maxItems) % maxItems);
	} else {
		this.select(0);
    }
};

/**
 * hpHeart
 */
Window_MenuStatus.prototype.drawActorHeart = function(actor, x, y, width)
{
	this.drawHeart(actor, x, y);
}

/**
 * drawHeart
 */
Window_MenuStatus.prototype.drawHeart = function(actor, x, y)
{
	var varHertCnt = actor.mhp / 100;
	var varHp = actor.hp;
	var varLoadHertName = "ハート_0";
	
	var ans = varHp;
	
	//先行ロード
	for(i = 0; i < 5; i++)
	{
		var bitmap = ImageManager.loadSystem( "ハート_" + i);
		this.contents.blt( bitmap, 0, 0, 24, 20, x, y );
	}
	
	var bitmap = ImageManager.loadSystem( "ハート_0");
	this.contents.blt( bitmap, 0, 0, 24, 20, x, y );
	
	for(var i = 0; i < varHertCnt; i++)
	{
		//75以上はハート満タン
		if(ans >= 75)
		{
			varLoadHertName = "ハート_4";
			//alert("減ってない");
		}
		//50以上はハート3/4
		else if( ans >= 50) 
		{
			varLoadHertName = "ハート_3";
			//alert("3/4");
		}
		//25以上は2/4
		else if(ans >= 25)
		{
			varLoadHertName = "ハート_2";
			//alert("2/4");
		}
		//0以上は1/4
		else if(ans > 0)
		{
			varLoadHertName = "ハート_1";
			//alert("1/4");
		}
		
		//0未満の時は空
		else
		{
			varLoadHertName = "ハート_0";
			//alert("0/4");
		}
		
		var bitmap = ImageManager.loadSystem( varLoadHertName );
		//this.contents.blt( bitmap, 0, 0, 24, 20, 14 + 24 * i, 30 );
		this.contents.blt( bitmap, 0, 0, 24, 20, x + (24 * i), y );
		ans -= 100;						//100づつ減らしていく
	}
}

})();