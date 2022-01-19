import { PermissionFlags, Client, Interaction } from 'discord.js'; // importamos la flags de permisos

export interface Command {
  userPerms: Array<keyof PermissionFlags>; // los permisos serán un array de permisos
  botPerms: Array<keyof PermissionFlags>; // los permisos serán un array de permisos
  category: string, // La categoria sera un string
  run(client: Client, interaction: Interaction) // run será un método con el client, message y args
} 