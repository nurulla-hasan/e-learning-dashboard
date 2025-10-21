import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const trainingProgram = [
  {
    id: 1,
    topic: "Wybrane regulacje prawne z zakresu prawa pracy dotyczące bezpieczeństwa i higieny pracy, z uwzględnieniem:",
    subtopics: [
      "praw i obowiązków pracowników i pracodawców w zakresie bezpieczeństwa i higieny pracy oraz odpowiedzialności za naruszenie przepisów z zasad bhp,",
      "ochrony pracy kobiet i młodocianych,",
      "wypadków przy pracy i chorób zawodowych oraz świadczeń z nimi związanych,",
      "profilaktycznej ochrony zdrowia pracowników",
    ],
    hours: 2,
  },
  {
    id: 2,
    topic:
      "Postępowanie w zakresie oceny zagrożeń czynnikami występującymi w procesach pracy oraz w zakresie metod ochrony przed zagrożeniami dla zdrowia i życia pracowników",
    hours: 2,
  },
  {
    id: 3,
    topic:
      "Problemy związane z organizacją stanowisk pracy biurowej, z uwzględnieniem zasad ergonomii, w tym stanowisk wyposażonych w monitory ekranowe i inne urządzenia biurowe",
    hours: 2,
  },
  {
    id: 4,
    topic:
      "Postępowanie w razie wypadków i w sytuacjach zagrożeń (np. pożaru, awarii), w tym zasady udzielania pierwszej pomocy w razie wypadku",
    hours: 2,
  },
]

const TrainingCertificate = () => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center border-b">
        <CardTitle className="text-2xl font-serif text-balance">Program szkolenia</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="border-r px-4 py-3 text-left font-medium w-16">L.p</th>
                <th className="border-r px-4 py-3 text-left font-medium">Temat szkolenia</th>
                <th className="px-4 py-3 text-center font-medium w-24">Liczba godzin*)</th>
              </tr>
            </thead>
            <tbody>
              {trainingProgram.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="border-r px-4 py-4 text-center font-medium align-top">{item.id}</td>
                  <td className="border-r px-4 py-4 align-top">
                    <div className="space-y-2">
                      <p className="text-sm leading-relaxed">{item.topic}</p>
                      {item.subtopics && (
                        <div className="ml-4 space-y-1">
                          {item.subtopics.map((subtopic, index) => (
                            <p key={index} className="text-sm leading-relaxed text-muted-foreground">
                              {String.fromCharCode(97 + index)}) {subtopic}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center font-medium align-top">{item.hours}</td>
                </tr>
              ))}
              <tr className="border-b bg-muted/20">
                <td className="border-r px-4 py-3 text-center font-medium">Razem:</td>
                <td className="border-r px-4 py-3"></td>
                <td className="px-4 py-3 text-center font-medium">
                  minimum {trainingProgram.reduce((sum, item) => sum + item.hours, 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export default TrainingCertificate;
