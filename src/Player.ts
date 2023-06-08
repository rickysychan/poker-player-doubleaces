export class Player {
  public betRequest(gameState: any, betCallback: (bet: number) => void): void {
    console.log('Game State: ', gameState, gameState.players.find((e) => e.name === 'DoubleAces').hole_cards);
    betCallback(1000);
  }

  public showdown(gameState: any): void {

  }
};

export default Player;
