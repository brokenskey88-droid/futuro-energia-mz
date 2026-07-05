import { useStore } from '../../lib/store';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { Wallet, TrendingUp, Calendar, Zap, Bell } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { currentUser, checkIn, investments, products } = useStore();

  const activeInvestments = investments.filter(inv => inv.userId === currentUser?.id && inv.status === 'active');
  const totalInvested = activeInvestments.reduce((acc, inv) => acc + inv.amount, 0);
  const dailyEarnings = activeInvestments.reduce((acc, inv) => acc + inv.dailyReturn, 0);

  const handleCheckIn = () => {
    if (checkIn()) {
      toast.success('Check-in diário realizado! Ganhou 10MT');
    } else {
      toast.info('Já realizou o check-in hoje. Volte amanhã!');
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm text-slate-500">Bem-vindo de volta</h2>
          <p className="text-xl font-bold text-slate-900">{currentUser?.phone}</p>
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={24} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
      </div>

      {/* Balance Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <span className="text-green-100 text-sm font-medium">Saldo Total</span>
            <Wallet size={24} className="text-green-200 opacity-50" />
          </div>
          <h3 className="text-4xl font-bold mt-2">{currentUser?.balance.toFixed(2)} MT</h3>
          
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3">
              <span className="text-green-100 text-[10px] uppercase tracking-wider block">Investido</span>
              <span className="text-lg font-semibold">{totalInvested.toFixed(2)} MT</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3">
              <span className="text-green-100 text-[10px] uppercase tracking-wider block">Renda Diária</span>
              <span className="text-lg font-semibold">{dailyEarnings.toFixed(2)} MT</span>
            </div>
          </div>
        </div>
        
        {/* Abstract background shapes */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 -top-10 w-32 h-32 bg-green-400/20 rounded-full blur-2xl"></div>
      </motion.div>

      {/* Daily Check-in */}
      <Card className="p-4 border-none bg-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
            <Calendar size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-sm">Check-in Diário</h4>
            <p className="text-[10px] text-slate-500">Ganhe 10MT todos os dias</p>
          </div>
        </div>
        <Button onClick={handleCheckIn} size="sm" className="bg-white text-green-600 border border-green-200 hover:bg-green-50 shadow-sm font-semibold">
          Receber
        </Button>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="h-16 flex flex-col gap-1 border-slate-200" asChild>
          <a href="/finance?tab=deposit">
            <TrendingUp size={18} className="text-green-600" />
            <span className="text-xs">Depositar</span>
          </a>
        </Button>
        <Button variant="outline" className="h-16 flex flex-col gap-1 border-slate-200" asChild>
          <a href="/finance?tab=withdraw">
            <Zap size={18} className="text-blue-600" />
            <span className="text-xs">Levantar</span>
          </a>
        </Button>
      </div>

      {/* Recent Investments */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-900">Meus Investimentos</h3>
          <Button variant="link" className="text-green-600 p-0 text-xs" asChild>
            <a href="/invest">Ver Todos</a>
          </Button>
        </div>
        
        {activeInvestments.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 text-sm">Ainda não tens investimentos ativos</p>
            <Button variant="link" className="text-green-600 mt-2" asChild>
              <a href="/invest">Começar a investir</a>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {activeInvestments.slice(0, 3).map(inv => {
              const product = products.find(p => p.id === inv.productId);
              return (
                <div key={inv.id} className="bg-white border border-slate-100 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                    <img src={product?.image} alt={product?.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-900">{product?.name}</h4>
                    <p className="text-[10px] text-slate-500">Renda: {inv.dailyReturn.toFixed(2)}MT/dia</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Ativo</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
