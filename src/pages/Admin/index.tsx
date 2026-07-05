import { useState } from 'react';
import { useStore } from '../../lib/store';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { toast } from 'sonner';
import { ShieldCheck, Users, ClipboardList, Settings, Check, X, Phone, Key, LogOut } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  
  const { settings, updateSettings, users, transactions, approveTransaction, rejectTransaction, logout } = useStore();
  
  const pendingTransactions = transactions.filter(t => t.status === 'pending');
  const [newWhatsapp, setNewWhatsapp] = useState(settings.whatsappNumber);
  const [newPin, setNewPin] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === settings.adminPin) {
      setIsAuthenticated(true);
      toast.success('Acesso concedido');
    } else {
      toast.error('PIN incorrecto');
    }
  };

  const handleUpdateSettings = () => {
    updateSettings({ whatsappNumber: newWhatsapp, adminPin: newPin || settings.adminPin });
    toast.success('Configurações actualizadas');
    setNewPin('');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-900">
        <div className="w-full max-w-sm space-y-8 text-center">
          <div className="flex justify-center">
            <div className="p-4 bg-slate-800 rounded-full text-slate-400">
              <ShieldCheck size={64} />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Painel Administrativo</h1>
            <p className="text-slate-400 text-sm">Introduza o PIN de segurança para continuar</p>
          </div>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <Input
              type="password"
              placeholder="******"
              className="bg-slate-800 border-slate-700 text-white text-center text-2xl tracking-[1em] h-16"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-12 font-bold">
              Desbloquear
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 pb-24 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">Admin</h2>
        <Button variant="ghost" size="sm" onClick={() => setIsAuthenticated(false)} className="text-slate-500">
          Bloquear
        </Button>
      </div>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white p-1 rounded-xl shadow-sm">
          <TabsTrigger value="requests">Pedidos</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="config">Config</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="requests" className="space-y-4">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
              <ClipboardList size={18} /> Pendentes ({pendingTransactions.length})
            </h3>
            
            {pendingTransactions.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-400">Nenhum pedido pendente</p>
              </div>
            ) : (
              pendingTransactions.map(t => {
                const user = users.find(u => u.id === t.userId);
                return (
                  <Card key={t.id} className="p-4 border-none shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">{t.type === 'deposit' ? 'Depósito' : 'Levantamento'}</p>
                        <h4 className="text-lg font-bold text-slate-900">{t.amount.toFixed(2)} MT</h4>
                        <p className="text-xs text-slate-500">{user?.phone} • {t.method.toUpperCase()}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="text-red-600 bg-red-50 hover:bg-red-100 rounded-full"
                          onClick={() => rejectTransaction(t.id)}
                        >
                          <X size={18} />
                        </Button>
                        <Button 
                          size="icon" 
                          className="bg-green-600 hover:bg-green-700 rounded-full"
                          onClick={() => approveTransaction(t.id)}
                        >
                          <Check size={18} />
                        </Button>
                      </div>
                    </div>
                    {t.proofImage && (
                      <div className="pt-2 border-t border-slate-100">
                        <p className="text-[10px] text-slate-400 mb-1">Comprovativo:</p>
                        <img src={t.proofImage} alt="Comprovativo" className="w-20 h-20 object-cover rounded-lg border border-slate-200" />
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
              <Users size={18} /> Lista de Usuários ({users.length})
            </h3>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 text-slate-500 font-medium">
                    <tr>
                      <th className="px-4 py-3">Telefone</th>
                      <th className="px-4 py-3">Saldo</th>
                      <th className="px-4 py-3">Cargo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map(u => (
                      <tr key={u.id}>
                        <td className="px-4 py-3 font-medium">{u.phone}</td>
                        <td className="px-4 py-3">{u.balance.toFixed(2)} MT</td>
                        <td className="px-4 py-3 capitalize">{u.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
              <Settings size={18} /> Definições da Plataforma
            </h3>
            
            <Card className="p-5 border-none shadow-sm space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Phone size={14} /> WhatsApp do Assistente</Label>
                  <Input 
                    value={newWhatsapp} 
                    onChange={(e) => setNewWhatsapp(e.target.value)} 
                    placeholder="Ex: 840000000"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Key size={14} /> Novo PIN de Administrador</Label>
                  <Input 
                    type="password"
                    value={newPin} 
                    onChange={(e) => setNewPin(e.target.value)} 
                    placeholder="Deixe vazio para não alterar"
                    maxLength={6}
                  />
                </div>
                <Button onClick={handleUpdateSettings} className="w-full bg-slate-900 hover:bg-slate-800">
                  Guardar Alterações
                </Button>
              </div>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
