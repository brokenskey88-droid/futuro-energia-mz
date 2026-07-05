import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../../lib/store';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card } from '../../components/ui/card';
import { toast } from 'sonner';
import { Wallet, ArrowUpCircle, ArrowDownCircle, History, Upload, CheckCircle2, Clock, XCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Finance() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'deposit';
  
  const { currentUser, createDeposit, createWithdrawal, transactions } = useStore();
  const userTransactions = transactions.filter(t => t.userId === currentUser?.id).reverse();

  const [depositAmount, setDepositAmount] = useState('');
  const [depositMethod, setDepositMethod] = useState<'mpesa' | 'emola'>('mpesa');
  const [proofImage, setProofImage] = useState<string | null>(null);

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'mpesa' | 'emola'>('mpesa');

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error('Insira um valor válido');
      return;
    }
    if (!proofImage) {
      toast.error('Carregue o comprovativo do depósito');
      return;
    }
    createDeposit(parseFloat(depositAmount), depositMethod, proofImage);
    toast.success('Pedido de depósito enviado! Aguarde a aprovação.');
    setDepositAmount('');
    setProofImage(null);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (!withdrawAmount || amount <= 0) {
      toast.error('Insira um valor válido');
      return;
    }
    const error = createWithdrawal(amount, withdrawMethod);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Pedido de levantamento enviado!');
      setWithdrawAmount('');
    }
  };

  const simulateFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app we'd upload to storage. Here we just use a placeholder string.
      setProofImage('https://via.placeholder.com/150?text=Comprovativo');
      toast.success('Imagem carregada com sucesso');
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500 font-medium">Saldo Disponível</span>
          <h3 className="text-2xl font-bold text-slate-900">{currentUser?.balance.toFixed(2)} MT</h3>
        </div>
        <div className="p-3 bg-green-50 text-green-600 rounded-full">
          <Wallet size={24} />
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={(val) => setSearchParams({ tab: val })} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 rounded-xl h-12">
          <TabsTrigger value="deposit" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Depósito</TabsTrigger>
          <TabsTrigger value="withdraw" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Levantar</TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Histórico</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            <TabsContent value="deposit">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="p-5 border-none shadow-sm space-y-6">
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
                      <Info className="text-blue-600 shrink-0" size={20} />
                      <div className="text-xs text-blue-800 leading-relaxed">
                        Envie o valor para o número: <br/>
                        <span className="font-bold text-sm">840000000 (M-Pesa)</span> ou <br/>
                        <span className="font-bold text-sm">860000000 (e-Mola)</span>. <br/>
                        Depois carregue o comprovativo abaixo.
                      </div>
                    </div>

                    <form onSubmit={handleDeposit} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Método de Depósito</Label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setDepositMethod('mpesa')}
                            className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                              depositMethod === 'mpesa' ? 'border-green-600 bg-green-50 text-green-700' : 'border-slate-100 text-slate-500'
                            }`}
                          >
                            M-Pesa
                          </button>
                          <button
                            type="button"
                            onClick={() => setDepositMethod('emola')}
                            className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                              depositMethod === 'emola' ? 'border-orange-600 bg-orange-50 text-orange-700' : 'border-slate-100 text-slate-500'
                            }`}
                          >
                            e-Mola
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="amount">Valor (MT)</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="Ex: 500"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Comprovativo</Label>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={simulateFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className={`p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors ${
                            proofImage ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-slate-50'
                          }`}>
                            {proofImage ? (
                              <>
                                <CheckCircle2 className="text-green-500" size={32} />
                                <span className="text-xs font-medium text-green-600">Comprovativo Carregado</span>
                              </>
                            ) : (
                              <>
                                <Upload className="text-slate-400" size={32} />
                                <span className="text-xs text-slate-500">Clique para carregar imagem</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 h-12 font-bold mt-2">
                        Enviar Pedido
                      </Button>
                    </form>
                  </div>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="withdraw">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="p-5 border-none shadow-sm space-y-6">
                  <form onSubmit={handleWithdraw} className="space-y-6">
                    <div className="space-y-2">
                      <Label>Método de Levantamento</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setWithdrawMethod('mpesa')}
                          className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                            withdrawMethod === 'mpesa' ? 'border-green-600 bg-green-50 text-green-700' : 'border-slate-100 text-slate-500'
                          }`}
                        >
                          M-Pesa
                        </button>
                        <button
                          type="button"
                          onClick={() => setWithdrawMethod('emola')}
                          className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                            withdrawMethod === 'emola' ? 'border-orange-600 bg-orange-50 text-orange-700' : 'border-slate-100 text-slate-500'
                          }`}
                        >
                          e-Mola
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="w-amount">Valor a Levantar (MT)</Label>
                      <Input
                        id="w-amount"
                        type="number"
                        placeholder="Mínimo 100 MT"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                      />
                      <p className="text-[10px] text-slate-400">Taxa de processamento: 0%</p>
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-12 font-bold">
                      Confirmar Levantamento
                    </Button>
                  </form>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="history">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
                {userTransactions.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                    <History size={40} className="mx-auto text-slate-200 mb-2" />
                    <p className="text-slate-400 text-sm">Sem transações registadas</p>
                  </div>
                ) : (
                  userTransactions.map(t => (
                    <div key={t.id} className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${t.type === 'deposit' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                          {t.type === 'deposit' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 capitalize">{t.type === 'deposit' ? 'Depósito' : 'Levantamento'}</h4>
                          <p className="text-[10px] text-slate-500">{new Date(t.date).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${t.type === 'deposit' ? 'text-green-600' : 'text-blue-600'}`}>
                          {t.type === 'deposit' ? '+' : '-'}{t.amount.toFixed(2)} MT
                        </p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          {t.status === 'pending' && (
                            <span className="flex items-center gap-0.5 text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full uppercase">
                              <Clock size={8} /> Pendente
                            </span>
                          )}
                          {t.status === 'approved' && (
                            <span className="flex items-center gap-0.5 text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full uppercase">
                              <CheckCircle2 size={8} /> Aprovado
                            </span>
                          )}
                          {t.status === 'rejected' && (
                            <span className="flex items-center gap-0.5 text-[9px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full uppercase">
                              <XCircle size={8} /> Rejeitado
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </div>
      </Tabs>
    </div>
  );
}
