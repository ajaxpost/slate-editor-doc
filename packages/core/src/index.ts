import SlateEditor from "./SlateEditor";

export * from "./preset/types";

export * from "./plugins/type";

export * from "./plugins/createEditorPlugin";

export * from "./utils/generateId";

export { buildBlockElement } from "./utils/editorBuilders";

export { useReadOnly, useEditorState } from "./context/editor-context";

export default SlateEditor;
