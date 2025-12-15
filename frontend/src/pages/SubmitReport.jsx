import { useState } from "react";
import api from "../api/api";

export default function SubmitReport() {
  const [form, setForm] = useState({
    ngoId: "",
    month: "",
    peopleHelped: "",
    eventsConducted: "",
    fundsUtilized: "",
  });

  const submit = async () => {
    await api.post("/report", {
      ...form,
      peopleHelped: Number(form.peopleHelped),
      eventsConducted: Number(form.eventsConducted),
      fundsUtilized: Number(form.fundsUtilized),
    });
    alert("Report submitted successfully");
  };

  return (
    <div className="container">
      <div className="form">
        <h2>Submit Monthly Report</h2>

        {Object.keys(form).map((key) => (
          <input
            key={key}
            placeholder={key}
            value={form[key]}
            onChange={(e) =>
              setForm({ ...form, [key]: e.target.value })
            }
          />
        ))}

        <button onClick={submit}>Submit Report</button>
      </div>
    </div>
  );
}
