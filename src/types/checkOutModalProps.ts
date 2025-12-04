export interface CheckOutModalProps {
    isOpen: boolean,
    onClose: () => void
    total: number,
    onConfirm: () => void
}