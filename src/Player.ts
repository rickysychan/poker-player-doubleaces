interface Card {
  rank: string,
  suit: string,
}

const FACE_CARDS: string[] = ['10', 'J', 'Q', 'K', 'A'];
  
export class Player {
  public betRequest(gameState: any, betCallback: (bet: number) => void): void {
    console.log('Game State: ', gameState);
    console.log('Hole Cards2', gameState.players.find((e) => e.name === 'DoubleAces').hole_cards);

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
    } else if (community_cards.length >= 3) {
      var bet = this.checkAllCards(gameState, hole_cards, community_cards);
      betCallback(bet);
      return;
    }

    betCallback(250);
  }
  
  public isFlush(hole_cards: Card[], community_cards: Card[]): boolean {
    var combination = hole_cards.concat(community_cards);
    if (combination.length < 5) {
      return false;
    }

    this.sortBySuit(combination);

    return combination[0].suit == combination[4].suit;
  }

  public sortBySuit(cards: Card[]) {
    var i: number, j: number, min_j: number;

    for (i = 0 ; i < cards.length ; i++) {
      min_j = i;   // Assume elem i (h[i]) is the minimum

      for (j = i+1 ; j < cards.length; j++) {
        if ( cards[j].suit < cards[min_j].suit ) {
          min_j = j;    // We found a smaller suit value, update min_j     
        }
      }

      var help = cards[i];
      cards[i] = cards[min_j];
      cards[min_j] = help;
    }

    return cards;
  }

  public checkAllCards(gameState: any, hole_cards: Card[], community_cards: Card[]): number {
    if (this.isFlush(hole_cards, community_cards)) {
      return this.getPlayer(gameState).stack;
    }
    
    return 250; //TODO: Change this!!!
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
    const defaultRaiseAmt = gameState.current_buy_in - gameState.players[gameState.in_action][gameState.bet] + gameState.minimum_raise;
    
    var player = this.getPlayer(gameState);
    if (defaultRaiseAmt <= player.stack) {
      return player.stack;
    } else {
      return defaultRaiseAmt;
    }
  }

  public callAction(gameState: any) {
    const defaultCallAmt = gameState.current_buy_in - gameState.players[gameState.in_action][gameState.bet];

    var player = this.getPlayer(gameState);
    if (defaultCallAmt <= player.stack) {
      return player.stack;
    } else {
      return defaultCallAmt;
    }
  }

  public getPlayer(gameState: any) {
    return gameState.players.find((e) => e.name === 'DoubleAces');
  }
  
  public areSuited(hole_cards) {
    return hole_cards[0].suit === hole_cards[1].suit;
  }
};

export default Player;
