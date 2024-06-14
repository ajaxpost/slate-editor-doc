import { Plugin } from './type';

export class EditorPlugin<TKeys extends string> {
  private readonly plugin: Plugin<TKeys>;

  constructor(plugin: Plugin<TKeys>) {
    this.plugin = plugin;
  }

  get getPlugin() {
    return this.plugin;
  }
}
