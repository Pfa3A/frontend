import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import QRCodeLib from "qrcode";


const PaymentSuccessPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const qrCodes = (location.state as { qrCodes: string[] } | undefined)?.qrCodes || [];



    if (!qrCodes) {
        return (
            <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-sky-50 via-white to-blue-100 flex items-center justify-center px-4">
                <div className="w-full max-w-md rounded-2xl bg-white/95 shadow-md border border-slate-200 p-6 text-center space-y-4">
                    <h2 className="text-xl font-semibold text-slate-900">
                        Aucun ticket trouvé
                    </h2>
                    <p className="text-sm text-slate-500">
                        Il semble qu&apos;aucun ticket ne soit disponible pour cette page.
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="inline-flex items-center justify-center rounded-full bg-[#0071BC] px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#005c96] transition"
                    >
                        Retour à l&apos;accueil
                    </button>
                </div>
            </div>
        );
    }

    const downloadPdf = async () => {
        const doc = new jsPDF();

        for (let i = 0; i < qrCodes.length; i++) {
            const qrValue = qrCodes[i];
            const qrDataURL = await QRCodeLib.toDataURL(qrValue, {
                width: 256,
                margin: 1,
                errorCorrectionLevel: "H",
            });

            if (i > 0) doc.addPage(); 
            doc.setFontSize(20);
            doc.text(`Ticket  #${i + 1}`, 20, 20);
            doc.addImage(qrDataURL, "PNG", 20, 40, 50, 50);
        }

        doc.save(`tickets.pdf`);
    };


    return (
        <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-sky-50 via-white to-blue-100 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-2xl space-y-6">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
                            🎉 Paiement réussi
                        </h1>
                        <p className="text-sm text-slate-500">
                            Votre ticket est prêt. Vous pouvez le télécharger ou le retrouver
                            dans votre espace client.
                        </p>
                    </div>

                    <div className="inline-flex items-center rounded-full bg-emerald-50 px-4 py-1 text-xs font-medium text-emerald-700 border border-emerald-100">
                        Étape 3 : Confirmation
                    </div>
                </header>

                {/* Ticket Card */}
                <section className="rounded-2xl border border-slate-200 bg-white/95 shadow-md p-6 md:p-7 flex flex-col lg:flex-row gap-6">


                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {qrCodes.map((qr, index) => (
                            <div key={index} className="flex flex-col items-center gap-2 bg-sky-50/70 p-4 rounded-xl">
                                <span className="text-xs font-medium text-slate-600">Ticket #{index + 1}</span>
                                <QRCodeCanvas value={qr} size={150} includeMargin level="H" />
                            </div>
                        ))}
                    </div>

                </section>

                {/* Actions */}
                <div className="flex flex-wrap justify-end gap-3">
                    <button
                        onClick={downloadPdf}
                        className="inline-flex items-center justify-center rounded-full bg-[#0071BC] px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#005c96] transition"
                    >
                        📥 Télécharger le ticket (PDF)
                    </button>

                    <button
                        onClick={() => navigate("/client/tickets")}
                        className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition"
                    >
                        Voir tous mes tickets
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;