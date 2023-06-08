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
        betCallback(this.betOnPocketPairs(holeRank, doubleAcePlayer.stack));
        return;
      }
    }
    // find max bet of a player and call or bet 250
    betCallback(250);
  }

  public showdown(gameState: any): void {
    console.log("showDown", gameState);
  }

  public hasPocketPairs(cards: Card[]) {
    return cards[0].rank === cards[1].rank;
  }

  public betOnPocketPairs(holeRank: string, stack: number): number {
    if (stack === 0) {
      return 0;
    }
    if (FACE_CARDS.includes(holeRank)) {
      return stack;
    } else if (+holeRank > 5 || +holeRank < 10) {
      return stack / 2;
    } else {
      return stack / 4;
    }
  }
};

export default Player;
