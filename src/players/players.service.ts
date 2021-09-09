import { Player } from './interfaces/player.interface';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);
  private players: Player[] = [];

  async getPlayers(): Promise<Player[]> {
    return this.players;
  }

  async getPlayerByEmail(email: string): Promise<Player> {
    const result = this.players.find((player) => player.email === email);
    if (!result) {
      throw new NotFoundException('Player not found with this email');
    }
    return result;
  }

  async createUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<void> {
    const { email } = createPlayerDto;
    const result = this.players.find((player) => player.email === email);
    if (result) {
      this.update(result, createPlayerDto);
    } else {
      this.create(createPlayerDto);
    }
  }

  private create(createPlayerDto: CreatePlayerDto): void {
    const { name, email, phone } = createPlayerDto;
    const player: Player = {
      _id: uuidv4(),
      name,
      email,
      phone,
      ranking: 'A',
      rankingPosition: 1,
      urlPhotoPlayer: 'www.google.com.br/foto123.jpg',
    };
    this.logger.log(`Creating player: ${JSON.stringify(player)}`);
    this.players.push(player);
  }

  private update(oldPlayer: Player, createPlayerDto: CreatePlayerDto): void {
    const { name } = createPlayerDto;
    oldPlayer.name = name;
  }

  async delete(email: string): Promise<void> {
    const result = this.players.find((player) => player.email === email);
    this.players = this.players.filter(
      (player) => player.email !== result.email,
    );
  }
}
