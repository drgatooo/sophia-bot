import { PermissionFlags, Client, Interaction } from 'discord.js'; // importamos la flags de permisos
import { CommandType } from './categoryTypes';

export interface Command {
  name: string; // el nombre será un string
  alias: string[]; // las alias serán un array de strings
  userPerms: Array<keyof PermissionFlags>; // los permisos serán un array de permisos
  botPerms: Array<keyof PermissionFlags>; // los permisos serán un array de permisos
  description: string; // la descripcion
  usage: string; // el uso
  category: CommandType; // la categoria
  run(client: Client, interaction: Interaction) // run será un método con el client, message y args
} 