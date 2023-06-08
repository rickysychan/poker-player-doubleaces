export class Player {
  public betRequest(gameState: any, betCallback: (bet: number) => void): void {
    console.log('Game State: ', gameState);
    try {
      console.log('Hole Cards', gameState.players.find((e) => e.name === 'DoubleAces').hole_cards);
    } catch(error) {
      console.log('Hole Cards', error);
    }
    betCallback(1000);
  }

  public showdown(gameState: any): void {

  }
};

export default Player;
