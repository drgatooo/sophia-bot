import { PermissionFlags, Client, Message } from 'discord.js'; // importamos la flags de permisos
import { CommandType } from './categoryTypes';
export interface Command {
  name: string; // el nombre será un string
  alias: string[]; // las alias serán un array de strings
  userPerms: Array<keyof PermissionFlags>; // los permisos serán un array de permisos
  botPerms: Array<keyof PermissionFlags>; // los permisos serán un array de permisos
  description: string; // la descripcion
  category: CommandType; // la categoria
  run(client: Client, message: Message, args: string[]) // run será un método con el client, message y args
} 