import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { User, FileText, CalendarDays, Clock, Stethoscope } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function StepConfirm({
  especialidade,
  profissional,
  date,
  time,
  name,
  cpf,
  onNameChange,
  onCpfChange,
  onConfirm,
  isValid,
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Dados do Paciente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              placeholder="Digite seu nome completo"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF (somente números)</Label>
            <Input
              id="cpf"
              placeholder="00000000000"
              value={cpf}
              onChange={(e) => onCpfChange(e.target.value)}
              maxLength={11}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Resumo do Agendamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <Stethoscope className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Especialidade:</span>
            <span className="font-medium">{especialidade}</span>
          </div>
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Profissional:</span>
            <span className="font-medium">{profissional}</span>
          </div>
          <div className="flex items-center gap-3">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Data:</span>
            <span className="font-medium">
              {format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Horário:</span>
            <span className="font-medium">{time}</span>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={onConfirm}
        disabled={!isValid}
        className="w-full h-12 text-base font-semibold"
      >
        Confirmar Agendamento
      </Button>
    </div>
  );
}