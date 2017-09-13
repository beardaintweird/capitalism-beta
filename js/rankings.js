var Rankings = (function(){
  return {
    rankings: [],
    assignPositions(){
      let tempArr = [];
      let commonerCount = 0;
      if(this.rankings.length > 4){
        commonerCount = this.rankings.length - 4;
      }
      for(let i = 0, x = this.rankings.length; i < x; i++){
        let obj = {
          player: this.rankings[i].number,
          position: '',
          cardsCanTake: 0,
          order: i,
          turn: false
        }
        switch(i){
          case 0:
            obj.position     = 'President';
            obj.cardsCanTake = 2;
            obj.turn         = true;
            break;
          case 1:
            obj.position     = 'Vice President'
            obj.cardsCanTake = 1;
            break;
          case this.rankings.length - 2:
            obj.position     = 'Scum 1';
            break;
          case this.rankings.length - 1:
            obj.position     = 'Scum 2';
            break;
          default:
            obj.position     = `Commoner ${commonerCount--}`;
        }
        tempArr.push = obj;
      }
      this.rankings = tempArr;
      console.log(this.rankings);
    }
  }
})();
