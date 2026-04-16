import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getHorariosDisponiveis } from "../../api";
import { CalendarDays, Clock } from "lucide-react";
import { format, isWeekend, isBefore, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

export function StepDateTime({
  professionalId,
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
}) {
  const today = startOfDay(new Date());
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);

  useEffect(() => {
    if (!professionalId || !selectedDate) return;

    async function buscarHorarios() {
      try {
        const dataFormatada = format(selectedDate, "yyyy-MM-dd");
        const dados = await getHorariosDisponiveis(professionalId, dataFormatada);
        setHorariosDisponiveis(dados);
      } catch (error) {
        console.error("Erro ao buscar horários:", error);
      }
    }
    buscarHorarios();
  }, [professionalId, selectedDate]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            Data
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(d) => { onDateChange(d); onTimeChange(""); }}
            disabled={(date) => isWeekend(date) || isBefore(date, today)}
            locale={ptBR}
            className="p-3 pointer-events-auto"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Horário
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedDate ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Selecione uma data para ver os horários disponíveis.
            </p>
          ) : horariosDisponiveis.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhum horário disponível nesta data.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {horariosDisponiveis.map((slot) => (
                <button
                  key={slot.horario}
                  onClick={() => onTimeChange(slot.horario)}
                  className={cn(
                    "py-2.5 px-3 rounded-lg text-sm font-medium border transition-all",
                    selectedTime === slot.horario
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "bg-card text-card-foreground border-border hover:border-primary/50 hover:bg-accent"
                  )}
                >
                  {slot.horario}
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}