import { Plugin } from '../plugins/type';

export function buildPlugins(plugins: Plugin<string>[]) {
  const pluginsMap: Record<string, Plugin<string>> = {};

  plugins.forEach((plugin) => {
    // if (plugin.elements) {
    //   Object.keys(plugin.elements).forEach((type) => {
    //     const element = plugin.elements[type];
    //     const nodeType = element.props?.nodeType;

    //     if (nodeType === 'inline' || nodeType === 'inlineVoid') {
    //       inlineTopLevelPlugins[type] = element;
    //     }
    //   });
    // }

    pluginsMap[plugin.type] = plugin;
  });
  plugins.forEach((plugin) => {
    if (plugin.elements) {
      const elements = { ...plugin.elements };
      pluginsMap[plugin.type] = { ...plugin, elements };
    }
  });

  return pluginsMap;
}

export function buildShortcuts(plugins: Plugin<string>[]) {
  const map: Record<string, unknown> = {};
  plugins.forEach((plugin) => {
    const elements: Record<string, unknown> = {};
    Object.keys(plugin.elements).forEach((key) => {
      const { render, ...element } = plugin.elements[key];
      elements[key] = element;
    });

    const { shortcuts = [] } = plugin.options || {};
    if (shortcuts.length) {
      shortcuts.forEach((shortcut) => {
        map[shortcut] = {
          type: plugin.type,
          elements,
          options: {
            shortcuts,
          },
          create: () => {},
        };
      });
    }
  });
  return map;
}
