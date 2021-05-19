var dog,dogImg,dogImg1;
var database;
var food,foodStock;
var lastFed,fedTime;
var feed,addFood;
var foodObj;
var bedroom,garden,washroom;

function preload()
{
  dogImg=loadImage("images/dogImg.png");
  dogImg1=loadImage("images/dogImg1.png");
  bedroom=loadImage("images/Bed Room.png");
  garden=loadImage("images/Garden.png");
  washroom=loadImage("images/Wash Room.png");

}

function setup() { 
  database=firebase.database();
	createCanvas(900, 900);

  foodObj = new Food();

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });

  
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  dog=createSprite(800,250,30,30);
  dog.addImage(dogImg);  
  dog.scale=0.2;

  feed=createButton("Feed The Dog");
  feed.position(100,100);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(130,130);
  addFood.mousePressed(addFoods);
  
}


function draw() {  
  background(46,139,87);

  currentTime=hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }
   else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2)&& curentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("Hungry");
    foodObj.display();
  }


  fedTime=database.ref('feedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  })

  if(gameState !="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(dogImg1)
  }

  fill("black");
   textSize(20);
  if(lastFed >= 12){
    text("Last Fed : " + lastFed%12 + "PM",250,30);
  }
  else if(lastFed==0){
    text("Last Fed : 12 AM",250,30);
  }
  else{
    text("Last Fed : " + lastFed + "AM",250,30);
  } 

  foodObj.display();
  
  drawSprites();

}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}

  function readStock(data){
    foods=data.val();
    foodObj.updateFoodStock(foods);
  }

function feedDog(){
  dog.addImage(dogImg1);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1)
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    feedTime:hour()
  })
}
function addFoods(){
  foods++;
  database.ref('/').update({
    Food:foods
  })
}