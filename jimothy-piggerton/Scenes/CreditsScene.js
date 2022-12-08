class CreditsScene extends Scene{
  constructor(playIntro){
    super(playIntro);
    this.keyMap = {
      '32': { down: this.pressButton.bind(this), up: this.unpressButton.bind(this) }, //space
      '13': { down: this.pressButton.bind(this), up: this.unpressButton.bind(this) }, //enter

      '27': {down: this.safeButtonCall(this,this.goToMainMenu)},   //esc
    }
    this.memberNames = ["Brian Dizon",
                        "Christian Gramling",
                        "Kyle Wong",
                        "Kristen Campbell",
                        "Taylor Poppoff",
                        "TJ Hanson",
                        "Muhammad Albayati",];
    this.memberRoles = ["Project Lead",
                        "Programming & Design",
                        "Programming",
                        "Music & Audio",
                        "Art",
                        "Programming",
                        "Programming"];
    this.addCreditsGUI();
    this.nameLabels = getGUIInGroup(2,this.gui);
    this.roleLabels = getGUIInGroup(3,this.gui);
    moveAllGUI(-.7,0,this.nameLabels);
    moveAllGUI(.7,0,this.roleLabels);
    this.creditsTimer = 0;
    this.initialDelay = 15;
    this.delayBetween = 8;
    this.labelVelocity = 0.08;
    this.endDistanceFromCenter = .03;   //distance around center where credit entries should go
                                        //Not actually accurate but decreasing this moves both sides closer
                                        //and increasing it moves them away from the center.
  }

  update(dt){
    super.update(dt);
    this.updateCreditsLabels(dt);
  }
  draw(canvas){
    canvas.fillStyle = 'black';
    canvas.fillRect(0,0,canvas.width,canvas.height);
    this.drawAllGUI(canvas);
  }
  updateCreditsLabels(dt){
    //controls which labels should be moved every frame
    //There is an initial delay where no labels are moving
    //After that, every delayBetween duration allows one more row to begin
    //moving to the center.
    this.creditsTimer += dt;
    if(this.creditsTimer > this.initialDelay){
      for(var i = 0; i < this.memberNames.length; i++){
        if(this.creditsTimer > this.initialDelay+i*this.delayBetween){
          this.moveCreditsEntry(this.nameLabels[i],'right',dt);
          this.moveCreditsEntry(this.roleLabels[i],'left',dt);
        }
      }
    }
  }
  moveCreditsEntry(label,direction,dt){
    //Moves label until it is within endDistanceFromCenter distance from center of screen
    //Speed scales with distance to destination.
    switch(direction){
      case 'left':
        var distance = label.x-(0.5+this.endDistanceFromCenter);
        if(label.x + dt*(-this.labelVelocity)*distance < 0.5 + this.endDistanceFromCenter){
          label.x = 0.5+this.endDistanceFromCenter;
        } else {
          label.x -= dt*this.labelVelocity*distance;
        }
        break;
      case 'right':
        var distance = 0.5-this.endDistanceFromCenter-(label.x+label.w);
        if(label.x+label.w + dt*(this.labelVelocity)*distance > 0.5-this.endDistanceFromCenter){
          label.x = 0.5-label.w-this.endDistanceFromCenter;;
        } else {
          label.x += dt*this.labelVelocity*distance;
        }
        break;
    }
  }
  addCreditsGUI(){
    var textColor = 'white';
    var titleFont = '60px ' + FONT;
    var creditsFont = '30px ' + FONT;
    this.leftRefObject = new GUIElement(-0.5,0.5,0,0,0);
    this.rightRefObject = new GUIElement(1.5,0.5,0,0,0);

    var dim = rectDimFromCenter(0.5,.1,.4,.2);
    var creditsTitle = new Label(dim[0],dim[1],dim[2],dim[3],
      1,"Credits",titleFont,textColor,'center');
    this.gui.push(creditsTitle);

    dim = rectDimFromCenter(0.6,0.9,.1,.1);
    var backButton = new TextButton(dim[0],dim[1],dim[2],dim[3],
      4,this.goToMainMenu.bind(this),"Back",creditsFont,textColor,
      'transparent',textColor,3);
    this.gui.push(backButton);

    var labelWidth = 0.3;
    var labelGap = 0.6/this.memberNames.length;   //This controls how far down the credit entries should go.
    var labelHeight = labelGap-0.05;
    var origin = [0.5,0.25];                      //origin[1] is height that the credit entires begin drawing
    for(var i = 0; i < this.memberNames.length; i++){
      dim = rectDimFromCenter(origin[0]-0.05,origin[1]+(i*labelGap),labelWidth,labelHeight);
      var memberLabel = new Label(dim[0],dim[1],dim[2],dim[3],
        2,this.memberNames[i],creditsFont,textColor,'right');
      this.gui.push(memberLabel);

      dim = rectDimFromCenter(origin[0]+0.05,origin[1]+(i*labelGap),labelWidth,labelHeight);
      var memberRole = new Label(dim[0],dim[1],dim[2],dim[3],
        3,this.memberRoles[i],creditsFont,textColor,'left');
      this.gui.push(memberRole);
    }

    this.selectedButton = backButton;
    backButton.selected = true;
    //backbutton intentionally has no neighbors
    this.buttons = getButtons(this.gui);
  }
  goToMainMenu(){
    this.driver.setScene(new MenuScene(false));
  }
}