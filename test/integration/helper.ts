/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable max-classes-per-file */

const { ScreepsServer, stdHooks } = require("screeps-server-mockup");

export class IntegrationTestHelper {
  private mockedServer!: MockedServer;

  public get server(): MockedServer {
    return this.mockedServer as MockedServer;
  }

  private mockedUser!: MockedUser;

  public get player(): MockedUser {
    return this.mockedUser as MockedUser;
  }

  public set player(player: MockedUser) {
    this.mockedUser = player;
  }

  public async beforeEach(): Promise<void> {
    this.mockedServer = new ScreepsServer();
    await this.mockedServer.world.reset();

    // Start server
    await this.mockedServer.start();
  }

  public async afterEach(): Promise<void> {
    await this.mockedServer.stop();
  }
}

export const helper = new IntegrationTestHelper();

beforeEach(async () => {
  await helper.beforeEach();
});

afterEach(async () => {
  await helper.afterEach();
});

before(() => {
  (stdHooks as StdHooks).hookWrite();
});

