import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useStore } from '../../lib/store';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import { Zap } from 'lucide-react';

const schema = z.object({
  phone: z.string().min(9, 'Número de telefone inválido'),
  password: z.string().length(6, 'A palavra-passe deve ter 6 dígitos'),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const login = useStore((state) => state.login);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    if (login(data.phone, data.password)) {
      toast.success('Login efectuado com sucesso!');
      navigate('/');
    } else {
      toast.error('Número ou palavra-passe incorrectos');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-100 rounded-2xl text-green-600">
              <Zap size={48} fill="currentColor" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">MozEnergy</h1>
          <p className="mt-2 text-slate-500 text-sm">Investe na energia do amanhã em Moçambique</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Número de Telefone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Ex: 840000000"
              {...register('phone')}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Palavra-passe (6 dígitos)</Label>
            <Input
              id="password"
              type="password"
              maxLength={6}
              placeholder="******"
              {...register('password')}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 h-12 text-base font-semibold">
            Entrar
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-slate-500">
            Não tem uma conta?{' '}
            <Link to="/register" className="text-green-600 font-semibold hover:underline">
              Registe-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
