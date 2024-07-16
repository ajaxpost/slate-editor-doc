import { Editor, Path } from 'slate';
import { EditorType } from '../preset/types';
import { menuConfig } from '../components/ActionMenu/config';

export const onKeyUp = (editorState: EditorType, props) => {
  const { menuShow, actions, setActions, setMenuShow } = props;
  return (event: React.KeyboardEvent) => {
    const slate = editorState.slate;
    if (!slate || !slate.selection) return;
    if (menuShow) {
      const parentPath = Path.parent(slate.selection.anchor.path);
      const string = Editor.string(slate, parentPath);
      if (!string) {
        setMenuShow(false);
        return;
      }
      if (string === '/') {
        setActions(menuConfig);
        return;
      }
      const newActions = actions.filter((o) => o.search.includes(string));
      setActions(newActions);
    }
  };
};
