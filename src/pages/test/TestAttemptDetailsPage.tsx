import { useParams, useNavigate } from "react-router-dom";
import { useGetSingleTestAttemptQuery, useUpdateTestAttemptMutation } from "@/redux/features/test/testApi";
import ListLoading from "@/components/loader/ListLoading";
import ServerErrorCard from "@/components/card/ServerErrorCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ErrorToast, SuccessToast } from "@/helper/ValidationHelper";

const InfoRow = ({ label, value }: { label: string; value: any }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="text-gray-900 font-medium">{value}</span>
  </div>
);

const Badge = ({ children, color = "blue" }: { children: any; color?: "green" | "red" | "blue" | "yellow" }) => {
  const map: Record<string, string> = {
    green: "bg-green-100 text-green-700 border-green-200",
    red: "bg-red-100 text-red-700 border-red-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${map[color] || map.blue}`}>{children}</span>
  );
};

const TestAttemptDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useGetSingleTestAttemptQuery(id as string, { skip: !id });
  const [updateAttempt, { isLoading: updating }] = useUpdateTestAttemptMutation();
  const [gradeOpen, setGradeOpen] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<any | null>(null);
  const [marks, setMarks] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  if (isLoading) return <ListLoading />;
  if (isError || !data?.data) return <ServerErrorCard />;

  const attempt = data.data;
  const user = attempt.user || {};
  const test = attempt.test || {};

  return (
    <>
    <div className="min-h-full bg-white py-4 px-4">
      <div className="w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-cyan-500 px-6 py-4">
          <div className="flex items-center gap-3">
            <Button onClick={() => navigate(-1)} variant="ghost" size="sm" className="text-white hover:bg-cyan-600">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-white">Test Attempt Details</h1>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Student */}
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Student</h3>
              <div className="flex items-center gap-3 mb-3">
                {user?.image && <img src={user.image} alt={user?.fullName || "Student"} className="w-12 h-12 rounded-lg object-cover" />}
                <div>
                  <div className="text-gray-900 font-medium">{user?.fullName || "-"}</div>
                  <div className="text-xs text-gray-500">{user?.email || "-"}</div>
                </div>
              </div>
              <div className="space-y-2">
                <InfoRow label="Attempt ID" value={attempt.id} />
                <InfoRow label="Completed" value={attempt.completedAt ? new Date(attempt.completedAt).toLocaleString() : "-"} />
                <InfoRow label="Time Spent" value={`${attempt.timeSpent ?? 0}s`} />
              </div>
            </div>

            {/* Test */}
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Test</h3>
              <div className="space-y-2">
                <InfoRow label="Title" value={test?.title || "-"} />
                <InfoRow label="Total Marks" value={test?.totalMarks ?? attempt.totalMarks ?? "-"} />
                <InfoRow label="Passing Score" value={test?.passingScore ?? "-"} />
                <InfoRow label="Status" value={<Badge color={attempt.status === "GRADED" ? "green" : "yellow"}>{attempt.status || "-"}</Badge>} />
              </div>
            </div>

            {/* Result */}
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Result</h3>
              <div className="space-y-3">
                <div className="text-2xl font-semibold text-gray-900">
                  {attempt.score ?? 0} / {attempt.totalMarks ?? 0}
                  {typeof attempt.percentage === "number" && (
                    <span className="ml-2 text-base text-gray-600">({attempt.percentage}%)</span>
                  )}
                </div>
                <div>
                  {attempt.isPassed ? (
                    <Badge color="green">Passed</Badge>
                  ) : (
                    <Badge color="red">Failed</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Responses */}
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Responses</h3>
            <div className="space-y-4">
              {Array.isArray(attempt.responses) && attempt.responses.length > 0 ? (
                attempt.responses.map((res: any, idx: number) => (
                  <div key={res.id || idx} className="border rounded-md p-4 bg-gray-50">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-gray-900 font-medium">Q{idx + 1}. {res?.question?.title || "Question"}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Type: {res?.questionType || res?.question?.type || "-"} • Marks: {res?.question?.marks ?? res?.marksObtained ?? 0}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {res?.isCorrect !== undefined && (
                          res.isCorrect ? <Badge color="green">Correct</Badge> : <Badge color="red">Incorrect</Badge>
                        )}
                        {(res?.questionType === "SHORT_ANSWER" || res?.status === "MANUAL_GRADED") && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedResponse(res);
                              setMarks(String(res?.marksObtained ?? (res?.question?.marks ?? 0)));
                              setNotes(res?.instructorNotes ?? "");
                              setGradeOpen(true);
                            }}
                          >
                            Grade
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {res?.selectedOptions && res.selectedOptions.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-gray-700 mb-1">Selected Options</div>
                          <div className="flex flex-wrap gap-2">
                            {res.selectedOptions.map((opt: string, i: number) => (
                              <span key={i} className="px-2 py-1 text-xs rounded-full border bg-white">{opt}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {res?.shortAnswer && (
                        <div>
                          <div className="text-xs font-semibold text-gray-700 mb-1">Short Answer</div>
                          <div className="text-sm text-gray-900 bg-white rounded p-2 border">{res.shortAnswer}</div>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <InfoRow label="Marks Obtained" value={res?.marksObtained ?? 0} />
                      <InfoRow label="Status" value={<Badge color={res?.status === "MANUAL_GRADED" ? "blue" : "yellow"}>{res?.status || "-"}</Badge>} />
                      <InfoRow label="Time Spent" value={`${res?.timeSpent ?? 0}s`} />
                    </div>

                    {res?.instructorNotes && (
                      <div className="mt-3">
                        <div className="text-xs font-semibold text-gray-700 mb-1">Instructor Notes</div>
                        <div className="text-sm text-gray-900 bg-white rounded p-2 border">{res.instructorNotes}</div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">No responses found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    <Dialog open={gradeOpen} onOpenChange={(o) => { setGradeOpen(o); if (!o) setSelectedResponse(null); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manual Grading</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">{selectedResponse?.question?.title}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="marks">Marks</Label>
              <Input
                id="marks"
                type="number"
                min={0}
                max={selectedResponse?.question?.marks ?? undefined}
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
              />
              {selectedResponse?.question?.marks != null && (
                <p className="text-xs text-gray-500 mt-1">Max: {selectedResponse?.question?.marks}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => { setGradeOpen(false); setSelectedResponse(null); }}>Cancel</Button>
            <Button
              disabled={updating}
              onClick={async () => {
                if (!selectedResponse || !id) return;
                const m = Number(marks);
                if (Number.isNaN(m)) {
                  if (ErrorToast) ErrorToast("Enter a valid marks value");
                  return;
                }
                try {
                  await updateAttempt({ id, data: { gradings: [{ responseId: selectedResponse.id, marks: m, notes }] } } as any).unwrap();
                  if (SuccessToast) SuccessToast("Grading saved");
                  setGradeOpen(false);
                  setSelectedResponse(null);
                  if (refetch) refetch();
                } catch (e) {
                  if (ErrorToast) ErrorToast("Failed to save grading");
                }
              }}
            >
              {updating ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default TestAttemptDetailsPage;
