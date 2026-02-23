import React from "react";
import { Briefcase } from "lucide-react";
import { InputField, SelectField } from "./ProfileFields";
import { EMPLOYEE_TYPES, EDUCATION_LIST, SPECIALIZATIONS } from "./ProfileConstants";

export default function OfficialDetailsSection({ form, onChange, edit }) {
    return (
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Briefcase className="text-orange-500" size={20} />
                Official Details
            </h3>
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
                <InputField k="designation" l="Designation" value={form.designation} onChange={onChange} edit={edit} />
                <InputField k="company mail id" l="Company Email" value={form["company mail id"]} onChange={onChange} edit={edit} readOnly={true} />
                <InputField k="personal mail id" l="Personal Email" value={form["personal mail id"]} onChange={onChange} edit={edit} />
                <SelectField k="employee type" l="Employee Type" value={form["employee type"]} options={EMPLOYEE_TYPES} onChange={onChange} edit={edit} />
                <InputField k="date_of_joining" l="Date of Joining (DD/MM/YYYY)" value={form["date_of_joining"]} onChange={onChange} edit={edit} />
                <SelectField k="education" l="Education" value={form.education} options={EDUCATION_LIST} onChange={onChange} edit={edit} />
                <SelectField k="Specialization" l="Specialization" value={form.Specialization} options={SPECIALIZATIONS} onChange={onChange} edit={edit} />

                {edit && form["Specialization"] === "Other" &&
                    <InputField k="otherSpecialization" l="Specify Specialization" value={form.otherSpecialization} onChange={onChange} edit={edit} />}
            </div>
        </section>
    );
}
