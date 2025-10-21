import { Card, CardContent } from "@/components/ui/card"

interface CertificateProps {
  recipientName?: string
  birthDate?: string
  issueDate?: string
  validFrom?: string
  validTo?: string
  registrationNumber?: string
}

const MainCertificate = ({
  recipientName = "Kamila Zaborska",
  birthDate = "28.07.1970",
  issueDate = "18.11.2025",
  validFrom = "18.11.2014",
  validTo = "31.12.2014",
  registrationNumber = "47/02/11/2014/SOBHP",
}: CertificateProps) => {
  return (
    <Card className="w-full max-w-4xl mx-auto bg-card border-2">
      <CardContent className="p-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground italic">(pieczęć organizatora szkolenia)</p>
          <div className="h-8"></div>
        </div>

        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-serif font-bold tracking-wider text-balance">ZAŚWIADCZENIE</h1>
          <h2 className="text-xl font-serif text-balance leading-relaxed">
            o ukończeniu szkolenia w dziedzinie bezpieczeństwa i higieny pracy
          </h2>
        </div>

        {/* Main Content */}
        <div className="space-y-6 text-sm leading-relaxed">
          <div className="flex flex-wrap items-baseline gap-2">
            <span>Pani</span>
            <span className="font-bold text-destructive underline decoration-destructive">{recipientName}</span>
            <span>urodzona dnia</span>
            <span className="font-bold text-destructive underline decoration-destructive">{birthDate}</span>
            <span>r.</span>
          </div>

          <div className="italic text-xs text-muted-foreground">(imię i nazwisko / nazwa firmy)</div>

          <p className="text-justify">
            ukończyła szkolenie okresowe pracowników zatrudnionych na stanowiskach robotniczych, o których mowa w § 2
            ust. 1 pkt 2 rozporządzenia MGiP z dnia 27 lipca 2004 r. w sprawie szkolenia w dziedzinie bezpieczeństwa i
            higieny pracy (Dz. U. 180 poz. 1860)
          </p>

          <div className="italic text-xs text-muted-foreground">
            (należy zaznaczyć właściwą grupę osób objętych szkoleniem zgodnie z przepisami prawa pracy)
          </div>

          <p>zorganizowane w formie i instruktażu przez</p>

          <div className="text-center space-y-1">
            <p className="font-bold">HUS PREMIUM Spółka z o.o.</p>
            <p>ul. Kościelna 3</p>
            <p>62-110 Damasławek</p>
            <div className="italic text-xs text-muted-foreground">(nazwa organizatora szkolenia)</div>
          </div>

          <div className="flex flex-wrap items-baseline gap-2">
            <span>w okresie od dnia</span>
            <span className="font-bold text-destructive underline decoration-destructive">{validFrom}</span>
            <span>r. do dnia</span>
            <span className="font-bold text-destructive underline decoration-destructive">{validTo}</span>
            <span>r.</span>
          </div>

          <p className="text-justify">
            Celem szkolenia była aktualizacja i uzupełnienie wiedzy i umiejętności w szczególności z zakresu oceny
            zagrożeń związanych z wykonywaną pracą, metod ochrony przed zagrożeniami dla zdrowia i bezpieczeństwa
            pracowników, kształtowania warunków pracy w sposób zgodny z przepisami i zasadami bezpieczeństwa i higieny
            pracy, postępowania w razie wypadku oraz w sytuacjach awaryjnych
          </p>

          <p className="text-justify">
            Zaświadczenie wydano na podstawie § 16 ust. 3 rozporządzenia Ministra Gospodarki i Pracy z dnia 27 lipca
            2004 r. w sprawie szkolenia w dziedzinie bezpieczeństwa i higieny pracy (Dz.U. nr 180, poz. 1860, ze zm.).
          </p>
        </div>

        {/* Footer */}
        <div className="space-y-8 pt-8">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span>Damasławek, dnia</span>
                <span className="font-bold text-destructive underline decoration-destructive">{issueDate}</span>
                <span>r.</span>
              </div>
              <div className="italic text-xs text-muted-foreground">(miejscowość)</div>
            </div>
            <div className="text-right space-y-2">
              <div className="h-8 border-b border-foreground w-48"></div>
              <div className="italic text-xs text-muted-foreground">
                (data wystawienia wraz z podpisem i pieczęcią organizatora szkolenia)
              </div>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span>Nr zaświadczenia wg rejestru:</span>
            <span className="font-bold text-destructive underline decoration-destructive">{registrationNumber}</span>
          </div>

          <div className="text-center pt-8">
            <div className="h-8 border-b border-foreground w-96 mx-auto"></div>
            <div className="italic text-xs text-muted-foreground mt-2">
              (pieczęć i podpis osoby upoważnionej przez organizatora szkolenia)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MainCertificate;