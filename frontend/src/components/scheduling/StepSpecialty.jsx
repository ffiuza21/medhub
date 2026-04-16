import { useState, useEffect } from "react";
import { getEspecialidades, getProfissionais } from "../../api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Scan } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StepSpecialty({
  selectedSpecialty,
  selectedProfessional,
  onSpecialtyChange,
  onProfessionalChange,
}) {
  const [especialidades, setEspecialidades] = useState([]);
  const [profissionais, setProfissionais] = useState([]);

  useEffect(() => {
    async function buscarEspecialidades() {
      try {
        const dados = await getEspecialidades();
        setEspecialidades(dados);
      } catch (error) {
        console.error("Erro ao buscar especialidades:", error);
      }
    }
    buscarEspecialidades();
  }, []);

  useEffect(() => {
    if (!selectedSpecialty) return;
    async function buscarProfissionais() {
      try {
        const dados = await getProfissionais(selectedSpecialty);
        setProfissionais(dados);
      } catch (error) {
        console.error("Erro ao buscar profissionais:", error);
      }
    }
    buscarProfissionais();
  }, [selectedSpecialty]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Especialidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedSpecialty}
            onValueChange={(v) => {
                const selecionada = especialidades.find((s) => String(s.id) === v);
                onSpecialtyChange(v, selecionada?.especialidade || "");
                onProfessionalChange("", "");
                }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione a especialidade" />
            </SelectTrigger>
            <SelectContent>
              {especialidades.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.especialidade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedSpecialty && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Scan className="w-5 h-5 text-primary" />
              Profissional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
                value={selectedProfessional} 
                onValueChange={(v) => {
                    const selecionado = profissionais.find((p) => String(p.id) === v);
                    onProfessionalChange(v, selecionado?.nome || "");
                }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o profissional" />
              </SelectTrigger>
              <SelectContent>
                {profissionais.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    <span className="flex flex-col">
                      <span>{p.nome}</span>
                      <span className="text-xs text-muted-foreground">{p.crm}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}
    </div>
  );
}