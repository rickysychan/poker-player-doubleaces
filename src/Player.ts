interface Card {
  rank: string,
  suit: string,
}

const FACE_CARDS: string[] = ['10', 'J', 'Q', 'K', 'A'];

export class Player {
  public betRequest(gameState: any, betCallback: (bet: number) => void): void {
    console.log('Game State: ', gameState);
    console.log('Hole Cards2', gameState.players.find((e) => e.name === 'DoubleAces').hole_cards);

    try {
      var doubleAcePlayer = gameState.players.find((e) => e.name === 'DoubleAces');
      var hole_cards: Card[] = doubleAcePlayer.hole_cards;
      var community_cards: Card[] = gameState.community_cards;
      if (community_cards.length === 0) {
        if (this.hasPocketPairs(hole_cards)) {
          var holeRank = hole_cards[0].rank;
          betCallback(this.betOnPocketPairs(gameState, holeRank));
          return;
        }

        if (this.hasHighCard(hole_cards)) {
          var highCards = hole_cards.filter((card) => FACE_CARDS.includes(card.rank));
          if (highCards.length === 1) {
            if (this.areSuited(hole_cards)) {
              betCallback(this.callAction(gameState));
            } else {
              betCallback(0);
            }
            return;
          }

          if (highCards.length === 2) {
            betCallback(this.callAction(gameState));
            return;
          }

          betCallback(0);
          return;
        }
        
        if (this.hasLowCards(hole_cards)) {
          if (this.canAffordBet(gameState)) {
            betCallback(this.callAction(gameState));
          } else {
            betCallback(0);
          }
        }
      } else if (community_cards.length >= 3) {
        var bet = this.checkAllCards(gameState, hole_cards, community_cards);
        betCallback(bet);
        return;
      }
    } catch(err) {
      console.log('!!!ERROR: ', err);
    }

    betCallback(250);
  }

  public isFlush(hole_cards: Card[], community_cards: Card[]): boolean {
    const arr = hole_cards.concat(community_cards);
    const results = arr.reduce((obj, item) => {
      obj[item.suit] = obj[item.suit] || 0;
      obj[item.suit]++;       
      return obj;
    }, {});
      
    return results['spades'] == 5 
      || results['hearts'] == 5 
      || results['diamonds'] == 5 
      || results['clubs'] == 5;
  }

  public checkAllCards(gameState: any, hole_cards: Card[], community_cards: Card[]): number {
    var rankToCountMap = this.getRankToCountMap(hole_cards.concat(community_cards));
    if (this.isFourOfAKind(rankToCountMap)) {
      return this.getPlayer(gameState).stack;
    }

    if (this.isFullHouse(rankToCountMap)) {
      return this.getPlayer(gameState).stack;
    }

    if (this.isFlush(hole_cards, community_cards)) {
      return this.getPlayer(gameState).stack;
    }

    if(this.isThreeOfAKind(rankToCountMap)) {
      return this.getPlayer(gameState).stack;
    }

    return this.callAction(gameState); //TODO: Change this!!!
  }

  private getRankToCountMap(cards: Card[]) {
    var rankToCountMap = {};
    cards.forEach(function (card: Card) { rankToCountMap[card.rank] = (rankToCountMap[card.rank] || 0) + 1; });
    return rankToCountMap;
  }

  private isFullHouse(rankToCountMap) {
    var hasThreeCards = false;
    var hasTwoCards = false;
    for (let [k, v] of Object.entries(rankToCountMap)) {
      if (v === 3 && !hasThreeCards) {
        hasThreeCards = true;
      }
      if (v === 2 && !hasTwoCards) {
        hasTwoCards = true;
      }
    }

    console.log("hasThreeCards", hasThreeCards);
    console.log("hasTwoCards", hasTwoCards);
    return hasThreeCards && hasTwoCards;
  }

  private isFourOfAKind(rankToCountMap) {
    var hasFourCards = false;
    for (let [k, v] of Object.entries(rankToCountMap)) {
      if (v === 4 && !hasFourCards) {
        hasFourCards = true;
      }
    }

    console.log("hasFourCards", hasFourCards);
    return hasFourCards;
  }

  private isThreeOfAKind(rankToCountMap) {
    var hasThreeCards = false;
    for (let [k, v] of Object.entries(rankToCountMap)) {
      if (v === 3 && !hasThreeCards) {
        hasThreeCards = true;
      }
    }

    console.log("hasThreeCards", hasThreeCards);
    return hasThreeCards;
  }

  public showdown(gameState: any): void {
    console.log("showDown", gameState);
  }

  public hasPocketPairs(cards: Card[]) {
    return cards[0].rank === cards[1].rank;
  }

  public hasHighCard(cards: Card[]) {
    return FACE_CARDS.includes(cards[0].rank) || FACE_CARDS.includes(cards[1].rank);
  }

  public betOnPocketPairs(gameState: any, holeRank: string): number {
    if (FACE_CARDS.includes(holeRank)) {
      return this.raiseAction(gameState);
    } else {
      return this.callAction(gameState)
    }
  }

  public raiseAction(gameState: any) {
    const defaultRaiseAmt = gameState.current_buy_in - gameState.players[gameState.in_action].bet + gameState.minimum_raise;
    console.log("defaultRaiseAmt", defaultRaiseAmt);
    var player = this.getPlayer(gameState);
    if (defaultRaiseAmt >= player.stack) {
      console.log("Raise Betting: Stack ", player.stack);
      return player.stack;
    } else {
      console.log("Raise Betting: defaultRaiseAmt ", defaultRaiseAmt);
      return defaultRaiseAmt;
    }
  }

  public callAction(gameState: any) {
    
    const defaultCallAmt = gameState.current_buy_in - gameState.players[gameState.in_action].bet;
    console.log("defaultCallAmt", defaultCallAmt);
    var player = this.getPlayer(gameState);
    if (defaultCallAmt >= player.stack) {
      return player.stack;
            console.log("Call Betting: Stack ", player.stack);
    } else {
            console.log("Call Betting: defaultCallAmt ", defaultCallAmt);
      return defaultCallAmt;
    }
  }

  public getPlayer(gameState: any) {
    return gameState.players.find((e) => e.name === 'DoubleAces');
  }

  public areSuited(hole_cards) {
    return hole_cards[0].suit === hole_cards[1].suit;
  }
  
  public hasLowCards(hole_cards) {
    return hole_cards[0].rank <= 4 && hole_cards[1].rank <= 4;
  }

  public canAffordBet(gameState) {
    const defaultCallAmt = gameState.current_buy_in - gameState.players[gameState.in_action][gameState.bet];

    var player = this.getPlayer(gameState);
    if ((player.stack / defaultCallAmt) * 100 <= 5) {
      return true;
    }
  }
};

export default Player;
