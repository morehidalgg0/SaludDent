import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { 
  X, 
  Check, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  Sparkles,
  Building2
} from 'lucide-react';

export function PlanCheckoutModal() {
  const { modals, closeModal, changeSubscriptionPlan } = useClinic();
  const isOpen = modals.planCheckout.isOpen;
  const targetPlan = modals.planCheckout.plan;

  const [paymentMethodType, setPaymentMethodType] = useState('card'); // 'card' | 'mercadopago' | 'transfer'
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4291');
  const [cardHolder, setCardHolder] = useState('Dra. Florencia Rossi');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('883');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !targetPlan) return null;

  const handleConfirm = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      await changeSubscriptionPlan(targetPlan.id, {
        brand: paymentMethodType === 'card' ? 'Visa' : paymentMethodType === 'mercadopago' ? 'Mercado Pago' : 'Transferencia Bancaria',
        last4: paymentMethodType === 'card' ? cardNumber.slice(-4) || '4291' : 'MP',
        holder: cardHolder
      });
      closeModal('planCheckout');
    } catch (err) {
      alert('Error procesando suscripción: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-floating border border-slate-200 w-full max-w-lg overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
              Suscripción Mensual SaaS
            </span>
            <h3 className="font-bold text-base mt-0.5">Contratar {targetPlan.name}</h3>
          </div>
          <button
            onClick={() => closeModal('planCheckout')}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleConfirm} className="p-6 space-y-4">
          
          {/* Plan Summary Box */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 block">{targetPlan.name}</span>
              <span className="text-slate-500 text-[11px]">Facturación recurrente mensual</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-slate-900">${targetPlan.price.toLocaleString('es-AR')}</span>
              <span className="text-slate-500 text-[10px] block">ARS / mes</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Método de Pago
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethodType('card')}
                className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all ${
                  paymentMethodType === 'card'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <CreditCard className="w-4 h-4 mx-auto mb-1" />
                <span>Tarjeta</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethodType('mercadopago')}
                className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all ${
                  paymentMethodType === 'mercadopago'
                    ? 'border-sky-600 bg-sky-600 text-white shadow-2xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Building2 className="w-4 h-4 mx-auto mb-1" />
                <span>Mercado Pago</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethodType('transfer')}
                className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all ${
                  paymentMethodType === 'transfer'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <ShieldCheck className="w-4 h-4 mx-auto mb-1" />
                <span>Transferencia</span>
              </button>
            </div>
          </div>

          {/* Card Form */}
          {paymentMethodType === 'card' && (
            <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Nombre en la Tarjeta</label>
                <input
                  type="text"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Número de Tarjeta</label>
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded outline-hidden font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Vencimiento (MM/AA)</label>
                  <input
                    type="text"
                    required
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Código de Seguridad</label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethodType === 'mercadopago' && (
            <div className="p-3 bg-sky-50 rounded-lg border border-sky-200 text-xs text-sky-900 space-y-1">
              <p className="font-semibold">Débito automático vía Mercado Pago</p>
              <p className="text-[11px] text-sky-800">
                Se debitará automáticamente cada mes mediante tu cuenta de Mercado Pago o tarjetas asociadas.
              </p>
            </div>
          )}

          {paymentMethodType === 'transfer' && (
            <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 text-xs text-slate-800 space-y-1">
              <p className="font-semibold">Abono por Transferencia Bancaria (CBU/Alias)</p>
              <p className="text-[11px] text-slate-600">
                Alias: <strong className="text-slate-900">SALUDCONNECT.MED</strong> • CBU: 0720000000000000000000
              </p>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
            <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Transacción segura y encriptada con estándar bancario TLS 256-bit.</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => closeModal('planCheckout')}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-2xs"
            >
              {isProcessing ? 'Procesando...' : `Confirmar Suscripción por $${targetPlan.price.toLocaleString('es-AR')}/mes`}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
