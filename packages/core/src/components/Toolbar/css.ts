import { css } from '@emotion/css';

const divider = css`
  margin-left: 8px;
  color: #585a5a;
  flex-shrink: 0;
  display: inline-flex;
  width: 1px;
  height: 24px;
  background: #f4f5f5;
`;
const widget = css`
  margin-left: 8px;
  color: #585a5a;
  flex-shrink: 0;
  &[data-actived='true'] {
    color: rgba(0, 0, 0, 0.88);
    background: rgba(0, 0, 0, 0.06);
  }
`;

const btn = css`
  min-width: 26px;
  height: 26px;
  // border-radius: 6px;
  padding: 0;
  border: none;
  background: transparent;
  &[data-actived='true'] {
    color: rgba(0, 0, 0, 0.88);
    background: rgba(0, 0, 0, 0.06);
  }
`;

const icon = css`
  color: #00b96b;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 1em;
  height: 1em;
  font-size: 16px;
`;

export { divider, widget, btn, icon };
