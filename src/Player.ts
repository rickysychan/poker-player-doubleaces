export class Player {
  public betRequest(gameState: any, betCallback: (bet: number) => void): void {
    console.log('Game State: ', gameState);
    console.log('Hole Cards2', gameState.players.find((e) => e.name === 'DoubleAces').hole_cards);
    console.log('Hole Cards3', gameState.players);
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
