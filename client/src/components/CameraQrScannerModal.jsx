import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, RefreshCw, Upload, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

const CameraQrScannerModal = ({ isOpen, onClose, onScanSuccess, title = "Scan QR Code", description = "Align QR Code inside the frame to scan automatically" }) => {
    const [cameras, setCameras] = useState([]);
    const [selectedCameraId, setSelectedCameraId] = useState('');
    const [cameraError, setCameraError] = useState('');
    const [isStarting, setIsStarting] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const scannerRef = useRef(null);
    const fileInputRef = useRef(null);

    const containerId = "html5-qr-reader-region";

    useEffect(() => {
        if (!isOpen) {
            stopScanner();
            return;
        }

        let isMounted = true;

        const initCamera = async () => {
            try {
                setCameraError('');
                setIsStarting(true);
                const devices = await Html5Qrcode.getCameras();
                if (!isMounted) return;

                if (devices && devices.length > 0) {
                    setCameras(devices);
                    // Prioritize back/environment camera if available
                    const backCam = devices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('environment') || d.label.toLowerCase().includes('rear'));
                    const defaultId = backCam ? backCam.id : devices[0].id;
                    setSelectedCameraId(defaultId);
                    startScannerWithCamera(defaultId);
                } else {
                    setCameraError("No cameras detected on this device. You can upload an image containing a QR code instead.");
                }
            } catch (err) {
                console.error("Camera detection error:", err);
                setCameraError("Unable to access camera. Please check camera permissions or upload a QR image.");
            } finally {
                if (isMounted) setIsStarting(false);
            }
        };

        initCamera();

        return () => {
            isMounted = false;
            stopScanner();
        };
    }, [isOpen]);

    const stopScanner = async () => {
        if (scannerRef.current) {
            try {
                if (scannerRef.current.isScanning) {
                    await scannerRef.current.stop();
                }
                scannerRef.current.clear();
            } catch (err) {
                console.warn("Error stopping QR scanner:", err);
            }
            scannerRef.current = null;
        }
        setIsScanning(false);
    };

    const handleDecoded = (decodedText) => {
        // Play simple beep if audio context allows
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
        } catch (e) {
            // ignore audio failure
        }

        // Extract code if text is full URL
        let extracted = decodedText.trim();
        try {
            if (extracted.startsWith('http://') || extracted.startsWith('https://')) {
                const url = new URL(extracted);
                const codeParam = url.searchParams.get('code') || url.searchParams.get('seatCode') || url.searchParams.get('passCode') || url.searchParams.get('id');
                if (codeParam) {
                    extracted = codeParam;
                }
            }
        } catch (e) {
            // keep raw
        }

        stopScanner();
        onScanSuccess(extracted, decodedText);
        onClose();
    };

    const startScannerWithCamera = async (cameraId) => {
        await stopScanner();
        setCameraError('');
        setIsStarting(true);

        try {
            const html5QrCode = new Html5Qrcode(containerId);
            scannerRef.current = html5QrCode;

            const qrConfig = {
                fps: 15,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            };

            await html5QrCode.start(
                cameraId ? { deviceId: { exact: cameraId } } : { facingMode: "environment" },
                qrConfig,
                (decodedText) => {
                    handleDecoded(decodedText);
                },
                (errorMessage) => {
                    // Frame scan failed, normal during camera feed
                }
            );

            setIsScanning(true);
        } catch (err) {
            console.error("Failed to start camera scanner:", err);
            setCameraError(err?.message || "Failed to start camera feed. Please check permissions or upload a QR image.");
        } finally {
            setIsStarting(false);
        }
    };

    const handleCameraChange = (e) => {
        const newCamId = e.target.value;
        setSelectedCameraId(newCamId);
        startScannerWithCamera(newCamId);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setCameraError('');
            let html5QrCode = scannerRef.current;
            if (!html5QrCode) {
                html5QrCode = new Html5Qrcode(containerId);
                scannerRef.current = html5QrCode;
            } else if (html5QrCode.isScanning) {
                await html5QrCode.stop();
            }

            const decodedResult = await html5QrCode.scanFile(file, true);
            handleDecoded(decodedResult);
        } catch (err) {
            console.error("QR File scan error:", err);
            setCameraError("No readable QR Code found in this image. Please try another clearer image.");
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col relative text-white">
                {/* Header */}
                <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black">
                            <Camera className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white">{title}</h3>
                            <p className="text-xs text-slate-400">{description}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        title="Close Scanner"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Viewport & Video Frame */}
                <div className="p-6 flex flex-col items-center justify-center">
                    {/* Scanner Region */}
                    <div className="relative w-full max-w-[340px] aspect-square rounded-2xl overflow-hidden bg-slate-950 border-2 border-emerald-500/40 shadow-inner flex items-center justify-center">
                        <div id={containerId} className="w-full h-full object-cover"></div>

                        {/* Scanner Laser Animation */}
                        {isScanning && (
                            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
                                <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] animate-bounce"></div>
                                <div className="flex justify-between items-center text-[11px] font-mono text-emerald-400/80 bg-slate-950/60 px-3 py-1 rounded-full mx-auto backdrop-blur-sm border border-emerald-500/30">
                                    <Sparkles className="w-3 h-3 mr-1 text-emerald-400 animate-spin" /> Live Auto-Detect
                                </div>
                            </div>
                        )}

                        {isStarting && (
                            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center gap-2 text-slate-400 text-sm">
                                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                                <span>Starting camera feed...</span>
                            </div>
                        )}
                    </div>

                    {/* Camera Error / Help */}
                    {cameraError && (
                        <div className="mt-4 p-3 w-full bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{cameraError}</span>
                        </div>
                    )}

                    {/* Camera Selector Switcher */}
                    {cameras.length > 1 && (
                        <div className="w-full mt-4 flex items-center gap-2">
                            <label className="text-xs text-slate-400 whitespace-nowrap">Camera:</label>
                            <select
                                value={selectedCameraId}
                                onChange={handleCameraChange}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                            >
                                {cameras.map((cam) => (
                                    <option key={cam.id} value={cam.id}>
                                        {cam.label || `Camera ${cam.id}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Alternate: Upload QR Image */}
                    <div className="w-full mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all border border-slate-700 hover:border-slate-600 shadow-sm"
                        >
                            <Upload className="w-4 h-4 text-emerald-400" />
                            Upload Image / Screenshot of QR
                        </button>
                    </div>
                </div>

                {/* Footer Guide */}
                <div className="px-6 py-3.5 bg-slate-950/60 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Fast Auto-Focus Decoded
                    </span>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CameraQrScannerModal;
