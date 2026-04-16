import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Stepper } from "./components/scheduling/Stepper";
import { StepSpecialty } from "./components/scheduling/StepSpecialty";
import { StepDateTime } from "./components/scheduling/StepDateTime";
import { StepConfirm } from "./components/scheduling/StepConfirm";
import { AppointmentLookup } from "./components/scheduling/AppointmentLookup";
import { criarAgendamento } from "./api";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { CalendarPlus, ClipboardList, Stethoscope, ArrowLeft, ArrowRight } from "lucide-react";
import { format } from "date-fns";

const STEPS = ["Especialidade", "Data e Horário", "Confirmação"];

function App() {
  const [step, setStep] = useState(1);
  const [especialidadeId, setEspecialidadeId] = useState("");
  const [especialidadeNome, setEspecialidadeNome] = useState("");
  const [profissionalId, setProfissionalId] = useState("");
  const [profissionalNome, setProfissionalNome] = useState("");
  const [date, setDate] = useState(undefined);
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");

  const canNext =
    (step === 1 && especialidadeId && profissionalId) ||
    (step === 2 && date && time) ||
    step === 3;

  const isConfirmValid = name.trim().length >= 3 && cpf.replace(/\D/g, "").length === 11;

  const resetForm = () => {
    setStep(1);
    setEspecialidadeId("");
    setEspecialidadeNome("");
    setProfissionalId("");
    setProfissionalNome("");
    setDate(undefined);
    setTime("");
    setName("");
    setCpf("");
  };

  const handleConfirm = async () => {
    if (!date) return;
    try {
      await criarAgendamento({
        paciente: name.trim(),
        cpf: cpf.replace(/\D/g, ""),
        data: format(date, "yyyy-MM-dd"),
        horario: time,
        profissional_id: parseInt(profissionalId),
      });
      toast.success("Agendamento realizado com sucesso!");
      resetForm();
    } catch (error) {
      toast.error("Erro ao realizar agendamento. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">MedHub</h1>
            <p className="text-xs text-muted-foreground">Sistema de Agendamento</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList className="w-full grid grid-cols-2 h-12">
            <TabsTrigger value="schedule" className="gap-2 text-sm font-medium">
              <CalendarPlus className="w-4 h-4" /> Agendar
            </TabsTrigger>
            <TabsTrigger value="lookup" className="gap-2 text-sm font-medium">
              <ClipboardList className="w-4 h-4" /> Meus Agendamentos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule">
            <Stepper currentStep={step} steps={STEPS} />

            {step === 1 && (
              <StepSpecialty
                selectedSpecialty={especialidadeId}
                selectedProfessional={profissionalId}
                onSpecialtyChange={(id, nome) => {
                  setEspecialidadeId(id);
                  setEspecialidadeNome(nome);
                }}
                onProfessionalChange={(id, nome) => {
                  setProfissionalId(id);
                  setProfissionalNome(nome);
                }}
              />
            )}

            {step === 2 && (
              <StepDateTime
                professionalId={profissionalId}
                selectedDate={date}
                selectedTime={time}
                onDateChange={setDate}
                onTimeChange={setTime}
              />
            )}

            {step === 3 && date && (
              <StepConfirm
                especialidade={especialidadeNome}
                profissional={profissionalNome}
                date={date}
                time={time}
                name={name}
                cpf={cpf}
                onNameChange={setName}
                onCpfChange={setCpf}
                onConfirm={handleConfirm}
                isValid={isConfirmValid}
              />
            )}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setStep((s) => s - 1)}
                disabled={step === 1}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar
              </Button>
              {step < 3 && (
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canNext}
                  className="gap-2"
                >
                  Próximo <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="lookup">
            <AppointmentLookup />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default App;