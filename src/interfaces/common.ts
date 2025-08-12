export type VoidFn = () => void;

export interface IModalProps {
  isOpen: boolean;
  onModalClose: VoidFn;
}
