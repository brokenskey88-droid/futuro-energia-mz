import { useStore } from '../../lib/store';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { LogOut, Phone, ShieldCheck, ChevronRight, Zap, History, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { currentUser, logout, settings } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: History, label: 'Histórico de Transações', path: '/finance?tab=history', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: Zap, label: 'Meus Investimentos', path: '/dashboard', color: 'text-green-600', bg: 'bg-green-50' },
  ];

  if (currentUser?.role === 'admin') {
    menuItems.push({ icon: ShieldCheck, label: 'Painel Administrativo', path: '/admin', color: 'text-purple-600', bg: 'bg-purple-50' });
  }

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Profile Header */}
      <div className="flex flex-col items-center py-8">
        <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-4 border-4 border-white shadow-md">
          <UserCircle size={80} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">{currentUser?.phone}</h2>
        <span className="text-xs text-slate-500 uppercase font-bold tracking-widest mt-1">Nível de Investidor</span>
      </div>

      {/* Menu Options */}
      <div className="space-y-3">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => navigate(item.path)}
            className="w-full bg-white p-4 rounded-2xl flex items-center justify-between border border-slate-100 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-xl ${item.bg} ${item.color}`}>
                <item.icon size={20} />
              </div>
              <span className="font-semibold text-slate-700 text-sm">{item.label}</span>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </button>
        ))}
      </div>

      {/* Support Section */}
      <Card className="p-5 border-none bg-green-600 text-white overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="font-bold text-lg mb-1">Precisa de ajuda?</h3>
          <p className="text-green-100 text-xs mb-4">Fale com o nosso assistente no WhatsApp disponível 24/7.</p>
          <Button 
            className="w-full bg-white text-green-600 hover:bg-green-50 font-bold flex gap-2"
            onClick={() => window.open(`https://wa.me/${settings.whatsappNumber}`, '_blank')}
          >
            <Phone size={18} /> WhatsApp Assistente
          </Button>
        </div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
      </Card>

      {/* Logout */}
      <Button 
        variant="ghost" 
        onClick={handleLogout}
        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold flex gap-2 h-12"
      >
        <LogOut size={18} /> Terminar Sessão
      </Button>

      <div className="text-center text-[10px] text-slate-400 mt-8 uppercase tracking-widest font-medium">
        MozEnergy v1.0.0
      </div>
    </div>
  );
}
