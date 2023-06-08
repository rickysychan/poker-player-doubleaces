export class Player {
  public betRequest(gameState: any, betCallback: (bet: number) => void): void {
    console.log('Game State: ', gameState);
    betCallback(20);
  }

  public showdown(gameState: any): void {

  }
};

export default Player;
