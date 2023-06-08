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

        }

        if (highCards.length === 2) {
          this.callAction(gameState);
        }

        betCallback(this.betOnPocketPairs(holeRank, doubleAcePlayer.stack));
        return;
      }
    }

    betCallback(250);
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
};

export default Player;
