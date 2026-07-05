import { useStore } from '../../lib/store';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { Card } from '../../components/ui/card';
import { motion } from 'framer-motion';
import { Zap, Clock, TrendingUp } from 'lucide-react';

export default function Invest() {
  const { products, buyInvestment } = useStore();

  const handleBuy = (productId: string) => {
    const error = buyInvestment(productId);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Investimento realizado com sucesso!');
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-slate-900">Produtos de Energia</h2>
        <p className="text-slate-500 text-sm">Escolha o melhor plano para o seu capital</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden border-none shadow-md group">
              <div className="h-40 relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  {product.price} MT
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{product.name}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-slate-500 text-xs">
                        <Clock size={12} />
                        <span>{product.cycleDays} dias</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                        <TrendingUp size={12} />
                        <span>Retorno: {product.totalReturn} MT</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-50 rounded-lg p-2 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase tracking-tighter">Diário</span>
                    <span className="text-sm font-bold text-slate-700">{product.dailyReturn.toFixed(2)} MT</span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase tracking-tighter">Lucro Total</span>
                    <span className="text-sm font-bold text-green-600">{(product.totalReturn - product.price).toFixed(2)} MT</span>
                  </div>
                </div>

                <Button 
                  onClick={() => handleBuy(product.id)}
                  className="w-full bg-green-600 hover:bg-green-700 font-bold"
                >
                  Investir Agora
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
