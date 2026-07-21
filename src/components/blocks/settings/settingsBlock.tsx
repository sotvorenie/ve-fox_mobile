import React from "react";
import {AnimatePresence, motion} from "framer-motion";

import CloseBtn from "@ui/CloseBtn.tsx";

interface Props {
    isVisible: boolean
    children: React.ReactNode;
    setIsVisible: (value:boolean) => void;
}

const Title = ({ children }: { children: React.ReactNode }) => (
    <p className="settings__title h5 mb-20">{children}</p>
)

const Content = ({ children, className }: { children: React.ReactNode, className: string }) => (
    <div className={`settings__content ${className}`}>{children}</div>
)

function SettingsBlock({children, isVisible, setIsVisible}: Readonly<Props>) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className={`settings__block absolute-center`}
                    onClick={(e) => e.stopPropagation()}
                    initial={{opacity: 0}}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <CloseBtn closeFunc={() => setIsVisible(false)}/>

                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

SettingsBlock.Title = Title
SettingsBlock.Content = Content

export default SettingsBlock;