import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getAgendamentosPorCpf, cancelarAgendamento } from "../../api";
import { toast } from "sonner";
import { Search, CalendarDays, Clock, Stethoscope, CircleUser, User, Trash2, FileX } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export function AppointmentLookup() {
  const [cpf, setCpf] = useState("");
  const [agendamentos, setAgendamentos] = useState([]);
  const [buscou, setBuscou] = useState(false);

  const handleSearch = async () => {
    const cpfLimpo = cpf.replace(/\D/g, "");
    if (cpfLimpo.length !== 11) {
      toast.error("CPF inválido. Digite os 11 dígitos.");
      return;
    }
    try {
      const dados = await getAgendamentosPorCpf(cpfLimpo);
      setAgendamentos(dados);
      setBuscou(true);
    } catch (error) {
      toast.error("Erro ao buscar agendamentos.");
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelarAgendamento(id);
      setAgendamentos((prev) => prev.filter((a) => a.id !== id));
      toast.success("Agendamento cancelado com sucesso.");
    } catch (error) {
      toast.error("Erro ao cancelar agendamento.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <Input
          placeholder="Digite seu CPF (somente números)"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          maxLength={11}
          className="flex-1"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch} className="gap-2">
          <Search className="w-4 h-4" /> Buscar
        </Button>
      </div>

      {buscou && agendamentos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
          <FileX className="w-12 h-12 opacity-50" />
          <p className="text-sm">Nenhum agendamento encontrado para este CPF.</p>
        </div>
      )}

      <div className="space-y-3">
        {agendamentos.map((apt) => (
          <Card key={apt.id} className="overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 text-sm flex-1">
                  <div className="flex items-center gap-2">
                    <CircleUser className="w-4 h-4 text-primary" />
                    <span>{apt.paciente}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-primary" />
                    <span className="font-semibold">{apt.especialidade}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>{apt.nome}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="w-4 h-4" />
                    <span>{format(parseISO(apt.data_), "dd/MM/yyyy", { locale: ptBR })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{apt.horario}</span>
                  </div>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="gap-1.5">
                      <Trash2 className="w-3.5 h-3.5" /> Cancelar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancelar agendamento?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. O horário ficará disponível para outros pacientes.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Voltar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleCancel(apt.id)}>
                        Confirmar cancelamento
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}