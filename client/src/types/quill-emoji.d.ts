declare module 'quill-emoji' {
  import Quill from 'quill';

  // These modules don't currently have official TypeScript types. We use `any`
  // for now so that the rest of the app can compile without errors.
  export const EmojiBlot: any;
  export const ShortNameEmoji: any;
  export const ToolbarEmoji: any;

  const _default: any;
  export default _default;
}
