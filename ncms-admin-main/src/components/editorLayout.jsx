// Backward-compatible re-export of the NCET design-system kit.
// Pages import layout pieces from "./editorLayout"; everything now lives in
// ./editorKit (the exact NCET design system) and ./shared (media controls).
export {
  T,
  TextField,
  Field,
  Panel,
  AccentIcon,
  SectionHead,
  CountPill,
  IconBtn,
  AddButton,
  EmptyState,
  SubtleCard,
  CardHeader,
  RowCard,
  FileField,
  VideoField,
  EditorHeader,
  TabRail,
  EditorLayout,
  SaveBar,
  EditorLoading,
  EditorPage,
  PrimaryButton,
  GhostButton,
  Callout,
  DataPanel,
  TableActionBtn,
} from "./editorKit";

export {
  getPreviewUrl,
  triggerUpload,
  GlobalUploadModal,
  confirmAction,
  GlobalConfirmModal,
  ImageControl,
  ImageListControl,
  FileControl,
  unwrapDoc,
  unwrapList,
} from "./shared";
