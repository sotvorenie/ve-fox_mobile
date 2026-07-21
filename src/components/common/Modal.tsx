import React from "react";
import {AnimatePresence, motion} from "framer-motion";

import CloseBtn from "@ui/CloseBtn.tsx";
import Portal from "@common/Portal";

interface ModalProps {
    visible: boolean;
    setVisible: (value: boolean) => void
    closeVisible?: boolean
    closeActive?: boolean
    closeFunc?: () => void
    size?: number
    children: React.ReactNode
}

function Modal({
                   visible,
                   setVisible,
                   closeVisible = true,
                   closeActive = true,
                   closeFunc,
                   size = 600,
                   children,
               }: Readonly<ModalProps>) {
    const close = () => {
        if (!closeActive) return

        closeFunc?.()
        setVisible(false)
    }

    return (
        <AnimatePresence>
            {visible && (
                <Portal>
                    <motion.div
                        className="modal position-absolute flex-center"
                        onClick={close}
                        initial={{opacity: 0}}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="modal__content position-relative"
                            style={{width: `${size / 16}rem`}}
                            onClick={(e) => e.stopPropagation()}
                            initial={{ transform: 'translateY(15px)' }}
                            animate={{ transform: 'translateY(0)' }}
                            exit={{ transform: 'translateY(15px)' }}
                        >
                            {closeVisible && closeActive && (
                                <CloseBtn closeFunc={close}/>
                            )}

                            {children}
                        </motion.div>
                    </motion.div>
                </Portal>
            )}
        </AnimatePresence>
    )
}

export default Modal;