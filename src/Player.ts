export class Player {
  public betRequest(gameState: any, betCallback: (bet: number) => void): void {
    betCallback(20);
  }

  public showdown(gameState: any): void {

  }
};

export default Player;
