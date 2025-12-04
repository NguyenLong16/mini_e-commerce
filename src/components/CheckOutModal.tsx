import { useEffect, useState } from "react"
import { CheckOutModalProps } from "../types/checkOutModalProps"
import { CheckCircle, Loader, ScanLine, X } from "lucide-react"

const CheckOutModal = ({ isOpen, onClose, total, onConfirm }: CheckOutModalProps) => {
    const [step, setStep] = useState<'qr' | 'processing' | 'success'>('qr')

    //Reset lại trạng thái mỗi khi mở modal 
    useEffect(() => {
        if (isOpen) {
            setStep('qr')
        }
    }, [isOpen])

    if (!isOpen) return null

    //Giả lập quá trình quét mã
    const handleSimulateScan = () => {
        // Đợi 2 giây giả vờ đang xử lý giao dịch
        setStep('processing')
        setTimeout(() => {
            setStep('success')
            //Chờ thêm một giây để hoàn tất giao dịch
            setTimeout(() => {
                onConfirm()
            }, 1000)
        }, 2000)
    }
    return (
        <>
            <div className="fixed inset-0 bg-black-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="p-8 text-center">
                        {step === 'qr' && (
                            <>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán QR</h2>
                                <p className="text-gray-500 mb-6">
                                    Quét mã bên dưới để thanh toán <b>${total.toFixed(2)}</b>
                                </p>

                                <div className="text-gray-100 p-4 rounded-xl inline-block mb-6 relative group">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Payment_ORDER_${total}`}
                                        alt={'QR Code'}
                                        className="w-48 h-48 mix-blend-multiply"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <ScanLine className="w-48 h-48 text-indigo-500/50 animate-pulse" />
                                    </div>
                                </div>

                                <button
                                    onClick={handleSimulateScan}
                                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold
                                    hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                                >
                                    <ScanLine className="w-5 h-5" />
                                    Giả lập: Đã quét mã
                                </button>
                            </>
                        )}

                        {step === 'processing' && (
                            <div className="py-10">
                                <Loader className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-800">Đang xử lý giao dịch...</h3>
                                <p className="text-gray-500">Vui lòng không tắt trình duyệt</p>
                            </div>
                        )}

                        {step === 'success' && (
                            <div className="py-10 animate-scale-in">
                                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-800">Thanh toán thành công!</h3>
                                <p className="text-gray-500">Cảm ơn bạn đã mua hàng.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default CheckOutModal