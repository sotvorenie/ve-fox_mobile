import {useState} from "react";
import Cropper from "react-easy-crop";

import ButtonUi from "@ui/ButtonUi.tsx";
import Portal from "@common/Portal.tsx";

import ZoomPlusIcon from "@icons/ZoomPlusIcon.tsx";
import ZoomMinusIcon from "@icons/ZoomMinusIcon.tsx";

interface Props {
    selectedFile: File
    setCroppedAreaPixels: (pixels: any) => void
    setSelectedFile: (selectedFile: File | null) => void
    updateAvatar: () => Promise<void>
    isLoading: boolean
}

function SettingsCropAvatar({
                                selectedFile,
                                setCroppedAreaPixels,
                                setSelectedFile,
                                updateAvatar,
                                isLoading
}: Readonly<Props>) {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)

    const handleZoomChange = (value: number) => {
        setZoom(Number(value.toFixed(1)))
    }

    return (
        <Portal>
            <div className="crop position-absolute w-100 h-100 flex-center">
                <div className="crop__inner position-relative">
                    <Cropper image={URL.createObjectURL(selectedFile)}
                             crop={crop}
                             zoom={zoom}
                             aspect={1}
                             onCropChange={setCrop}
                             onZoomChange={setZoom}
                             onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
                    />

                    <div className="crop__settings position-absolute h-100">
                        <div className="crop__zoom-info text-center">
                            {zoom}
                        </div>

                        <button className="crop__zoom-btn plus recolor-svg button-width-svg hover-color-accent radius-50 flex-center"
                                type="button"
                                onClick={() => handleZoomChange(Math.min(zoom + 0.1, 5))}
                                title="Приблизить камеру"
                        >
                            <ZoomPlusIcon/>
                        </button>

                        <input className="crop__zoom"
                               type="range"
                               value={zoom}
                               min={1}
                               max={5}
                               step={0.1}
                               onChange={(e) => handleZoomChange(Number(e.target.value))}
                        />

                        <button className="crop__zoom-btn minus recolor-svg button-width-svg hover-color-accent radius-50 flex-center"
                                type="button"
                                onClick={() => handleZoomChange(Math.max(zoom - 0.1, 1))}
                                title="Отдалить камеру"
                        >
                            <ZoomMinusIcon/>
                        </button>
                    </div>

                    <div className="crop__btn-bar position-absolute row gap-10">
                        <ButtonUi className="col-6"
                                  func={updateAvatar}
                                  isLoading={isLoading}
                        >
                            Сохранить
                        </ButtonUi>
                        <ButtonUi className="col-6"
                                  func={() => setSelectedFile(null)}
                                  isLoading={isLoading}
                        >
                            Отмена
                        </ButtonUi>
                    </div>
                </div>
            </div>
        </Portal>
    )
}

export default SettingsCropAvatar;